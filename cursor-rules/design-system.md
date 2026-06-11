# MiAu — Design System

> Direcionamento visual para construção de features no frontend.
> Baseado em [`frontend/css/palette.css`](../frontend/css/palette.css) e [`frontend/css/style.css`](../frontend/css/style.css).

## Princípio Geral

O MiAu usa **CSS customizado inspirado no Arco Design System** (ByteDance), **sem** instalar o pacote npm `@arco-design/web-react`. Toda nova UI deve reutilizar classes e tokens existentes — não criar frameworks paralelos.

## Identidade de Marca

### Paleta de Cores (CSS Custom Properties)

Definidas em `palette.css`, extraídas da identidade visual do logo (`frontend/imagens/logo_completo_miau.png`):

| Token | Hex | Uso |
|-------|-----|-----|
| `--cor-dominante` | `#e2dbd2` | Botões primários, borda focus, ícones de destaque |
| `--cor-paleta-1` | `#e3dcd2` | Gradiente sidebar/topbar (início) |
| `--cor-paleta-2` | `#3c5748` | Gradiente sidebar/topbar (fim) |
| `--cor-paleta-3` | `#b69b7a` | Acentos terrosos |
| `--cor-paleta-4` | `#af7f4b` | Acentos terrosos |
| `--cor-paleta-5` | `#7d5d44` | Acentos escuros |
| `--cor-paleta-6` | `#8ab2a6` | Verde suave |

### Cores Semânticas (Arco-inspired)

| Propósito | Hex | Onde usar |
|-----------|-----|-----------|
| Texto primário | `#1d2129` | Títulos, labels, headers |
| Texto secundário | `#4e5969` | Células de tabela, descrições |
| Texto muted | `#86909c` | Botão fechar, placeholders |
| Borda padrão | `#e5e6eb` | Inputs, cards, modais |
| Borda hover | `#c9cdd4` | Inputs em hover |
| Superfície cinza | `#f2f3f5` | Header de tabela, botão cancel |
| Background app | `#f8f9fa` | Área de conteúdo |
| Link / ação | `#165dff` | Links em dropdowns |
| Danger | `#f53f3f` | Delete, logout, erros |
| Danger hover | `#f76560` | Hover em botões delete |
| Warning | `#ffc107` | Botão edit, avisos |
| Aviso bg | `#fff9e6` | Cards de aviso no mural |

### Tipografia

- **Fonte:** Inter (400, 500, 600, 700) via Google Fonts
- **Tamanho base inputs/botões:** `14px`
- **Título topbar:** `1.5rem`, weight 800
- **Título modal:** `1.15rem`, weight 600
- **Login h2:** `2.2rem`

### Ícones e Avatares

- **Ícones:** Font Awesome 6.4 (`fas`, `far`) via CDN
- **Avatares padrão:** UI Avatars API (`background=ffd1dc&color=111`)
- **Avatar perfil:** 40px circular (topbar), 80px (modal edit)

## Tokens de Layout

| Propriedade | Valor | Contexto |
|-------------|-------|----------|
| Border radius padrão | `4px` | Inputs, botões, cards, modais |
| Border radius login | `16px` | `.login-card` |
| Border radius badge | `10px` | `.badge` notificações |
| Transição padrão | `0.2s cubic-bezier(0, 0, 1, 1)` | Inputs, botões |
| Focus ring | `0 0 0 2px rgba(255, 140, 0, 0.2)` | Inputs em focus |
| Sidebar width | `250px` (desktop), `80px` collapsed | Navegação |
| Topbar height | `70px` (60px mobile) | Header |
| Modal max-width | `500px` | Formulários CRUD |

## Componentes — Reutilizar Sempre

### Formulários

```html
<div class="input-group">
    <label for="campo-id">Label</label>
    <input type="text" id="campo-id" required>
</div>
```

### Botões

| Classe | Uso |
|--------|-----|
| `.btn-primary` | Ação principal (submit, salvar) |
| `.btn-cancel` | Cancelar modal |
| `.btn-delete` | Excluir registro |
| `.btn-edit` | Editar (amarelo) |
| `.btn-close` | Fechar modal (X) |
| `.btn-toggle` | Hamburger sidebar |
| `.icon-btn` | Sino notificações |
| `.text-danger` | Links/textos destrutivos |

### Layout App

```
#app-view
├── .sidebar (#sidebar)
│   ├── .sidebar-logo
│   └── nav > .nav-link[data-target]
├── .main-content
│   ├── .topbar
│   │   ├── .btn-toggle
│   │   ├── #page-title
│   │   └── .topbar-actions
│   └── .content-area
│       └── .content-section#sec-{nome}
```

