import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, symlinkSync, lstatSync, readdirSync, rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { tmpdir } from 'node:os';

function fixture(fn) {
  const temporaryRoot = resolve(tmpdir(), 'opencode');
  mkdirSync(temporaryRoot, { recursive: true });
  const work = mkdtempSync(resolve(temporaryRoot, 'qa-install-'));
  try { fn(work); } finally { rmSync(work, { recursive: true, force: true }); }
}
function run(target, args = [], env = {}) {
  return spawnSync(process.execPath, ['scripts/install.mjs', ...args, '--target', target], { encoding: 'utf8', env: { PATH: process.env.PATH, ...env } });
}
test('copy and link handle spaces, resolve config without source changes and reject reruns', () => fixture(work => {
  const sourceConfig = readFileSync('opencode.json', 'utf8');
  for (const mode of ['--copy', '--symlink']) {
    const target = resolve(work, mode + ' with spaces');
    mkdirSync(resolve(target, 'agents'), { recursive: true });
    writeFileSync(resolve(target, 'agents/third-party.md'), 'third party');
    const result = run(target, [mode]);
    assert.equal(result.status, 0, result.stderr);
    const config = JSON.parse(readFileSync(resolve(target, 'opencode.json'), 'utf8'));
    assert.equal('mcp' in config, false);
    assert.equal(config.agents['qa-lead'].system, '{file:./agents/qa-lead.md}');
    assert.equal(lstatSync(resolve(target, 'agents/qa-lead.md')).isSymbolicLink(), mode === '--symlink');
    assert.equal(lstatSync(resolve(target, 'opencode.json')).isSymbolicLink(), false);
    assert.equal(Object.keys(config.commands).length, 3);
    assert.equal(existsSync(resolve(target, 'commands/qa-audit.md')), true);
    assert.equal(readFileSync(resolve(target, 'agents/third-party.md'), 'utf8'), 'third party');
    assert.notEqual(run(target, [mode]).status, 0);
    assert.notEqual(run(target, [mode === '--copy' ? '--symlink' : '--copy']).status, 0);
  }
  assert.equal(readFileSync('opencode.json', 'utf8'), sourceConfig);
}));
test('dry-run writes nothing and conflicts preserve all preexisting entries', () => fixture(work => {
  const absent = resolve(work, 'absent/deep');
  assert.equal(run(absent, ['--copy', '--dry-run']).status, 0);
  assert.deepEqual(readdirSync(work), []);
  for (const conflict of ['AGENTS.md', 'opencode.json', 'opencode.jsonc', 'agents/qa-lead.md', 'skills/qa-test-design', 'commands/qa-audit.md']) {
    const target = resolve(work, conflict.replaceAll('/', '-'));
    mkdirSync(resolve(target, 'agents'), { recursive: true });
    mkdirSync(resolve(target, 'skills'), { recursive: true });
    if (conflict.startsWith('commands/')) mkdirSync(resolve(target, 'commands'));
    writeFileSync(resolve(target, 'agents/third-party.md'), 'third party');
    writeFileSync(resolve(target, conflict), 'sentinel');
    assert.notEqual(run(target, ['--copy']).status, 0, conflict);
    assert.equal(readFileSync(resolve(target, conflict), 'utf8'), 'sentinel');
    if (!conflict.startsWith('commands/')) assert.equal(existsSync(resolve(target, 'commands')), false, 'preflight before any writes');
  }
}));
test('rejects target/ancestor/broken links and conflicting types without following them', () => fixture(work => {
  const real = resolve(work, 'real'); mkdirSync(real);
  const link = resolve(work, 'link'); symlinkSync(real, link);
  const broken = resolve(work, 'broken'); symlinkSync(resolve(work, 'missing'), broken);
  for (const target of [link, resolve(link, 'child'), broken]) assert.notEqual(run(target, ['--symlink']).status, 0);
  const target = resolve(work, 'types'); mkdirSync(target);
  writeFileSync(resolve(target, 'agents'), 'not directory');
  assert.notEqual(run(target, ['--copy']).status, 0);
  assert.equal(readFileSync(resolve(target, 'agents'), 'utf8'), 'not directory');
}));
test('partial failure rolls back only created entries, preserves third parties and uses synthetic default HOME', () => fixture(work => {
  const target = resolve(work, '.config/opencode');
  mkdirSync(resolve(target, 'agents'), { recursive: true });
  writeFileSync(resolve(target, 'agents/existing.md'), 'sentinel');
  const result = run(target, ['--copy'], { QA_INSTALL_TEST_FAIL_AFTER: '3' });
  assert.notEqual(result.status, 0);
  assert.deepEqual(readdirSync(resolve(target, 'agents')), ['existing.md']);
  assert.equal(readFileSync(resolve(target, 'agents/existing.md'), 'utf8'), 'sentinel');
  const home = resolve(work, 'home'); mkdirSync(home);
  const defaultRun = spawnSync(process.execPath, ['scripts/install.mjs', '--copy'], { encoding: 'utf8', env: { HOME: home, PATH: process.env.PATH } });
  assert.equal(defaultRun.status, 0, defaultRun.stderr);
  assert.ok(existsSync(resolve(home, '.config/opencode/agents/qa-lead.md')));
}));
