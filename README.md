# 🐾 MiAu - Pet Shop & Bem-Estar

## 📌 Sobre o Projeto
O **MiAu** é um Sistema de Gestão Fullstack moderno, desenvolvido para clínicas veterinárias e pet shops. Criado como projeto acadêmico da disciplina do professor Henning (Semestre 2026.1), ele permite o controle completo de clientes (tutores), pacientes (pets), estoque de produtos, catálogo de serviços e controle de agendamentos.

## 🎯 Objetivos e Metas
- **Gestão Centralizada**: Substituir planilhas e processos manuais por um fluxo digital unificado e extremamente rápido.
- **Design Corporativo e Profissional**: Entregar uma experiência de usuário (UX/UI) refinada, baseada no rigoroso **Arco Design System** (design limpo, botões padronizados, inputs com transições fluidas e sombras controladas).
- **Arquitetura Desacoplada e Otimizada**: Implementar o paradigma *Single Page Application (SPA)* no frontend, consumindo dados via uma *RESTful API* no backend. Ambos rodando de forma **unificada em uma única porta** (FastAPI servindo os arquivos estáticos) para facilitar testes e deploys acadêmicos.

## 🛠️ Tecnologias Utilizadas

### Frontend (Interface Gráfica)
- **HTML5 & CSS3**: Estruturação semântica e CSS customizado sem frameworks excessivos, focado em performance.
- **JavaScript Vanilla**: Lógica assíncrona (`async/await`, Fetch API) para comunicação em tempo real sem recarregar a página (completamente SPA).
- **Arco Design System**: Princípios de UI corporativa aplicados do zero.
- **FontAwesome & UI Avatars**: Iconografia escalável e geração dinâmica de avatares com base no nome de usuário.

### Backend (Lógica e API)
- **Python**: Linguagem base do servidor.
- **FastAPI & Uvicorn**: Framework de altíssima performance para construção de endpoints REST API. Responsável também pelo mapeamento dos arquivos `.html` da tela principal.
- **MariaDB / MySQL**: Banco de dados relacional robusto.
- **Pydantic**: Para validação rigorosa dos esquemas JSON de entrada e saída.

## 📦 Estrutura de Módulos (Features)
- 👤 **Autenticação e Perfil**: Login protegido por Token JWT armazenado localmente. Inclui um menu Dropdown interativo com gestão de Perfil, foto de Avatar e janela de Ajustes.
- 🔔 **Sistema de Notificações**: Ícone (Sino) em tempo real, alertando os usuários sobre novos avisos do Mural, com badge numérico interativo e listagem flutuante.
- 🏠 **Home / Mural**: Tela inicial de recepção com um painel (Card) de avisos do sistema.
- 👥 **Gestão de Tutores**: CRUD (Criar, Ler, Atualizar, Deletar) de donos de pets.
- 🐕 **Gestão de Pets**: Histórico e controle de pacientes, interligados obrigatoriamente a um Tutor.
- 🏷️ **Serviços & Produtos**: Gestão comercial, tabelas de preço de banho/tosa e rastreamento numérico do estoque.
- 📅 **Agendamentos**: O núcleo operacional, cruzando horários com Tutores, Pets e Serviços escolhidos.

## 📱 Responsividade (Mobile First adaptado)
O MiAu não é apenas para Desktops; a interface CSS possui Media Queries otimizadas para smartphones e tablets:
- **Sidebar Inteligente**: O menu se esconde e pode ser chamado via botão *Hamburger*, deslizando em Overlay.
- **Tabelas com Overflow**: Tabelas com muitos dados possuem barra de rolagem horizontal nativa para impedir a quebra visual no celular.
- **Action Bars Dinâmicos**: Botões de ação e modais (janelas flutuantes) expandem sua área útil para melhor clique em telas Touch.

## 🚀 Como Executar o Projeto Localmente

### 1. Pré-requisitos
- Python instalado.
- Servidor MariaDB local rodando (porta 3306).
- Instalar as dependências do ambiente Python (listadas em `backend/requirements.txt`).

### 2. Configurar o Banco de Dados
A criação das tabelas e do usuário administrador padrão foi automatizada. Basta rodar o script oficial:
```bash
python backend/database/setup_db.py
```
> **Credenciais Padrão:** Login: `ShardCadu` | Senha: `cadu123`

### 3. Rodar o Servidor Unificado (Fullstack)
A mágica da unificação permite iniciar todo o sistema com um único comando na raiz do projeto:
```bash
python app.py
```

### 4. Acessar o Sistema
Abra o seu navegador web (Google Chrome, Firefox, etc.) e acesse:
👉 **http://127.0.0.1:8000**

---
👨‍💻 *Desenvolvido e arquitetado por Carlos Eduardo (Cadu) - 2026.*
