OPENAPI_TAGS = [
    {
        "name": "Autenticação",
        "description": "Login, registro e perfil do usuário. Tabela: `usuarios`.",
    },
    {
        "name": "Tutores",
        "description": "CRUD de donos dos pets. Tabela: `tutores`.",
    },
    {
        "name": "Pets",
        "description": "CRUD de pacientes (Cachorro/Gato). Tabela: `pets` (FK → tutores).",
    },
    {
        "name": "Serviços",
        "description": "Catálogo de serviços e preços. Tabela: `servicos`.",
    },
    {
        "name": "Agendamentos",
        "description": "Agendamentos cruzando tutor, pet e serviço. Tabela: `agendamentos`.",
    },
    {
        "name": "Avisos",
        "description": "Mural de avisos da Home. Tabela: `avisos`.",
    },
]

API_DESCRIPTION = """
## MiAu — API REST de Gestão Petshop

Backend **FastAPI** integrado ao banco **MariaDB/MySQL** (`miau_db`).

### Autenticação JWT

1. `POST /auth/login` — envie `username` e `password` (form-urlencoded)
2. Copie o `access_token` retornado
3. Clique em **Authorize** e informe: `Bearer {token}`
4. Rotas `/api/*` exigem token válido

**Usuário padrão:** `ShardCadu` / `cadu123`

### Tabelas do banco

| Tabela | Endpoints |
|--------|-----------|
| `usuarios` | `/auth/login`, `/auth/register`, `/auth/me` |
| `tutores` | `/api/tutores` |
| `pets` | `/api/pets` |
| `servicos` | `/api/servicos` |
| `agendamentos` | `/api/agendamentos` |
| `avisos` | `/api/avisos` |

Documentação completa: repositório → `docs/API-Swagger.md`
"""
