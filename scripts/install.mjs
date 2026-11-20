import { lstatSync, readdirSync, readFileSync, mkdirSync, symlinkSync, writeFileSync, unlinkSync, rmdirSync, openSync, closeSync } from 'node:fs';
import { dirname, resolve, parse, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { homedir } from 'node:os';

const source = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const agents = ['qa-lead', 'qa-browser-explorer', 'qa-bug-tracer', 'qa-e2e-engineer', 'qa-quality-auditor'];
const skills = ['playwright-cli-nav', 'bug-code-correlation', 'playwright-e2e-suite', 'api-contract-testing', 'qa-test-design'];
const commands = ['qa-investigate', 'qa-e2e', 'qa-audit'];
const inventory = [...agents.map(id => `agents/${id}.md`), ...skills.map(id => `skills/${id}`), ...commands.map(id => `commands/${id}.md`), 'AGENTS.md', 'opencode.json'];
function stat(path) { try { return lstatSync(path); } catch (e) { if (e.code === 'ENOENT') return null; throw e; } }
function safeAncestors(path, include = true) {
  const chain = [];
  for (let p = include ? path : dirname(path); ; p = dirname(p)) {
    chain.push(p); if (p === parse(p).root) break;
  }
  for (const p of chain.reverse()) {
    const s = stat(p);
    if (s && (s.isSymbolicLink() || !s.isDirectory())) throw new Error(`Destino/ancestral não é diretório real: ${p}`);
  }
}
function validateSource(path) {
  const s = lstatSync(path);
  if (s.isSymbolicLink() || (!s.isDirectory() && !s.isFile())) throw new Error(`Fonte não regular: ${path}`);
  if (s.isDirectory()) for (const name of readdirSync(path)) validateSource(join(path, name));
}
function main() {
  let mode, dry = false, targetSeen = false, target = resolve(homedir(), '.config/opencode');
  const args = process.argv.slice(2);
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (['--copy', '--symlink'].includes(arg) && !mode) mode = arg;
    else if (arg === '--dry-run' && !dry) dry = true;
    else if (arg === '--target' && !targetSeen && args[i + 1] && !args[i + 1].startsWith('--')) { target = resolve(args[++i]); targetSeen = true; }
    else throw new Error('Uso: install.sh --copy|--symlink [--target PATH] [--dry-run]');
  }
  if (!mode) throw new Error('Escolha exatamente --copy ou --symlink');
  safeAncestors(target);
  if (target === source || target.startsWith(source + '/')) throw new Error('Destino não pode estar dentro da fonte');
  if (stat(resolve(target, 'opencode.jsonc'))) throw new Error('Conflito: opencode.jsonc');
  // Preflight completo: nenhuma criação ocorre até validar todas entradas.
  for (const entry of inventory) {
    validateSource(resolve(source, entry));
    const dest = resolve(target, entry);
    safeAncestors(dest, false);
    if (stat(dest)) throw new Error(`Conflito: ${dest}; nada será sobrescrito/mesclado`);
  }
  const config = JSON.parse(readFileSync(resolve(source, 'opencode.json'), 'utf8'));
  // Config materializada nos dois modos; referências relativas aos assets
  // funcionam em copy e symlink, sem tocar configuração da fonte.
  const generated = JSON.stringify(config, null, 2) + '\n';
  if (dry) {
    console.log(`dry-run: ${mode}, ${target}; ${inventory.length} entradas, zero escritas.`);
    return;
  }
  const created = [];
  function record(path, dir) {
    const s = lstatSync(path);
    created.push({ path, dir, dev: s.dev, ino: s.ino });
  }
  function directory(path) {
    safeAncestors(path);
    if (stat(path)) return;
    directory(dirname(path));
    mkdirSync(path, { mode: 0o700 }); record(path, true);
  }
  function createFile(path, contents, mode) {
    const fd = openSync(path, 'wx', mode);
    try { record(path, false); writeFileSync(fd, contents); }
    finally { closeSync(fd); }
  }
  function copy(from, to) {
    const s = lstatSync(from);
    if (s.isDirectory()) {
      mkdirSync(to, { mode: 0o700 }); record(to, true);
      for (const name of readdirSync(from)) copy(join(from, name), join(to, name));
    } else {
      createFile(to, readFileSync(from), s.mode & 0o777);
    }
  }
  try {
    let count = 0;
    for (const entry of inventory) {
      const dest = resolve(target, entry);
      directory(dirname(dest));
      safeAncestors(dest, false);
      if (stat(dest)) throw new Error(`Conflito durante instalação: ${dest}`);
      if (entry === 'opencode.json') {
        createFile(dest, generated, 0o600);
      } else if (mode === '--symlink') {
        symlinkSync(resolve(source, entry), dest); record(dest, false);
      } else copy(resolve(source, entry), dest);
      // Failpoint apenas para testes locais: causa falha, nunca executa hooks.
      if (process.env.QA_INSTALL_TEST_FAIL_AFTER === String(++count)) throw new Error('Falha induzida de teste');
    }
    console.log(`Instalado ${mode} em ${target}. Config materializada; reexecução com colisão falha.`);
  } catch (error) {
    const residual = [];
    for (const entry of created.reverse()) {
      try {
        safeAncestors(entry.path, false);
        const current = lstatSync(entry.path);
        if (current.dev !== entry.dev || current.ino !== entry.ino) throw new Error('Entrada substituída por terceiro');
        entry.dir ? rmdirSync(entry.path) : unlinkSync(entry.path);
      }
      catch { residual.push(entry.path); }
    }
    throw new Error(`${error.message}; rollback apenas das entradas próprias${residual.length ? `; resíduos preservados: ${residual.join(', ')}` : '; concluído'}`);
  }
}
try { main(); } catch (error) { console.error(error.message); process.exitCode = 1; }
