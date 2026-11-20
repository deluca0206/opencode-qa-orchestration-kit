import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { expectedPermissions, frontmatter } from '../scripts/check.mjs';

test('human decision enables edit:* for all five QA agents without allowing other tools', () => {
  const config = JSON.parse(readFileSync('opencode.json', 'utf8'));
  for (const [id, permissions] of Object.entries(expectedPermissions)) {
    assert.deepEqual(permissions.filter(p => p.action === 'edit'), [{ action: 'edit', resource: '*', effect: 'allow' }]);
    assert.deepEqual(frontmatter(readFileSync(`agents/${id}.md`, 'utf8')).permissions, permissions);
    assert.deepEqual(config.agents[id].permissions, permissions);
    assert.ok(!permissions.some(p => p.effect === 'allow' && ['execute', 'external_directory'].includes(p.action)));
    if (id !== 'qa-browser-explorer') assert.ok(!permissions.some(p => p.effect === 'allow' && p.action === 'shell'));
  }
});

test('native commands follow OAK with arguments and no inline shell', () => {
  for (const id of ['qa-investigate', 'qa-e2e', 'qa-audit']) {
    const text = readFileSync(`commands/${id}.md`, 'utf8');
    assert.ok(text.includes('$ARGUMENTS') && !text.includes('!`'), id);
  }
});
