#!/usr/bin/env node
/**
 * Exporta docs/openapi.json (e docs/openapi.yaml) a partir do NestJS em execução.
 * Requer API rodando: npm run dev -w apps/api  (porta 3001)
 *
 * Uso: npm run export:openapi
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DOCS = join(ROOT, 'docs');
const API_URL = process.env.API_URL ?? 'http://127.0.0.1:3001';
const OPENAPI_URL = `${API_URL.replace(/\/$/, '')}/openapi.json`;

function reorderSpec(spec) {
  const ordered = {
    openapi: spec.openapi ?? '3.0.3',
    info: spec.info ?? {},
    servers: spec.servers ?? [],
    paths: spec.paths ?? {},
    components: spec.components ?? {},
    tags: spec.tags ?? [],
  };
  if (spec.externalDocs) ordered.externalDocs = spec.externalDocs;
  return ordered;
}

function toYaml(obj, indent = 0) {
  const pad = '  '.repeat(indent);
  if (obj === null || obj === undefined) return 'null\n';
  if (typeof obj !== 'object') {
    if (typeof obj === 'string') {
      if (/[:#\[\]{}&,*?]|^\s/.test(obj) || obj === '' || obj === 'true' || obj === 'false') {
        return JSON.stringify(obj) + '\n';
      }
      return obj + '\n';
    }
    return String(obj) + '\n';
  }
  if (Array.isArray(obj)) {
    if (obj.length === 0) return '[]\n';
    return obj.map((item) => `${pad}- ${toYaml(item, indent + 1).trimStart()}`).join('');
  }
  const lines = Object.entries(obj).map(([key, value]) => {
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      return `${pad}${key}:\n${toYaml(value, indent + 1)}`;
    }
    if (Array.isArray(value)) {
      if (value.length === 0) return `${pad}${key}: []\n`;
      return `${pad}${key}:\n${value.map((item) => `${pad}  - ${toYaml(item, indent + 2).trimStart()}`).join('')}`;
    }
    const scalar = toYaml(value, indent + 1).trimEnd();
    return `${pad}${key}: ${scalar}\n`;
  });
  return lines.join('');
}

async function main() {
  console.log(`Fetching ${OPENAPI_URL} ...`);

  let response;
  try {
    response = await fetch(OPENAPI_URL);
  } catch (err) {
    console.error('Erro: API NestJS não está acessível.');
    console.error('Inicie com: npm run dev -w apps/api');
    console.error(err.message);
    process.exit(1);
  }

  if (!response.ok) {
    console.error(`Erro HTTP ${response.status} ao buscar OpenAPI`);
    process.exit(1);
  }

  const spec = reorderSpec(await response.json());
  mkdirSync(DOCS, { recursive: true });

  const jsonPath = join(DOCS, 'openapi.json');
  writeFileSync(jsonPath, JSON.stringify(spec, null, 2) + '\n', 'utf-8');

  const yamlPath = join(DOCS, 'openapi.yaml');
  writeFileSync(yamlPath, toYaml(spec), 'utf-8');

  console.log(`OpenAPI JSON: ${jsonPath}`);
  console.log(`OpenAPI YAML: ${yamlPath}`);
  console.log(`servers: ${(spec.servers ?? []).length} entradas`);
  for (const s of spec.servers ?? []) {
    console.log(`  - ${s.url}`);
  }
}

main();
