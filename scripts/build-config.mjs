// Geração determinística do artefato distribuído; não lê config do usuário.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { agentIds, frontmatter } from './check.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const config = {
  $schema: 'https://opencode.ai/config.json',
  default_agent: 'qa-lead',
  agents: Object.fromEntries(agentIds.map(id => {
    const fm = frontmatter(readFileSync(resolve(root, `agents/${id}.md`), 'utf8'));
    return [id, { description: fm.description, mode: fm.mode, system: `{file:./agents/${id}.md}`, permissions: fm.permissions }];
  })),
  skills: ['./skills'],
  commands: Object.fromEntries(['qa-investigate', 'qa-e2e', 'qa-audit'].map(id => {
    const fm = frontmatter(readFileSync(resolve(root, `commands/${id}.md`), 'utf8'));
    return [id, { description: fm.description, agent: fm.agent, template: `{file:./commands/${id}.md}` }];
  })),
};
writeFileSync(resolve(root, 'opencode.json'), JSON.stringify(config, null, 2) + '\n');
