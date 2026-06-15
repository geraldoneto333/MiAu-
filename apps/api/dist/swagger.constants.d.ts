export declare const API_DESCRIPTION = "\n## MiAu \u2014 API REST de Gest\u00E3o Petshop\n\nBackend **NestJS** integrado ao banco **MariaDB/MySQL** (`miau_db`).\n\n### Autentica\u00E7\u00E3o JWT\n\n1. `POST /auth/login` \u2014 envie `username` e `password` (form-urlencoded)\n2. Copie o `access_token` retornado\n3. Clique em **Authorize** e informe: `Bearer {token}`\n4. Rotas `/api/*` exigem token v\u00E1lido\n\n**Usu\u00E1rio padr\u00E3o:** `ShardCadu` / `cadu123`\n\n### Tabelas do banco\n\n| Tabela | Endpoints |\n|--------|-----------|\n| `usuarios` | `/auth/login`, `/auth/register`, `/auth/me` |\n| `tutores` | `/api/tutores` |\n| `pets` | `/api/pets` |\n| `servicos` | `/api/servicos` |\n| `agendamentos` | `/api/agendamentos` |\n| `avisos` | `/api/avisos` |\n\nDocumenta\u00E7\u00E3o completa: reposit\u00F3rio \u2192 `docs/API-Swagger.md`\n";
export declare const OPENAPI_SERVERS: {
    url: string;
    description: string;
}[];
