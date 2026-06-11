# MiAu — Deploy na Vercel

> Guia para deploy do MiAu na Vercel com API serverless e banco MySQL hospedado.

## Arquitetura de Deploy

```
Usuário
  ├── CDN Vercel → frontend/ (HTML, CSS, JS, imagens)
  └── Serverless Python → api/index.py (FastAPI)
        └── MySQL hospedado (Railway, PlanetScale, Aiven, etc.)
```

## Pré-requisitos

1. Conta Vercel conectada ao GitHub (OAuth — **não use PAT manual**)
2. Repositório: https://github.com/Dev-Carlos-Alves/MiAu-
3. Banco MySQL/MariaDB acessível pela internet
4. Plugin Vercel no Cursor (já habilitado em `.cursor/settings.json`)

## Passo 1 — Provisionar Banco MySQL

A Vercel **não** roda MariaDB local. Opções de hospedagem:

| Serviço | Notas |
|---------|-------|
| [Railway](https://railway.app) | MySQL/MariaDB fácil de provisionar |
| [PlanetScale](https://planetscale.com) | MySQL serverless (free tier) |
| [Aiven](https://aiven.io) | MySQL managed |
| Vercel Marketplace | Integrações de storage |

Após criar o banco, anote: `host`, `user`, `password`, `database name`, `port`.

## Passo 2 — Aplicar Schema

Execute o schema no banco remoto:

```bash
mysql -h SEU_HOST -u SEU_USER -p SEU_DATABASE < database/schema.sql
```

Ou use o cliente SQL do provedor para colar o conteúdo de `database/schema.sql`.

Isso cria as tabelas e o usuário admin padrão (`ShardCadu` / `cadu123`).

## Passo 3 — Variáveis de Ambiente na Vercel

No dashboard Vercel → Project → Settings → Environment Variables:

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `DB_HOST` | Sim | Host do MySQL remoto |
| `DB_USER` | Sim | Usuário do banco |
| `DB_PASSWORD` | Sim | Senha do banco |
| `DB_NAME` | Sim | Nome do database (`miau_db`) |
| `DB_PORT` | Não | Porta (default `3306`) |
| `JWT_SECRET_KEY` | Sim | String aleatória longa para produção |

**Gerar JWT secret:**
```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

Aplique as variáveis para **Production**, **Preview** e **Development**.

## Passo 4 — Deploy Automático

Configuração de deploy em `deploy/`. Na raiz, `vercel.json` e `pyproject.toml` são **symlinks** para `deploy/` (exigência da plataforma Vercel). Ao fazer push para `main`, a Vercel detecta e faz deploy.

Estrutura de deploy:
- Build (via `deploy/pyproject.toml`) — copia `frontend/` → `public/` (Vercel só serve estáticos de `public/`)
- Local: `cd deploy && npm run build`
- `api/index.py` — FastAPI serverless (rotas `/auth/*`, `/api/*`, `/docs`)
- `public/` — gerado no build (não commitado; ver `.gitignore`)
- `api/requirements.txt` — dependências Python

## Passo 5 — Verificar Deploy

1. Acesse https://mi-au.vercel.app
2. Faça login com `ShardCadu` / `cadu123`
3. Teste listagem de tutores/pets
4. Verifique `/docs` para Swagger da API

## Desenvolvimento Local vs Produção

| Aspecto | Local | Vercel |
|---------|-------|--------|
| Entry point | `python app.py` | `api/index.py` |
| FastAPI app | `backend/main.py` (API + static) | `backend/app_api.py` (só API) |
| API URL frontend | `window.location.origin` | Mesmo domínio |
| Banco | MariaDB localhost | MySQL hospedado |
| Config | Defaults ou `.env` local | Env vars no dashboard |

## Arquivos de Configuração

| Arquivo | Função |
|---------|--------|
| `deploy/vercel.json` | Rewrites, runtime Python, rotas estáticas |
| `deploy/pyproject.toml` | Deps Python + build + entrypoint Vercel |
| `deploy/package.json` | Build local (`npm run build`) |
| `deploy/.env.example` | Template de variáveis (não commitar `.env`) |
| `api/index.py` | Handler serverless FastAPI |
| `api/requirements.txt` | Deps Python para Vercel |
| `backend/app_api.py` | App FastAPI sem StaticFiles |

## Segurança

- **Nunca** commitar `.env`, tokens ou senhas
- **Revogar** qualquer PAT do GitHub exposto acidentalmente
- Trocar `JWT_SECRET_KEY` em produção (não usar default)
- Trocar senha do admin padrão após primeiro login em produção
- Considerar implementar bcrypt para senhas (backlog)

## Troubleshooting

| Problema | Solução |
|----------|---------|
| 500 na API | Verificar env vars no dashboard Vercel |
| Erro de conexão DB | Confirmar host/porta acessíveis externamente; whitelist IP se necessário |
| Frontend sem CSS | Verificar rewrites de `/css/*` e `/js/*` no vercel.json |
| Login falha | Confirmar schema.sql rodou no banco remoto |
| CORS errors | CORS está `allow_origins=["*"]` — deve funcionar |

## Logs

```bash
vercel logs mi-au.vercel.app
```

Ou via dashboard Vercel → Project → Deployments → Function logs.
