// Validation smoke, NOT an agent backend/runner. Existing CLI only.
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { createServer } from 'node:http';
import { randomBytes, createHash } from 'node:crypto';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, readdirSync, existsSync, rmSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import assert from 'node:assert/strict';
import { tmpdir } from 'node:os';

const exec = promisify(execFile);
const cli = process.env.QA_SMOKE_CLI;
const browserDir = process.env.QA_SMOKE_BROWSER_DIR;
if (!cli || !browserDir) {
  console.error('not_run: set QA_SMOKE_CLI and QA_SMOKE_BROWSER_DIR to existing installations. No downloads.');
  process.exitCode = 2;
} else {
  assert.ok(existsSync(cli) && existsSync(resolve(browserDir, 'chrome')), 'Existing CLI/browser required');
  const temporaryRoot = resolve(tmpdir(), 'opencode');
  mkdirSync(temporaryRoot, { recursive: true });
  const work = mkdtempSync(resolve(temporaryRoot, 'qa-cli-smoke-'));
  const session = 'qa-kit-' + randomBytes(4).toString('hex');
  const home = resolve(work, 'home'), artifacts = resolve(work, 'artifacts');
  for (const path of [home, artifacts, resolve(work, '.playwright')]) mkdirSync(path);
  writeFileSync(resolve(work, '.playwright/cli.config.json'), JSON.stringify({
    browser: { browserName: 'chromium', isolated: true,
      launchOptions: { executablePath: resolve(browserDir, 'chrome'), headless: true },
      contextOptions: { viewport: { width: 900, height: 600 } } },
    outputDir: artifacts, outputMode: 'stdout',
    timeouts: { action: 5000, navigation: 10000 },
  }));
  const sentinel = resolve(work, 'synthetic-production-sentinel');
  writeFileSync(sentinel, 'unchanged');
  const hash = () => createHash('sha256').update(readFileSync(sentinel)).digest('hex');
  const before = hash();
  const env = {
    HOME: home, XDG_CACHE_HOME: resolve(work, 'cache'), XDG_CONFIG_HOME: resolve(home, '.config'),
    PATH: `${dirname(process.execPath)}:/usr/bin:/bin`, NO_UPDATE_NOTIFIER: '1', CI: '1',
  };
  const server = createServer((req, res) => {
    if (req.url === '/ping') { res.end('synthetic-ok'); return; }
    res.setHeader('content-type', 'text/html; charset=utf-8');
    res.end(`<!doctype html><html lang="en"><title>QA CLI fixture</title>
      <label>Name<input aria-label="Name"></label><button id="go">Confirm</button>
      <output role="status">Ready</output>
      <script>console.log('synthetic console');fetch('/ping');
      go.onclick=()=>document.querySelector('output').textContent='Confirmed: '+document.querySelector('input').value;</script></html>`);
  });
  await new Promise(resolvePromise => server.listen(0, '127.0.0.1', resolvePromise));
  const origin = `http://127.0.0.1:${server.address().port}`;
  let opened = false, daemon, owned = [];
  const operations = [];
  const command = async (op, positional = []) => {
    const args = ['--json', `-s=${session}`, op];
    if (op === 'open') args.push('--idle-timeout=60000');
    args.push('--', ...positional);
    const { stdout } = await exec(cli, args, { shell: false, cwd: work, env, timeout: 25000, maxBuffer: 2_000_000 });
    const result = JSON.parse(stdout);
    assert.ok(!result.error && !result.isError, `CLI ${op} failed`);
    operations.push(op);
    return result;
  };
  const nodes = value => Array.isArray(value) ? value.flatMap(nodes) : value && typeof value === 'object' ? [value, ...Object.values(value).flatMap(nodes)] : [];
  function descendants(pid) {
    const rows = readdirSync('/proc').filter(n => /^\d+$/.test(n)).flatMap(n => {
      try { return [{ pid: +n, ppid: +readFileSync(`/proc/${n}/status`, 'utf8').match(/^PPid:\s+(\d+)/m)[1] }]; }
      catch { return []; }
    });
    const all = new Set([pid]); let previous;
    do { previous = all.size; for (const row of rows) if (all.has(row.ppid)) all.add(row.pid); } while (previous !== all.size);
    return [...all];
  }
  try {
    const version = (await exec(cli, ['--version'], { cwd: work, env, timeout: 5000 })).stdout.trim();
    assert.equal(version, '0.1.22');
    const initial = await command('open', [origin]); opened = true;
    daemon = initial.pid;
    assert.ok(Number.isInteger(daemon), 'CLI must report the PID of its exclusive session');
    owned = descendants(daemon);
    await command('goto', [`${origin}/next`]);
    const snapshot = await command('snapshot');
    const all = nodes(snapshot);
    const ref = all.find(n => n.role === 'textbox' && n.name === 'Name')?.ref;
    const button = all.find(n => n.role === 'button' && n.name === 'Confirm')?.ref;
    assert.ok(ref && button, 'refs must come from the actual snapshot');
    await command('fill', [ref, 'Synthetic QA']);
    await command('click', [button]);
    assert.match(JSON.stringify(await command('snapshot')), /Confirmed: Synthetic QA/);
    assert.match(JSON.stringify(await command('console')), /synthetic console/);
    assert.match(JSON.stringify(await command('requests')), /ping/);
    await command('screenshot');
    const pngs = readdirSync(artifacts).filter(n => n.endsWith('.png'));
    assert.ok(pngs.length > 0, 'screenshot must create a PNG in the test workspace');
    assert.equal(readFileSync(resolve(artifacts, pngs[0])).subarray(1, 4).toString(), 'PNG');
    owned = descendants(daemon);
    await command('close'); opened = false;
    const deadline = Date.now() + 5000;
    while (owned.some(pid => existsSync(`/proc/${pid}`)) && Date.now() < deadline) await new Promise(resolvePromise => setTimeout(resolvePromise, 20));
    assert.ok(owned.every(pid => !existsSync(`/proc/${pid}`)), 'Owned CLI/Chromium processes must exit');
    assert.equal(hash(), before);
    console.log(JSON.stringify({
      classification: 'live_smoke', verdict: 'works_as_specified', cliVersion: version,
      session: '<exclusive-qa-kit-8hex>', operations, screenshot: 'Actual PNG verified',
      syntheticSentinelUnchanged: true, cleanup: 'Owned session closed; fixture/workspace removed',
      limits: 'Direct CLI without OS isolation; does not prove confinement, network security or spec execution.',
    }, null, 2));
  } finally {
    if (opened || daemon && existsSync(`/proc/${daemon}`)) {
      try { await command('close'); } catch { /* Only this smoke's exclusive session. */ }
    }
    server.closeAllConnections();
    await new Promise(resolvePromise => server.close(resolvePromise));
    rmSync(work, { recursive: true, force: true });
  }
}
