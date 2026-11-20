import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { expectedPermissions, cliShellRules } from '../scripts/check.mjs';

test('somente explorer possui allows shell CLI específicos; config não registra MCP', () => {
  assert.ok(cliShellRules.length > 0);
  for (const [id, rules] of Object.entries(expectedPermissions)) {
    const allowed = rules.filter(r => r.action === 'shell' && r.effect === 'allow');
    assert.deepEqual(allowed, id === 'qa-browser-explorer' ? cliShellRules : []);
    assert.ok(allowed.every(r => r.resource.startsWith('NO_UPDATE_NOTIFIER=1 playwright-cli ')));
  }
  const config = JSON.parse(readFileSync('opencode.json', 'utf8'));
  assert.equal('mcp' in config, false);
  assert.equal(Object.keys(config.commands).length, 3);
});
