[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE) ![Status](https://img.shields.io/badge/status-stable-brightgreen) ![Language](https://img.shields.io/badge/lang-PT-BR-brightgreen)

# 🐾 MiAu - Pet Shop & Bem-Estar

## 📌 Sobre o Projeto
O **MiAu** é um sistema de gestão para clínicas veterinárias e pet shops, desenvolvido como projeto acadêmico para a disciplina do professor Henning (Semestre 2026.1).

O projeto atual está implementado como um backend em **FastAPI** com autenticação JWT e uma interface frontend estática em **HTML/CSS/JavaScript**, servida pelo mesmo servidor.

## 🎯 Objetivos
- Digitalizar e centralizar o controle de clientes, pets, serviços, produtos e agendamentos.
- Oferecer uma API REST com documentação Swagger/OpenAPI.
- Permitir execução local simples via Python e MariaDB/MySQL.

## 🛠️ Tecnologias Utilizadas
- Python 3
- FastAPI
- Uvicorn
- PyMySQL
- Pydantic
- python-jose
- passlib[bcrypt]
- python-dotenv
- MariaDB / MySQL
- HTML/CSS/JavaScript estático para frontend

## 📁 Estrutura do Projeto
```
MiAu/
├── app.py                 # Entrypoint local: inicia o FastAPI + frontend estático
├── backend/               # Backend FastAPI
│   ├── app_api.py         # App FastAPI apenas API
│   ├── auth.py            # JWT e autenticação
│   ├── database.py        # Conexão PyMySQL e env vars
│   ├── main.py            # Serve API + frontend estático
│   ├── openapi_config.py  # Enriquecimento do schema OpenAPI
│   ├── openapi_tags.py    # Tags e metadados do OpenAPI
│   ├── requirements.txt   # Dependências Python
│   ├── routers/           # Rotas de autenticação e CRUD
│   └── schemas.py         # Modelos Pydantic
├── backend/routers/
│   ├── api_routes.py      # CRUD de tutores, pets, serviços, produtos, agendamentos e avisos
│   └── auth_routes.py     # Login, registro e perfil
├── database/              # Schema SQL e scripts de setup
├── docs/                  # Documentação OpenAPI e coleções Postman
├── frontend/              # Interface web estática servida pelo backend
├── public/                # Cópia de arquivos estáticos do frontend
└── scripts/               # Scripts auxiliares (export OpenAPI)
```

## ✅ Funcionalidades Principais
- Autenticação JWT com login e perfil
- CRUD de **tutores**
- CRUD de **pets**
- CRUD de **serviços**
- CRUD de **produtos**
- CRUD de **agendamentos**
- CRUD de **avisos**
- API documentada em **Swagger**
- Frontend estático servido pelo mesmo servidor

## 🚀 Como Executar Localmente

### 1. Instalar dependências Python
```bash
python -m pip install -r backend/requirements.txt
```

### 2. Inicializar o banco de dados
```bash
python database/setup_db.py
```

### 3. Rodar a aplicação
```bash
python app.py
```

### 4. Acessar o sistema
- App: http://127.0.0.1:8000
- Swagger / API Docs: http://127.0.0.1:8000/docs

## 🔧 Configuração de Ambiente
O projeto usa variáveis de ambiente com valores default, então é possível rodar localmente sem arquivo `.env`.

Variáveis suportadas:
- `DB_HOST` (default: `localhost`)
- `DB_USER` (default: `root`)
- `DB_PASSWORD` (default: `root`)
- `DB_NAME` (default: `miau_db`)
- `DB_PORT` (default: `3306`)
- `JWT_SECRET_KEY` (default: `aumiau_super_secret_key_change_in_production`)
- `JWT_EXPIRE_MINUTES` (default: `120`)

> Em produção, defina um `JWT_SECRET_KEY` seguro e não use credenciais padrão.

## 🗄️ Banco de Dados
O script `database/setup_db.py` cria o banco `miau_db` e as tabelas:
- `usuarios`
- `tutores`
- `pets`
- `servicos`
- `produtos`
- `agendamentos`
- `avisos`

Também insere o usuário padrão:
- `username`: `ShardCadu`
- `email`: `cadu.sport@miau.com`
- `senha`: `cadu123`

## 📌 API e Swagger
A API tem rotas de autenticação em `/auth` e rotas CRUD sob `/api`.

Principais endpoints:
- `POST /auth/login`
- `POST /auth/register`
- `GET /auth/me`
- `PUT /auth/me`
- `GET/POST/PUT/DELETE /api/tutores`
- `GET/POST/PUT/DELETE /api/pets`
- `GET/POST/PUT/DELETE /api/servicos`
- `GET/POST/PUT/DELETE /api/produtos`
- `GET/POST/PUT/DELETE /api/agendamentos`
- `GET/POST/DELETE /api/avisos`

Swagger interativo:
- http://127.0.0.1:8000/docs

Gerar documentação OpenAPI estática:
```bash
python scripts/export_openapi.py
```

## 📚 Documentação Complementar
- `docs/API-Swagger.md`
- `docs/openapi.json`
- `docs/openapi.yaml`
- `docs/postman/MiAu-Login.postman_collection.json`
- `docs/postman/MiAu.postman_environment.json`

## 👨‍💻 Contribuidores
- **Bruno Souza**
- **Carlos Eduardo Alves**
- **Geraldo de Albuquerque**
- **João Paulo Paz**

**Recife - 2026**
