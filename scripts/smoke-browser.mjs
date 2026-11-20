// Smoke de validação, NÃO backend/runner para agentes. Só CLI já instalada.
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
  console.error('not_run: configure QA_SMOKE_CLI e QA_SMOKE_BROWSER_DIR para instalações existentes. Nenhum download.');
  process.exitCode = 2;
} else {
  assert.ok(existsSync(cli) && existsSync(resolve(browserDir, 'chrome')), 'CLI/browser existentes obrigatórios');
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
    res.end(`<!doctype html><html lang="pt"><title>QA CLI fixture</title>
      <label>Nome<input aria-label="Nome"></label><button id="go">Confirmar</button>
      <output role="status">Pronto</output>
      <script>console.log('synthetic console');fetch('/ping');
      go.onclick=()=>document.querySelector('output').textContent='Confirmado: '+document.querySelector('input').value;</script></html>`);
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
    assert.ok(!result.error && !result.isError, `CLI ${op} falhou`);
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
    assert.ok(Number.isInteger(daemon), 'CLI deve informar PID de sua sessão exclusiva');
    owned = descendants(daemon);
    await command('goto', [`${origin}/next`]);
    const snapshot = await command('snapshot');
    const all = nodes(snapshot);
    const ref = all.find(n => n.role === 'textbox' && n.name === 'Nome')?.ref;
    const button = all.find(n => n.role === 'button' && n.name === 'Confirmar')?.ref;
    assert.ok(ref && button, 'refs devem vir do snapshot real');
    await command('fill', [ref, 'QA sintético']);
    await command('click', [button]);
    assert.match(JSON.stringify(await command('snapshot')), /Confirmado: QA sintético/);
    assert.match(JSON.stringify(await command('console')), /synthetic console/);
    assert.match(JSON.stringify(await command('requests')), /ping/);
    await command('screenshot');
    const pngs = readdirSync(artifacts).filter(n => n.endsWith('.png'));
    assert.ok(pngs.length > 0, 'screenshot deve criar PNG no workspace de teste');
    assert.equal(readFileSync(resolve(artifacts, pngs[0])).subarray(1, 4).toString(), 'PNG');
    owned = descendants(daemon);
    await command('close'); opened = false;
    const deadline = Date.now() + 5000;
    while (owned.some(pid => existsSync(`/proc/${pid}`)) && Date.now() < deadline) await new Promise(resolvePromise => setTimeout(resolvePromise, 20));
    assert.ok(owned.every(pid => !existsSync(`/proc/${pid}`)), 'CLI/Chromium próprios devem encerrar');
    assert.equal(hash(), before);
    console.log(JSON.stringify({
      classification: 'live_smoke', verdict: 'works_as_specified', cliVersion: version,
      session: '<exclusive-qa-kit-8hex>', operations, screenshot: 'PNG real verificado',
      syntheticSentinelUnchanged: true, cleanup: 'sessão própria fechada; fixture/workspace removidos',
      limits: 'CLI direto sem isolamento OS; não prova confinamento, segurança de rede ou execução de specs.',
    }, null, 2));
  } finally {
    if (opened || daemon && existsSync(`/proc/${daemon}`)) {
      try { await command('close'); } catch { /* Somente a sessão exclusiva deste smoke. */ }
    }
    server.closeAllConnections();
    await new Promise(resolvePromise => server.close(resolvePromise));
    rmSync(work, { recursive: true, force: true });
  }
}