### Tabelas de Dados

```html
<div class="action-bar">
    <h2>Título</h2>
    <button onclick="openModal('modal-x')">+ Novo</button>
</div>
<div class="data-table-container">
    <table>
        <thead>...</thead>
        <tbody id="tbody-{modulo}"></tbody>
    </table>
</div>
```

### Modais

```html
<div id="modal-{nome}" class="modal hidden">
    <div class="modal-content">
        <div class="modal-header">
            <h3>Título</h3>
            <button class="btn-close" onclick="closeModal('modal-{nome}')">×</button>
        </div>
        <form id="form-{nome}">
            <!-- .input-group fields -->
            <div class="modal-actions">
                <button type="button" class="btn-cancel" onclick="closeModal(...)">Cancelar</button>
                <button type="submit" class="btn-primary">Salvar</button>
            </div>
        </form>
    </div>
</div>
```

### Cards Home

| Classe | Uso |
|--------|-----|
| `.home-grid` | Grid 2 colunas (1 col em mobile) |
| `.home-card` | Container base |
| `.welcome-card` | Card boas-vindas (borda top dominante) |
| `.mural-card` | Card mural avisos (borda top paleta-1) |
| `.aviso` | Item individual de aviso (bg amarelo claro) |

### Dropdowns

```html
<div class="dropdown-menu" id="dropdown-id">
    <div class="dropdown-header">...</div>
    <div class="dropdown-list">...</div>
    <div class="dropdown-footer">...</div>
</div>
```

Toggle visibilidade com classe `.show`.

### Utilitários

- `.hidden` — `display: none !important` (views, sections, modals)

## Gradientes de Marca

Usados em login, sidebar e topbar:

```css
background: linear-gradient(135deg, var(--cor-paleta-1), var(--cor-paleta-2));
/* Sidebar usa 180deg */
background: linear-gradient(180deg, var(--cor-paleta-1), var(--cor-paleta-2));
```

## Responsividade

### Breakpoints

| Breakpoint | Comportamento |
|------------|---------------|
| `max-width: 900px` | Home grid vira 1 coluna |
| `max-width: 768px` | Sidebar overlay, action-bar stack, botões full-width |

### Sidebar Mobile

- Desktop: `.collapsed` reduz para 80px
- Mobile: `.collapsed` **abre** overlay (hack intencional documentado no CSS)
- JS adiciona `.collapsed` via `#sidebar-toggle`

### Tabelas Mobile

- `.data-table-container` com `overflow-x: auto`
- Botões de ação empilham com `width: 100%`

## Padrão para Nova Feature Visual

1. **HTML** — Adicionar `<section id="sec-{nome}" class="content-section hidden">` em `index.html`
2. **Nav** — Link com `class="nav-link" data-target="{nome}"`
3. **Modal** — `#modal-{nome}` + `#form-{nome}` seguindo template acima
4. **JS** — Handlers em `app.js`; métodos API em `api.js`
5. **CSS** — Só adicionar em `style.css` se não couber em classes existentes; usar tokens de `palette.css`
6. **Responsivo** — Testar em 768px; action-bar e tabelas devem funcionar

## Checklist Visual (antes de merge)

- [ ] Usa classes existentes (não inventou `.my-button-custom`)
- [ ] Cores vêm de tokens (`var(--cor-dominante)`) ou semânticas Arco
- [ ] Border radius 4px (exceto login card)
- [ ] Transição 0.2s cubic-bezier nos interativos
- [ ] Texto legível sobre gradientes (cor escura `#111` ou `#1d2129`)
- [ ] Modal segue estrutura `.modal > .modal-content > .modal-header`
- [ ] Tabela dentro de `.data-table-container`
- [ ] Funciona em mobile (768px): sidebar, action-bar, tabela
- [ ] Ícones Font Awesome (não emojis como ícones de UI)
- [ ] Sem frameworks CSS externos (Bootstrap, Tailwind, etc.)

## O Que NÃO Fazer

- Não instalar React, Vue, ou Arco npm package
- Não usar Tailwind/Bootstrap — o projeto é CSS vanilla intencional
- Não criar arquivo CSS separado por feature (manter `style.css` centralizado)
- Não usar cores hardcoded quando existe token equivalente
- Não quebrar o padrão de IDs (`sec-*`, `modal-*`, `form-*`, `tbody-*`)
