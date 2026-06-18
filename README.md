[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE) ![Status](https://img.shields.io/badge/status-stable-brightgreen) ![Language](https://img.shields.io/badge/lang-PT-BR-brightgreen)

# 🐾 MiAu - Pet Shop & Bem-Estar

## 📌 Sobre o Projeto
O **MiAu** é um Sistema de Gestão Fullstack moderno, desenvolvido para clínicas veterinárias e pet shops. Criado como projeto acadêmico da disciplina do professor Henning (Semestre 2026.1), ele permite o controle completo de clientes (tutores), pacientes (pets), catálogo de serviços e controle de agendamentos.

## 🎯 Objetivos e Metas
- **Gestão Centralizada**: Substituir planilhas e processos manuais por um fluxo digital unificado e extremamente rápido.
- **Design Corporativo e Profissional**: Entregar uma experiência de usuário (UX/UI) refinada, baseada no rigoroso **Arco Design System**.
- **Arquitetura Moderna**: Frontend **Next.js** consumindo uma **RESTful API NestJS**, com Swagger integrado na própria aplicação.

## 🛠️ Tecnologias Utilizadas

### Frontend (`frontend/`)
- **HTML5, CSS3 e JavaScript Vanilla** — Single Page Application (SPA) levíssima e rápida.
- **Arco Design System** — Referência de design para botões, inputs, modais e responsividade.
- **FontAwesome** — Ícones modernos e vetoriais para a interface.
- **UI Avatars** — Geração de avatares automáticos baseados no nome do usuário e tutores.

### Backend (`backend/`)
- **FastAPI** — Framework web moderno e de altíssimo desempenho para Python.
- **Pydantic** — Validação rigorosa de dados.
- **Uvicorn** — Servidor ASGI ultrarrápido para rodar a aplicação unificada.
- **PyMySQL** — Driver oficial para conexão direta com o banco de dados.
- **python-jose & passlib** — Autenticação segura via JWT (JSON Web Tokens) e hash de senhas (bcrypt).
- **python-dotenv** — Configuração do projeto orientada a variáveis de ambiente (`.env`).
- **MariaDB / MySQL** — Banco de dados relacional para persistência (esquema `miau_db`).

## 📦 Estrutura de Módulos (Features)
- 👤 **Autenticação e Perfil**: Login JWT, gestão de perfil e avatar.
- 🔔 **Sistema de Notificações**: Mural de avisos com badge numérico.
- 🏠 **Home / Mural**: Painel de avisos do sistema.
- 👥 **Tutores & Pets**: CRUD unificado com foto do tutor e accordion de pets.
- 🛍️ **Produtos**: Catálogo e controle de estoque de produtos (ração, brinquedos, medicamentos) com CRUD completo.
- 🏷️ **Serviços**: Catálogo comercial de banho, tosa, etc.
- 📅 **Agendamentos**: Cruzamento de tutores, pets e serviços.
- 📖 **API Docs**: Swagger UI gerado e integrado nativamente pelo FastAPI em `/docs`.

## 🚀 Como Executar o Projeto Localmente

### Estrutura do Projeto

```text
MiAu/
├── app.py                # Ponto de entrada unificado (inicia Uvicorn + Frontend estático)
├── backend/              # Lógica de negócio, Rotas da API, Schemas e Auth
├── frontend/             # Arquivos estáticos (HTML, CSS, JS, Imagens)
├── database/             # Schema SQL e script de reset do banco (setup_db.py)
├── docs/                 # Documentação complementar
└── venv/                 # Ambiente virtual Python
```

### 1. Pré-requisitos
- **Python 3.8+**
- Servidor **MariaDB/MySQL** local (porta 3306).

### 2. Configurar o Banco de Dados e Variáveis de Ambiente
Certifique-se de que o banco de dados está rodando. Opcionalmente, crie um arquivo `.env` na raiz do projeto com as seguintes chaves:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=miau_db
DB_PORT=3306
```

Para inicializar as tabelas e o usuário administrador padrão, rode:
```bash
python database/setup_db.py
```
> **Credenciais Padrão:** Login: `ShardCadu` | Senha: `cadu123`

### 3. Instalar Dependências
Recomenda-se o uso de um ambiente virtual:
```bash
# Windows
python -m venv venv
.\venv\Scripts\activate
pip install -r backend/requirements.txt
```

### 4. Executar a Aplicação
Inicie a aplicação utilizando o script principal que unifica o Backend (FastAPI) e o Frontend estático:
```bash
python app.py
```

### 5. Acessar o Sistema
| Recurso | URL |
|---------|-----|
| App Completa | http://127.0.0.1:8000 |
| Documentação da API (Swagger) | http://127.0.0.1:8000/docs |
| OpenAPI JSON | http://127.0.0.1:8000/openapi.json |

### 6. Documentação da API (Swagger)

A documentação interativa Swagger é gerada automaticamente pelo FastAPI com base nas rotas e esquemas Pydantic configurados na pasta `backend/`.

**Autenticação no Swagger:**
1. Clique no botão **Authorize**.
2. Faça login com as credenciais padrão (`ShardCadu` / `cadu123`).
3. O token JWT será injetado automaticamente em todas as requisições subsequentes testadas pela interface.

---
## 👨‍💻 Contribuidores do MiAu
Desenvolvido, arquitetado e testado por: 
- **Bruno Souza**
- **Carlos Eduardo Alves**
- **Geraldo de Albuquerque**
- **João Paulo Paz**

**Recife - 2026**