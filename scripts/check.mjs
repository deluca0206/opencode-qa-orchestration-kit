import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const rule = (action, resource, effect = 'allow') => ({ action, resource, effect });
export const skillIds = ['playwright-cli-nav', 'bug-code-correlation', 'playwright-e2e-suite', 'api-contract-testing', 'qa-test-design'];
export const agentSkills = {
  'qa-lead': skillIds,
  'qa-browser-explorer': ['playwright-cli-nav'],
  'qa-bug-tracer': ['bug-code-correlation'],
  'qa-e2e-engineer': ['playwright-e2e-suite', 'api-contract-testing'],
  'qa-quality-auditor': ['qa-test-design'],
};
export const cliShellRules = [
  ...['open --idle-timeout=60000 -- *', 'goto -- *', 'snapshot --', 'click -- *', 'fill -- *', 'screenshot --', 'console --', 'requests --', 'close --']
    .map(form => rule('shell', `NO_UPDATE_NOTIFIER=1 playwright-cli --json -s=qa-kit-???????? ${form}`)),
  ...['--version', '--help'].map(form => rule('shell', `NO_UPDATE_NOTIFIER=1 playwright-cli ${form}`)),
];
const cliShellDenies = ['*;*', '*&*', '*|*', '*`*', '*$(*', '*\n*', '*\r*', '*>*', '*<*', '*#*']
  .map(resource => rule('shell', resource, 'deny'));
export const agentIds = Object.keys(agentSkills);
const secretPatterns = ['**/.env', '**/.env.*', '**/secrets/**', '**/credentials/**', '**/*.pem', '**/*.key', '**/.git/**', '**/.npmrc', '**/.netrc', '**/id_rsa*', '**/id_ed25519*'];
export const expectedPermissions = Object.fromEntries(agentIds.map(id => [id, [
  rule('*', '*', 'deny'),
  ...['read', 'glob', 'grep', 'question'].map(action => rule(action, '*')),
  ...agentSkills[id].map(skill => rule('skill', skill)),
  rule('edit', '*'),
  ...(id === 'qa-lead' ? agentIds.filter(a => a !== id).map(a => rule('subagent', a)) : []),
  ...(id === 'qa-browser-explorer' ? [...cliShellRules, ...cliShellDenies] : []),
  ...secretPatterns.map(path => rule('*', path, 'deny')),
  rule('external_directory', '*', 'deny'),
]]));

// Subconjunto intencional de YAML: escalares numa linha e JSON inline para arrays.
// Não é parser YAML genérico nem emulador das permissões do OpenCode.
export function frontmatter(text) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(text);
  if (!match) throw new Error('frontmatter ausente');
  const result = {};
  for (const line of match[1].split(/\r?\n/)) {
    const entry = /^([a-z_]+): (.+)$/.exec(line);
    if (!entry || Object.hasOwn(result, entry[1])) throw new Error('frontmatter inválido/duplicado');
    result[entry[1]] = ['[', '{', '"'].includes(entry[2][0]) ? JSON.parse(entry[2]) : entry[2];
  }
  return result;
}

