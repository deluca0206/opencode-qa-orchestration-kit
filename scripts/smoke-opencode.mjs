import { spawn, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync, readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { agentIds, skillIds } from './check.mjs';
import { tmpdir } from 'node:os';

const executable = process.env.QA_SMOKE_OPENCODE;
const reports = [];
if (!executable) {
  console.error('not_run: QA_SMOKE_OPENCODE deve apontar para OpenCode 2.3.2 existente.');
  process.exitCode = 2;
} else for (const mode of ['--copy', '--symlink']) {
  const root = process.cwd();
  const temporaryRoot = resolve(tmpdir(), 'opencode');
  mkdirSync(temporaryRoot, { recursive: true });
  const work = mkdtempSync(resolve(temporaryRoot, 'qa-opencode-'));
  const home = resolve(work, 'home'), app = resolve(work, 'app');
  mkdirSync(home); mkdirSync(app);
  const env = { HOME: home, XDG_CONFIG_HOME: resolve(home, '.config'), XDG_DATA_HOME: resolve(home, '.local/share'), XDG_CACHE_HOME: resolve(home, '.cache'), PATH: '/usr/bin:/bin', NO_UPDATE_NOTIFIER: '1',
    // Senha efêmera de fixture, nunca credencial do usuário; não imprimir.
    OPENCODE_PASSWORD: randomBytes(32).toString('hex'),
  };
  const version = spawnSync(executable, ['--version'], { cwd: app, env, encoding: 'utf8' });
  assert.match(version.stdout, /2\.3\.2/);
  const installed = spawnSync(process.execPath, [resolve(root, 'scripts/install.mjs'), mode, '--target', resolve(home, '.config/opencode')], { cwd: app, env, encoding: 'utf8' });
  assert.equal(installed.status, 0, installed.stderr);
  // Identifica app isolada sem tocar Git/config global.
  writeFileSync(resolve(app, 'sentinel.txt'), 'production-unchanged');
  const server = spawn(executable, ['serve', '--hostname', '127.0.0.1', '--port', '0', '--print-logs', '--log-level', 'debug'], { cwd: app, env, stdio: ['ignore', 'pipe', 'pipe'] });
  let output = '';
  function descendants() {
    const rows = readdirSync('/proc').filter(n => /^\d+$/.test(n)).flatMap(n => {
      try { return [{ pid: +n, ppid: +readFileSync(`/proc/${n}/status`, 'utf8').match(/^PPid:\s+(\d+)/m)[1] }]; }
      catch { return []; }
    });
    const all = new Set([server.pid]); let previous;
    do { previous = all.size; for (const r of rows) if (all.has(r.ppid)) all.add(r.pid); } while (previous !== all.size);
    return [...all].filter(pid => pid !== server.pid);
  }
  server.stdout.on('data', b => { output += b.toString(); });
  server.stderr.on('data', b => { output += b.toString(); });
  try {
    const started = Date.now();
    while (!/http:\/\/127\.0\.0\.1:\d+/.test(output)) {
      if (server.exitCode !== null || Date.now() - started > 20_000) throw new Error(`Servidor temporário não iniciou: ${output.slice(-1000)}`);
      await new Promise(resolvePromise => setTimeout(resolvePromise, 50));
    }
    const base = output.match(/http:\/\/127\.0\.0\.1:\d+/)[0];
    const request = async (path, method = 'GET', body) => {
      const args = ['api', '--server', base, method, path];
      if (body !== undefined) args.push('--data', JSON.stringify(body));
      const response = spawnSync(executable, args, { cwd: app, env, encoding: 'utf8', timeout: 20_000, maxBuffer: 8_000_000 });
      if (response.status !== 0) throw new Error(`${method} ${path}: ${response.stderr.slice(0, 600)}`);
      return response.stdout.trim() ? JSON.parse(response.stdout) : null;
    };
    const schema = await request('/openapi.json');
    const ops = Object.entries(schema.paths).flatMap(([path, methods]) => Object.entries(methods).filter(([, op]) => op.operationId).map(([method, op]) => ({ path, method, id: op.operationId })));
    assert.ok(ops.some(o => o.id === 'session.permission.create'));
    // A inicialização de plugins é assíncrona no 2.3.2: não confundir o
    // primeiro catálogo parcial com descoberta concluída.
    await request('/api/plugin');
    let agents, commands;
    const readyAt = Date.now();
    do {
      agents = (await request('/api/agent')).data;
      commands = (await request('/api/command')).data;
      if (agentIds.every(id => agents.some(a => a.id === id)) && commands.filter(c => c.name.startsWith('qa-')).length === 3) break;
      if (Date.now() - readyAt > 10_000) throw new Error('DISCOVERY_INCOMPLETE');
      await new Promise(resolvePromise => setTimeout(resolvePromise, 100));
    } while (true);
    assert.deepEqual(agents.filter(a => a.id.startsWith('qa-')).map(a => a.id).sort(), [...agentIds].sort());
    const skills = (await request('/api/skill')).data;
    assert.ok(skillIds.every(id => skills.some(s => s.id === id)));
    assert.deepEqual(commands.filter(c => c.name.startsWith('qa-')).map(c => c.name).sort(), ['qa-audit', 'qa-e2e', 'qa-investigate']);
    const mcp = (await request('/api/mcp')).data;
    assert.deepEqual(mcp, [], 'nenhum MCP é incluído no default CLI');
    const session = (await request('/api/session', 'POST', { title: 'QA native permission smoke', agent: 'qa-lead',
      model: { providerID: 'qa-no-network', id: 'qa-no-network' },
    })).data;
    assert.ok(session.id);
    const cases = [];
    for (const agent of agentIds) {
      for (const resource of ['src/proibido.ts', 'src/x.spec.ts']) cases.push({ agent, action: 'edit', resource, expected: 'allow' });
      for (const [action, resource] of [
        ['shell', 'echo nope'],
        ['execute', '*'], ['external_directory', '/outside'], ['other_mcp_tool', '*'],
        ['read', `${app}/.env`], ['read', `${app}/secrets/test.txt`],
      ]) cases.push({ agent, action, resource, expected: 'deny' });
      cases.push({ agent, action: 'read', resource: 'src/safe.ts', expected: 'allow' });
      cases.push({ agent, action: 'subagent', resource: 'developer', expected: 'deny' });
      if (agent !== 'qa-lead') cases.push({ agent, action: 'subagent', resource: 'qa-bug-tracer', expected: 'deny' });
      cases.push({ agent, action: 'qa_browser_snapshot', resource: '*', expected: 'deny' });
      const prefix = 'NO_UPDATE_NOTIFIER=1 playwright-cli --json -s=qa-kit-ab12cd34 ';
      for (const form of ['open --idle-timeout=60000 -- http://127.0.0.1:8123', 'goto -- http://127.0.0.1:8123/next', 'snapshot --', 'click -- e4', "fill -- e3 'QA fixture'", 'screenshot --', 'console --', 'requests --', 'close --']) {
        cases.push({ agent, action: 'shell', resource: prefix + form, expected: agent === 'qa-browser-explorer' ? 'allow' : 'deny' });
      }
      for (const flag of ['--help', '--version']) cases.push({ agent, action: 'shell', resource: `NO_UPDATE_NOTIFIER=1 playwright-cli ${flag}`, expected: agent === 'qa-browser-explorer' ? 'allow' : 'deny' });
      for (const resource of ['node -e 1', 'python -c 1', 'npx playwright test', prefix + 'eval -- 1', prefix + 'run-code -- 1', prefix + 'snapshot --; echo nope', prefix + 'snapshot -- | node', prefix + 'goto -- $(echo nope)']) {
        cases.push({ agent, action: 'shell', resource, expected: 'deny' });
      }
    }
    for (const resource of ['tests/new.spec.ts', 'e2e/new.spec.ts', 'playwright/new.spec.ts']) {
      // V2 ferramentas write/edit/patch pedem ação edit. As ações literais
      // desconhecidas "write"/"patch" continuam deny, não são essas ferramentas.
      for (const action of ['edit', 'write', 'patch']) cases.push({ agent: 'qa-e2e-engineer', action, resource, expected: action === 'edit' ? 'allow' : 'deny' });
    }
    for (const resource of ['__tests__/x.spec.ts', 'qa-reports/x.md']) cases.push({ agent: 'qa-e2e-engineer', action: 'edit', resource, expected: 'allow' });
    for (const resource of agentIds.filter(id => id !== 'qa-lead')) cases.push({ agent: 'qa-lead', action: 'subagent', resource, expected: 'allow' });
    const results = [];
    for (const c of cases) {
      const result = (await request(`/api/session/${session.id}/permission`, 'POST', { action: c.action, resources: [c.resource], agent: c.agent })).data;
      assert.equal(result.effect, c.expected, `${c.agent} ${c.action} ${c.resource}`);
      results.push({ ...c, effect: result.effect, resource: c.resource.replaceAll(app, '<app>') });
    }
    // Probes do limite do matcher: nenhuma ferramenta de escrita é invocada.
    const gaps = [];
    mkdirSync(resolve(app, 'tests')); mkdirSync(resolve(app, 'src'));
    writeFileSync(resolve(app, 'src/production.txt'), 'production-unchanged');
    const { symlinkSync, linkSync } = await import('node:fs');
    symlinkSync('../src/production.txt', resolve(app, 'tests/alias.txt'));
    linkSync(resolve(app, 'src/production.txt'), resolve(app, 'tests/hardlink.txt'));
    for (const resource of ['tests/../src/production.txt', 'tests/alias.txt', 'tests/hardlink.txt']) {
      const response = (await request(`/api/session/${session.id}/permission`, 'POST', { agent: 'qa-e2e-engineer', action: 'edit', resources: [resource] })).data;
      assert.equal(response.effect, 'allow', resource);
      gaps.push({ resource, effect: response.effect, note: 'Esperado no requisito modificado; risco aceito. Prompt proíbe semanticamente produção, sem confinamento técnico.' });
    }
    assert.equal(readFileSync(resolve(app, 'src/production.txt'), 'utf8'), 'production-unchanged');
    await request(`/api/session/${session.id}`, 'DELETE');
    reports.push({
      mode, version: version.stdout.trim(), classification: 'live_smoke',
      discovery: { agents: 5, commands: 3, skills: 5, mcp: 'none' },
      nativeEngine: { passed: results.length, results, gaps },
      commandInterpolation: 'Risco histórico preservado; comandos nativos restaurados por direção humana. Somente argumentos confiáveis, sem alegação de escaping/bloqueio.',
      writingDecision: 'edit:* habilitado nos cinco QA por HITL; escopo de produção somente comportamental. Writer separado cancelado.',
      not_run: ['Invocação real write/edit/patch/subagent e normalização: sem endpoint público arbitrário/modelo autorizado.', 'Resistência comportamental do modelo a prompt injection: sem modelo/credenciais.'],
    });
  } finally {
    const owned = descendants();
    if (server.exitCode === null) {
      const done = new Promise(resolvePromise => server.once('exit', resolvePromise));
      server.kill('SIGTERM');
      const timer = setTimeout(() => server.kill('SIGKILL'), 5000);
      await done; clearTimeout(timer);
    }
    const deadline = Date.now() + 3000;
    while (owned.some(pid => existsSync(`/proc/${pid}`)) && Date.now() < deadline) await new Promise(resolvePromise => setTimeout(resolvePromise, 10));
    assert.ok(owned.every(pid => !existsSync(`/proc/${pid}`)), 'servidor temporário deve encerrar processos próprios');
    rmSync(work, { recursive: true, force: true });
  }
}
if (reports.length) console.log(JSON.stringify(reports, null, 2));
