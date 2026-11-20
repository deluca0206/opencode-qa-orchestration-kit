import test from 'node:test';
import assert from 'node:assert/strict';
import { check, frontmatter, expectedPermissions } from '../scripts/check.mjs';
import { readFileSync } from 'node:fs';

test('árvore aprovada satisfaz contratos estáticos', () => {
  assert.deepEqual(check(), []);
});

test('frontmatter restrito rejeita entradas inválidas', () => {
  assert.throws(() => frontmatter('sem frontmatter'));
  assert.throws(() => frontmatter('---\npermissions: [broken\n---\n'));
});

test('checker detecta expansão de privilégio, drift e comandos executáveis', () => {
  const original = path => readFileSync(path, 'utf8');
  const mutations = [
    ['agents/qa-lead.md', s => s.replace('"effect":"deny"', '"effect":"allow"')],
    ['agents/qa-bug-tracer.md', s => s.replace('"action":"read"', '"action":"shell"')],
    ['agents/qa-e2e-engineer.md', s => s.replace('"action":"edit","resource":"*","effect":"allow"', '"action":"edit","resource":"tests/**","effect":"allow"')],
    ['agents/qa-lead.md', s => s.replace('qa-bug-tracer","effect":"allow"', '*","effect":"allow"')],
    ['agents/qa-quality-auditor.md', s => s.replace('qa-test-design","effect":"allow"', '*","effect":"allow"')],
    ['commands/qa-audit.md', s => s + '\n!`uname`\n'],
    ['commands/qa-e2e.md', s => s.replace('$ARGUMENTS', '')],
    ['skills/qa-test-design/SKILL.md', s => s.replace('references/guide.md', 'references/missing.md')],
    ['opencode.json', s => s.replace('"default_agent": "qa-lead"', '"default_agent": "other"')],
    ['opencode.json', s => { const c = JSON.parse(s); c.commands['qa-audit'].agent = 'developer'; return JSON.stringify(c); }],
    ['opencode.json', s => { const c = JSON.parse(s); c.skills = ['../untrusted']; return JSON.stringify(c); }],
    ['opencode.json', s => { const c = JSON.parse(s); c.agents['qa-bug-tracer'].tools = { shell: true }; return JSON.stringify(c); }],
  ];
  for (const [path, mutate] of mutations) {
    const errors = check({ read: p => p === path ? mutate(original(p)) : original(p) });
    assert.ok(errors.length > 0, `mutação não detectada: ${path}`);
  }
});

test('allowlists preservam edit amplo e restringem execução/delegação', () => {
  for (const [id, permissions] of Object.entries(expectedPermissions)) {
    assert.deepEqual(permissions[0], { action: '*', resource: '*', effect: 'deny' });
    assert.ok(!permissions.some(r => r.effect === 'allow' && ['execute', 'external_directory'].includes(r.action)));
    if (id !== 'qa-browser-explorer') assert.ok(!permissions.some(r => r.effect === 'allow' && r.action === 'shell'));
    if (id !== 'qa-lead') assert.ok(!permissions.some(r => r.action === 'subagent'));
    assert.deepEqual(permissions.filter(r => r.action === 'edit'), [{ action: 'edit', resource: '*', effect: 'allow' }]);
  }
});
