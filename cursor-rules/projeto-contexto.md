# MiAu — Contexto do Projeto para Agentes

> Documento de contextualização para qualquer agente de IA trabalhando neste repositório.
> Leia este arquivo antes de implementar features, corrigir bugs ou fazer deploy.

## Visão Geral

**MiAu** é um sistema fullstack de gestão para clínicas veterinárias e pet shops. Projeto acadêmico da disciplina do professor Henning (Semestre 2026.1), desenvolvido por Carlos Eduardo (Cadu).

**Propósito:** substituir planilhas e processos manuais por um fluxo digital unificado para gestão de tutores, pets, serviços e agendamentos.

**Links:**
- Repositório: https://github.com/Dev-Carlos-Alves/MiAu-
- Deploy: https://mi-au.vercel.app

## Arquitetura

```
Browser (SPA vanilla)
    │ JWT Bearer
    ▼
FastAPI (porta 8000 local / serverless na Vercel)
    │ PyMySQL
    ▼
MariaDB / MySQL (miau_db)
```

**Modo local:** servidor unificado — FastAPI serve API + arquivos estáticos do frontend na mesma porta.

**Modo Vercel:** frontend estático na CDN + API Python serverless (`api/index.py`) + banco MySQL hospedado.

## Mapa de Pastas

| Caminho | Status | Descrição |
|---------|--------|-----------|
| `app.py` | **Ativo** | Entry point local — inicia Uvicorn na porta 8000 |
| `backend/main.py` | **Ativo** | FastAPI app completo (API + StaticFiles) para dev local |
| `backend/app_api.py` | **Ativo** | FastAPI app só API (sem static) para Vercel |
| `backend/routers/` | **Ativo** | Rotas auth e CRUD |
| `backend/auth.py` | **Ativo** | JWT, OAuth2, get_current_user |
| `backend/database.py` | **Ativo** | Conexão PyMySQL via env vars |
| `backend/schemas.py` | **Ativo** | Modelos Pydantic |
| `database/` | **Ativo** | schema.sql, setup_db.py, popular_teste.py |
| `frontend/` | **Ativo** | SPA (index.html, css/, js/, imagens/) |
| `public/` | **Ativo** | Build estático (copiado de `frontend/` no deploy) |
| `api/index.py` | **Ativo** | Entry point serverless Vercel |
| `cursor-rules/` | **Ativo** | Documentação para agentes |
| `backend/app.js`, `backend/bin/` | **Removido** | Express legado eliminado |
| `frontend/app.js`, `frontend/views/` | **Removido** | Express/EJS legado eliminado |
| `deploy/` | **Ativo** | Config Vercel (`vercel.json`, `package.json`, `pyproject.toml`, `.env.example`) |

## Módulos / Features

| Módulo | Status | Arquivos principais |
|--------|--------|---------------------|
| Autenticação JWT | Funcional | `auth_routes.py`, `frontend/js/api.js` |
| Perfil + Avatar | Funcional | `modal-perfil`, localStorage `aumiau_avatar` |
| Home / Mural | Funcional | `#mural-list` via `API.getAvisos()` |
| Notificações | Funcional | Dropdown alimentado por `/api/avisos` |
| Tutores CRUD | Create + delete | `#form-tutor` wired em `app.js` |
| Pets CRUD | Create + delete | `#form-pet` com selects; PUT backend |
| Serviços CRUD | Create + delete | `#form-servico` wired |
| Agendamentos CRUD | Create + delete | `#form-agendamento` com selects |
| Produtos/Estoque | Não existe | Mencionado no README |
| Modal Ajustes | Placeholder | Backlog documentado |

## Fluxo de Autenticação

1. Login via `POST /auth/login` (form-urlencoded OAuth2)
2. Resposta: `{ access_token, token_type: "bearer" }`
3. Token salvo em `localStorage['aumiau_token']`
4. Todas as chamadas API usam `apiFetch()` com header `Authorization: Bearer {token}`
5. Em 401: token removido e página recarregada

**Credenciais padrão (dev):** `ShardCadu` / `cadu123`

## Endpoints da API

### Auth (`/auth`)

| Método | Path | Auth | Descrição |
|--------|------|------|-----------|
| POST | `/auth/register` | Não | Criar usuário |
| POST | `/auth/login` | Não | Login OAuth2 form |
| GET | `/auth/me` | Sim | Perfil atual |
| PUT | `/auth/me` | Sim | Atualizar perfil |

### CRUD (`/api` — todas exigem JWT)

| Recurso | GET | POST | PUT | DELETE |
|---------|-----|------|-----|--------|
| `/api/tutores` | Sim | Sim | Sim (`/{id}`) | Sim |
| `/api/pets` | Sim | Sim | Sim (`/{id}`) | Sim |
| `/api/servicos` | Sim | Sim | **Nao** | Sim |
| `/api/agendamentos` | Sim | Sim | **Nao** | Sim |
| `/api/avisos` | Sim | Sim | **Nao** | Sim |

Documentação interativa: `/docs` (Swagger), `/redoc`

## Convenções de Código

### Frontend

- **Views:** `#login-view`, `#app-view` (toggle com `.hidden`)
- **Sections:** `#sec-{nome}` + nav link `data-target="{nome}"`
- **Modals:** `#modal-{nome}`, forms `#form-{nome}`
- **Tables:** `#tbody-{modulo}`
- **Form fields:** `{entity}-{field}` (ex: `tutor-nome`, `agen-data_hora`)
- **API client:** objeto global `API` com métodos camelCase em `frontend/js/api.js`
- **localStorage keys:** `aumiau_token`, `aumiau_avatar`

### Backend

- Routers em `backend/routers/` com `APIRouter`
- Dependency injection: `Depends(get_db)`, `Depends(get_current_user)`
- SQL raw com PyMySQL (`%s` placeholders)
- Schemas Pydantic em `backend/schemas.py`

## Como Executar Localmente

```bash
pip install -r backend/requirements.txt
python database/setup_db.py
python app.py
# Acesse http://127.0.0.1:8000
```

## Variáveis de Ambiente

Ver `deploy/.env.example`. Defaults em `backend/database.py` permitem rodar local sem `.env`.

| Variável | Default local | Descrição |
|----------|---------------|-----------|
| `DB_HOST` | `localhost` | Host do MySQL |
| `DB_USER` | `root` | Usuário do banco |
| `DB_PASSWORD` | `root` | Senha do banco |
| `DB_NAME` | `miau_db` | Nome do database |
| `JWT_SECRET_KEY` | (dev key) | Secret para JWT — **obrigatório trocar em produção** |

## Dividas Tecnicas / Backlog

1. **Edit mode nos modais** — PUT tutores/pets no UI (backend parcialmente pronto)
2. **Senhas texto puro** — implementar bcrypt
3. **Modulo produtos/estoque** — mencionado no README, nao implementado
4. **POST /auth/register** — backend existe, UI de login nao expoe
5. **Modal Ajustes** — placeholder sem configuracoes reais

## Deploy

Ver [`deploy-vercel.md`](deploy-vercel.md) para instruções completas de deploy na Vercel.

## Documentação Relacionada

- [`design-system.md`](design-system.md) — guia visual do frontend
- [`conversas-cadu-cursor.md`](conversas-cadu-cursor.md) — histórico de conversas com agentes
