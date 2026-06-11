# Conversas Cadu com Cursor — MiAu

> Histórico vivo de conversas com Cursor e outros agentes de IA sobre o projeto MiAu.
> Atualize este arquivo ao final de cada sessão relevante.

## Como Atualizar

Ao terminar uma sessão de trabalho com agente, adicione uma nova seção no formato abaixo. Peça ao agente: *"Adicione um resumo desta sessão em cursor-rules/conversas-cadu-cursor.md"*.

---

## Sessão 1 — 2026-06-09

**ID:** `094eb3c3-e614-491b-8be5-10700e7c1b7e`

**Motivação:** Cadu perdeu o contexto do projeto após pausa no desenvolvimento. Precisava retomar entendimento completo e estruturar documentação para agentes futuros.

**Pedidos:**
- Análise completa do projeto (README até todas as pastas)
- Criar pasta `cursor-rules/` com 3 arquivos `.md`:
  - Contextualização para agentes
  - Histórico de conversas
  - Design system para frontend
- Integração Vercel + GitHub (repositório Dev-Carlos-Alves/MiAu-)
- Plugin Vercel no Cursor (`npx plugins add vercel/vercel-plugin`)

**Decisões tomadas:**
- Pasta `cursor-rules/` na raiz (separada de `.cursor/rules/` que são regras auto-aplicadas)
- Deploy Vercel incluído no escopo: API serverless + frontend estático + MySQL hospedado
- Config migrada para variáveis de ambiente (`DB_*`, `JWT_SECRET_KEY`)
- `backend/app_api.py` separado de `main.py` (API pura vs dev unificado)
- Frontend usa `window.location.origin` como API base URL (funciona local e produção)
- **Segurança:** PAT do GitHub exposto na conversa — deve ser revogado; nunca commitar tokens

**Resultados da análise (baseline de conhecimento):**

*Backend:*
- FastAPI + PyMySQL, sem ORM
- JWT auth com senhas em texto puro
- Config hardcoded (migrado para env vars nesta sessão)
- Legacy Express em `backend/` não usado

*Frontend:*
- SPA vanilla em `frontend/index.html`
- Arco-inspired CSS custom (sem pacote npm)
- CRUD parcial: list + delete funcionam; creates não wired
- Notificações mock; mural estático

*Gaps identificados:*
- Sem endpoints `/api/avisos`
- Sem PUT `/api/pets/{id}`
- `createServico`/`createAgendamento` faltando em `api.js`
- README com caminho errado do setup_db
- `script_cores.py` com paths da pasta antiga `AuMiau/`

**Entregas (Sessão 1):**
- `cursor-rules/projeto-contexto.md`
- `cursor-rules/conversas-cadu-cursor.md` (este arquivo)
- `cursor-rules/design-system.md`
- `cursor-rules/deploy-vercel.md`
- Refatoração env vars + `.env.example`
- `backend/app_api.py`, `api/index.py`, `vercel.json`
- `.cursor/rules/*.mdc` apontando para cursor-rules/
- Correções README e script_cores.py

**Pendências pós-sessão:**
- [ ] Revogar GitHub PAT exposto na conversa original
- [ ] Provisionar MySQL hospedado (Railway, PlanetScale, Aiven, etc.)
- [ ] Configurar env vars no dashboard Vercel
- [ ] Rodar `schema.sql` no banco remoto
- [ ] Completar CRUD frontend (forms submit)
- [ ] Implementar API de avisos + mural dinâmico
- [ ] Hash de senhas com bcrypt

**Links:**
- Repo: https://github.com/Dev-Carlos-Alves/MiAu-
- Deploy: https://mi-au.vercel.app
- Plugin Vercel habilitado em `.cursor/settings.json`

---

## Sessão 2 — 2026-06-09

**Motivação:** Limpeza de código morto e conclusão de features incompletas (CRUD, avisos, mural).

**Entregas:**
- Removido stack Express legado (`frontend/` e `backend/`)
- Removido CSS `.logout-btn` e `.btn-edit`
- Limpos imports Python mortos
- Adicionados `/api/avisos` (GET/POST/DELETE) e `PUT /api/pets/{id}`
- Wired submit dos modais CRUD (tutor, pet, serviço, agendamento)
- Mural e notificações alimentados por `API.getAvisos()`
- Logo sidebar corrigido; link morto removido
- `public/` sincronizado via `npm run build`

**Backlog restante:**
- Edit mode nos modais (PUT tutores/pets na UI)
- bcrypt para senhas
- Módulo produtos/estoque
- Modal Ajustes funcional

---

## Sessão 3 — (próxima)

*(Adicionar aqui)*
