![License](https://img.shields.io/badge/license-MIT-blue) ![Status](https://img.shields.io/badge/status-stable-brightgreen) ![Language](https://img.shields.io/badge/lang-PT-BR-brightgreen)

# 🐾 MiAu - Pet Shop & Bem-Estar

## 📌 Sobre o Projeto
O **MiAu** é um Sistema de Gestão Fullstack moderno, desenvolvido para clínicas veterinárias e pet shops. Criado como projeto acadêmico da disciplina do professor Henning (Semestre 2026.1), ele permite o controle completo de clientes (tutores), pacientes (pets), catálogo de serviços e controle de agendamentos.

## 🎯 Objetivos e Metas
- **Gestão Centralizada**: Substituir planilhas e processos manuais por um fluxo digital unificado e extremamente rápido.
- **Design Corporativo e Profissional**: Entregar uma experiência de usuário (UX/UI) refinada, baseada no rigoroso **Arco Design System**.
- **Arquitetura Moderna**: Frontend **Next.js** consumindo uma **RESTful API NestJS**, com Swagger integrado na própria aplicação.

## 🛠️ Tecnologias Utilizadas

### Frontend (`apps/web`)
- **Next.js 15** + **React 19** — App Router, rotas protegidas por JWT.
- **swagger-ui-react** — Swagger UI embarcado em `/docs` dentro do dashboard.
- **Arco Design System** — CSS customizado, FontAwesome, UI Avatars.

### Backend (`apps/api`)
- **NestJS 11** + **TypeORM** — API REST com validação (`class-validator`).
- **@nestjs/swagger** — Geração automática do OpenAPI via decorators.
- **`initSwagger(app)`** — Inicialização centralizada em `apps/api/src/swagger.ts`, chamada em `apps/api/src/main.ts`.
- **MariaDB / MySQL** — Banco relacional `miau_db`.

### Legado (preservado, não usado por padrão)
- `backend/` — FastAPI + Pydantic (stack anterior).
- `frontend/` — SPA vanilla HTML/CSS/JS (stack anterior).

## 📦 Estrutura de Módulos (Features)
- 👤 **Autenticação e Perfil**: Login JWT, gestão de perfil e avatar.
- 🔔 **Sistema de Notificações**: Mural de avisos com badge numérico.
- 🏠 **Home / Mural**: Painel de avisos do sistema.
- 👥 **Tutores & Pets**: CRUD unificado com foto do tutor e accordion de pets.
- 🏷️ **Serviços**: Catálogo comercial de banho, tosa, etc.
- 📅 **Agendamentos**: Cruzamento de tutores, pets e serviços.
- 📖 **API Docs**: Swagger UI integrado em `/docs` (sidebar "API Docs").

## 🚀 Como Executar o Projeto Localmente

### Estrutura do Projeto

```
MiAu/
├── package.json          # Monorepo npm (workspaces: apps/api, apps/web)
├── app.py                # Atalho → npm run dev
├── apps/
│   ├── api/              # NestJS — API REST + initSwagger(app)
│   └── web/              # Next.js — UI + Swagger em /docs
├── backend/              # FastAPI legado
├── database/             # Schema SQL e scripts de setup
├── deploy/               # Configuração de deploy (Vercel)
│   ├── vercel.json       # Espelho de apps/web/vercel.json
│   └── .env.example
├── docs/                 # openapi.json, openapi.yaml, guias
└── scripts/              # export-openapi.mjs
```

> **Deploy Vercel:** configure **Root Directory** = `apps/web`. O `deploy/vercel.json` espelha a config de produção (Next.js + handler NestJS em `api/nest.ts`).

### 1. Pré-requisitos
- **Node.js 20+** e **npm**.
- Servidor **MariaDB/MySQL** local (porta 3306).
- **Python 3** (opcional — só para `database/setup_db.py` e atalho `app.py`).

### 2. Configurar o Banco de Dados
```bash
python database/setup_db.py
```
> **Credenciais Padrão:** Login: `ShardCadu` | Senha: `cadu123`

### 3. Variáveis de Ambiente
Copie `deploy/.env.example` para `.env` na raiz:
```bash
cp deploy/.env.example .env
```

### 4. Instalar e Rodar
```bash
npm install
npm run dev
```
Ou use o atalho Python:
```bash
python app.py
```

Isso inicia:
- **NestJS** em `http://127.0.0.1:3001` (API + `/openapi.json` + `/api-docs`)
- **Next.js** em `http://127.0.0.1:3000` (app completa)

### 5. Acessar o Sistema
| Recurso | URL |
|---------|-----|
| App | http://127.0.0.1:3000 |
| Swagger integrado | http://127.0.0.1:3000/docs |
| OpenAPI JSON | http://127.0.0.1:3000/openapi.json |
| Swagger debug (NestJS) | http://127.0.0.1:3001/api-docs |

### 6. Documentação da API (Swagger)

O OpenAPI é gerado pelo NestJS via `initSwagger(app)`:

```typescript
// apps/api/src/main.ts
initSwagger(app);
```

A UI é renderizada pelo Next.js em `/docs` com `swagger-ui-react`, consumindo `/openapi.json` (proxy para a API NestJS).

- **Documentação Markdown:** [`docs/API-Swagger.md`](docs/API-Swagger.md)
- **Exportar spec estático:** `npm run export:openapi` (requer API rodando na porta 3001)
- **Importar no Swagger Hub:** [`docs/openapi.yaml`](docs/openapi.yaml)

**Autenticação no Swagger:**
1. Faça login no app (`ShardCadu` / `cadu123`) — o token é injetado automaticamente nas requisições.
2. Ou use **Authorize → OAuth2PasswordBearer** com as mesmas credenciais.
3. Ou cole o token manualmente em **Authorize → BearerJWT**.

---
## 👨‍💻 Contribuidores do MiAu
Desenvolvido, arquitetado e testado por: 
- **Bruno Souza**
- **Carlos Eduardo Alves**
- **Geraldo de Albuquerque**
- **João Paulo Paz**

**Recife - 2026**