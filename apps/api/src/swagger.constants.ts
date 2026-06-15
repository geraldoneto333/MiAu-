export const API_DESCRIPTION = `
## MiAu — API REST de Gestão Petshop

Backend **NestJS** integrado ao banco **MariaDB/MySQL** (\`miau_db\`).

### Autenticação JWT

1. \`POST /auth/login\` — envie \`username\` e \`password\` (form-urlencoded)
2. Copie o \`access_token\` retornado
3. Clique em **Authorize** e informe: \`Bearer {token}\`
4. Rotas \`/api/*\` exigem token válido

**Usuário padrão:** \`ShardCadu\` / \`cadu123\`

### Tabelas do banco

| Tabela | Endpoints |
|--------|-----------|
| \`usuarios\` | \`/auth/login\`, \`/auth/register\`, \`/auth/me\` |
| \`tutores\` | \`/api/tutores\` |
| \`pets\` | \`/api/pets\` |
| \`servicos\` | \`/api/servicos\` |
| \`agendamentos\` | \`/api/agendamentos\` |
| \`avisos\` | \`/api/avisos\` |

Documentação completa: repositório → \`docs/API-Swagger.md\`
`;

export const OPENAPI_SERVERS = [
  { url: 'http://127.0.0.1:3000', description: 'Local (Next + Nest)' },
  { url: 'https://mi-au.vercel.app', description: 'Producao Vercel' },
];