export function check({ read = path => readFileSync(resolve(root, path), 'utf8') } = {}) {
  const errors = [];
  const require = (condition, message) => { if (!condition) errors.push(message); };
  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  const inspect = (path, fn) => {
    try { fn(read(path)); } catch (error) { errors.push(`${path}: ${error.message}`); }
  };
  const ids = (directory, suffix) => readdirSync(resolve(root, directory)).filter(n => n.endsWith(suffix)).sort();
  require(same(ids('agents', '.md'), agentIds.map(id => `${id}.md`).sort()), 'IDs de agentes');
  require(same(readdirSync(resolve(root, 'skills')).sort(), [...skillIds].sort()), 'IDs de skills');
  const commandIds = ['qa-investigate', 'qa-e2e', 'qa-audit'];
  require(same(ids('commands', '.md'), commandIds.map(id => `${id}.md`).sort()), 'IDs de comandos');
  for (const id of agentIds) inspect(`agents/${id}.md`, text => {
    const fm = frontmatter(text);
    require(same(Object.keys(fm).sort(), ['description', 'mode', 'permissions']), `${id}: campos frontmatter`);
    require(Boolean(fm.description), `${id}: description`);
    require(fm.mode === (id === 'qa-lead' ? 'primary' : 'subagent'), `${id}: mode`);
    require(same(fm.permissions, expectedPermissions[id]), `${id}: permissões fora do contrato`);
    require(!Object.keys(fm).some(k => ['tools', 'permission'].includes(k)), `${id}: legado`);
    for (const heading of ['## MUST DO', "## WON'T DO", '## Saída']) require(text.includes(heading), `${id}: ${heading}`);
  });
  inspect('opencode.json', text => {
    const config = JSON.parse(text);
    require(same(Object.keys(config).sort(), ['$schema', 'agents', 'commands', 'default_agent', 'skills']), 'config campos');
    require(config.$schema === 'https://opencode.ai/config.json', 'config schema');
    require(config.default_agent === 'qa-lead', 'default_agent');
    require(same(Object.keys(config.agents).sort(), [...agentIds].sort()), 'config agents');
    require(!('permissions' in config), 'não alterar permissões de agentes não QA');
    require(!['agent', 'permission', 'tools'].some(k => k in config), 'config legado');
    require(same(config.skills, ['./skills']), 'config skills');
    require(!('mcp' in config), 'MCP não incluído no default CLI');
    require(same(Object.keys(config.commands).sort(), [...commandIds].sort()), 'config commands IDs');
    for (const id of commandIds) {
      const c = config.commands[id];
      require(c.agent === 'qa-lead' && c.template === `{file:./commands/${id}.md}` && Boolean(c.description), `${id}: config comando`);
    }
    for (const id of agentIds) {
      const a = config.agents[id];
      require(same(Object.keys(a).sort(), ['description', 'mode', 'permissions', 'system']), `${id}: config campos`);
      require(a?.system === `{file:./agents/${id}.md}`, `${id}: system`);
      require(a?.mode === (id === 'qa-lead' ? 'primary' : 'subagent'), `${id}: config mode`);
      require(same(a?.permissions, expectedPermissions[id]), `${id}: config permissions`);
    }
  });
  for (const id of skillIds) inspect(`skills/${id}/SKILL.md`, text => {
    const fm = frontmatter(text);
    require(fm.name === id && Boolean(fm.description), `${id}: frontmatter`);
    for (const heading of ['## MUST DO', "## WON'T DO"]) require(text.includes(heading), `${id}: ${heading}`);
    const links = [...text.matchAll(/\]\(((?:references|templates)\/[^)]+)\)/g)].map(m => m[1]);
    require(links.some(p => p.startsWith('references/')) && links.some(p => p.startsWith('templates/')), `${id}: referências/templates`);
    for (const link of links) {
      const path = resolve(root, 'skills', id, link);
      require(path.startsWith(resolve(root, 'skills', id) + '/') && existsSync(path), `${id}: link ${link}`);
    }
  });
  for (const id of commandIds) inspect(`commands/${id}.md`, text => {
    const fm = frontmatter(text);
    require(fm.agent === 'qa-lead' && Boolean(fm.description), `${id}: frontmatter`);
    require(text.includes('$ARGUMENTS'), `${id}: argumentos OAK`);
    require(!/!`|!\$?\(/.test(text), `${id}: shell interpolation proibida`);
  });
  inspect('docs/ai/baseline-drafts.json', text => {
    const baseline = JSON.parse(text);
    require(Object.keys(baseline.files).length === 4, 'baseline: quatro rascunhos');
    for (const [path, hash] of Object.entries(baseline.files)) {
      const actual = createHash('sha256').update(readFileSync(resolve(root, path))).digest('hex');
      require(actual === hash, `rascunho alterado: ${path}`);
    }
  });
  return errors;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const errors = check();
    if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
    else console.log('Contratos estáticos OK; runtime enforcement NÃO verificado.');
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
