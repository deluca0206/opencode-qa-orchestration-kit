import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

test('three consumers provision a missing temporary parent without manual setup', () => {
  const root = resolve(tmpdir(), 'opencode');
  mkdirSync(root, { recursive: true });
  const fixture = mkdtempSync(resolve(root, 'qa-r1-regression-'));
  try {
    const fake = resolve(fixture, 'version-fixture');
    writeFileSync(fake, "#!/bin/sh\nprintf '%s\\n' 'R1-fixture-version'\n", { mode: 0o700 });
    const browser = resolve(fixture, 'browser');
    mkdirSync(browser);
    writeFileSync(resolve(browser, 'chrome'), 'fixture; do not execute');
    const cases = [
      { path: 'tests/install.test.mjs', prefix: 'qa-install-', success: true },
      { path: 'scripts/smoke-browser.mjs', prefix: 'qa-cli-smoke-', env: { QA_SMOKE_CLI: fake, QA_SMOKE_BROWSER_DIR: browser } },
      { path: 'scripts/smoke-opencode.mjs', prefix: 'qa-opencode-', env: { QA_SMOKE_OPENCODE: fake } },
    ];
    for (const [index, c] of cases.entries()) {
      const absent = resolve(fixture, `consumer-${index}`, 'missing-parent');
      assert.equal(existsSync(absent), false);
      // Redirect only the legacy prefix in a fixture copy, never the real shared
      // directory. RED thus reproduces ENOENT even when the harness already has
      // /tmp/opencode. Corrected code uses TMPDIR without replacement.
      const copy = resolve(fixture, `consumer-${index}.mjs`);
      const source = readFileSync(c.path, 'utf8')
        .replace(`mkdtempSync('/tmp/opencode/${c.prefix}')`, `mkdtempSync(${JSON.stringify(resolve(absent, 'opencode', c.prefix))})`)
        .replace("from './check.mjs'", `from '${pathToFileURL(resolve('scripts/check.mjs')).href}'`);
      writeFileSync(copy, source);
      const env = { ...process.env, ...c.env, TMPDIR: absent };
      // The subprocess is an independent runner, not the parent node:test IPC child.
      delete env.NODE_TEST_CONTEXT;
      const result = spawnSync(process.execPath, [...(c.success ? ['--test'] : []), copy], {
        encoding: 'utf8', timeout: 30000,
        env,
      });
      assert.equal(result.error, undefined);
      assert.doesNotMatch(result.stderr + result.stdout, /ENOENT/, `${c.path}: mkdtemp must not depend on a pre-created parent`);
      assert.equal(existsSync(resolve(absent, 'opencode')), true, `${c.path} must create the parent`);
      if (c.success) assert.equal(result.status, 0, result.stderr + result.stdout);
      else {
        // Smokes must reach version validation rather than fail at mkdtemp.
        // This deterministic regression needs no real CLI/browser/OpenCode.
        assert.notEqual(result.status, 0);
        assert.match(result.stderr, /R1-fixture-version/);
        assert.doesNotMatch(result.stderr, /ENOENT/);
      }
    }
  } finally { rmSync(fixture, { recursive: true, force: true }); }
});
