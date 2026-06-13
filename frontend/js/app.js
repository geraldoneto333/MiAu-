// Arquivo principal de controle da UI (Single Page Application) - [Carlos Eduardo]

let avisosCache = [];
let tutoresCache = [];
let petsCache = [];
let servicosCache = [];
let agendamentosCache = [];
let agendaView = { year: new Date().getFullYear(), month: new Date().getMonth() };
let currentTutorPetsId = null;
let expandedTutorIds = new Set();
let tutoresPetsSearchTerm = '';
let pendingTutorFoto = null;
let searchDebounceTimer = null;

const MODAL_FORM_MAP = {
    'modal-tutor': { formId: 'form-tutor', selects: [] },
    'modal-pet': { formId: 'form-pet', selects: ['pet-tutor-id'] },
    'modal-servico': { formId: 'form-servico', selects: [] },
    'modal-agendamento': { formId: 'form-agendamento', selects: ['agen-tutor-id', 'agen-pet-id', 'agen-servico-id'] }
};

const PLACEHOLDER_HTML = '<option value="" disabled selected>Selecione...</option>';

const MODAL_TITLES = {
    'modal-tutor': ['Cadastrar Tutor', 'Editar Tutor'],
    'modal-pet': ['Cadastrar Pet', 'Editar Pet'],
    'modal-servico': ['Cadastrar Serviço', 'Editar Serviço'],
    'modal-agendamento': ['Cadastrar Agendamento', 'Editar Agendamento']
};

function setModalTitle(modalId, mode) {
    const el = document.getElementById(`${modalId}-title`);
    const titles = MODAL_TITLES[modalId];
    if (el && titles) el.textContent = titles[mode === 'edit' ? 1 : 0];
}

function toDatetimeLocal(dateStr) {
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return '';
    const pad = n => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function renderActionButtons(editOnclick, deleteOnclick) {
    return `<button type="button" class="btn-edit" onclick="${editOnclick}" title="Editar" aria-label="Editar"><i class="fas fa-pencil-alt"></i></button>
        <button type="button" class="btn-delete" onclick="${deleteOnclick}">Excluir</button>`;
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function normalizeSearchText(str) {
    return (str || '').normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
}

function getTutorFotoUrl(tutor) {
    if (tutor?.foto) return tutor.foto;
    const name = encodeURIComponent(tutor?.nome || 'Tutor');
    return `https://ui-avatars.com/api/?name=${name}&background=ffd1dc&color=111`;
}

function resetTutorFotoPreview(tutor = null) {
    const preview = document.getElementById('tutor-foto-preview');
    if (preview) preview.src = getTutorFotoUrl(tutor || { nome: 'Tutor' });
    const upload = document.getElementById('tutor-foto-upload');
    if (upload) upload.value = '';
}

function renderActionsCell(editOnclick, deleteOnclick) {
    return `<td class="td-actions">${renderActionButtons(editOnclick, deleteOnclick)}</td>`;
}

function checkAuth() {
    const token = localStorage.getItem('aumiau_token');
    if (token) {
        document.getElementById('login-view').classList.add('hidden');
        document.getElementById('app-view').classList.remove('hidden');
        loadInitialData();
    } else {
        document.getElementById('login-view').classList.remove('hidden');
        document.getElementById('app-view').classList.add('hidden');
    }
}

async function loadInitialData() {
    try {
        await Promise.all([
            loadData('tutores-pets'),
            loadData('servicos')
        ]);
        await loadData('agendamentos');
        loadAvisos();
    } catch (e) {
        console.error('Erro ao carregar dados iniciais:', e);
    }
}

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    const errEl = document.getElementById('login-error');

    try {
        const data = await API.login(user, pass);
        localStorage.setItem('aumiau_token', data.access_token);
        errEl.style.display = 'none';
        checkAuth();
    } catch (err) {
        errEl.textContent = err.message;
        errEl.style.display = 'block';
    }
});

document.getElementById('btn-logout').addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('aumiau_token');
    checkAuth();
});

document.querySelectorAll('.nav-link').forEach(navLink => {
    navLink.addEventListener('click', (e) => {
        e.preventDefault();
        const targetElement = e.target.closest('.nav-link');
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        targetElement.classList.add('active');

        document.querySelectorAll('.content-section').forEach(sec => sec.classList.add('hidden'));
        const target = targetElement.getAttribute('data-target');
        const section = document.getElementById('sec-' + target);
        if (section) section.classList.remove('hidden');
        document.getElementById('page-title').textContent = targetElement.querySelector('span').textContent;
    });
});

document.getElementById('sidebar-toggle').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('collapsed');
});

document.getElementById('btn-notifications').addEventListener('click', (e) => {
    e.stopPropagation();
    document.getElementById('notif-dropdown').classList.toggle('show');
    document.getElementById('profile-dropdown').classList.remove('show');
});

document.getElementById('btn-profile').addEventListener('click', (e) => {
    e.stopPropagation();
    document.getElementById('profile-dropdown').classList.toggle('show');
    document.getElementById('notif-dropdown').classList.remove('show');
});

window.addEventListener('click', (e) => {
    if (!e.target.closest('#profile-wrapper')) {
        document.getElementById('profile-dropdown').classList.remove('show');
    }
    if (!e.target.closest('#notif-wrapper')) {
        document.getElementById('notif-dropdown').classList.remove('show');
    }
});

function formatAvisoDate(dateStr) {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleString('pt-BR');
}

async function loadAvisos() {
    try {
        avisosCache = await API.getAvisos();
        renderMural();
        renderNotifications();
    } catch (e) {
        console.error('Erro ao carregar avisos:', e);
        avisosCache = [];
        renderMural();
        renderNotifications();
    }
}

function renderMural() {
    const mural = document.getElementById('mural-list');
    if (!mural) return;
    if (avisosCache.length === 0) {
        mural.innerHTML = '<div class="aviso">Nenhum aviso no mural.</div>';
        return;
    }
    mural.innerHTML = avisosCache.map(a =>
        `<div class="aviso"><strong>[${a.tipo}]</strong> ${a.mensagem}</div>`
    ).join('');
}

function renderNotifications() {
    const list = document.getElementById('notif-list');
    const badge = document.getElementById('notif-badge');
    if (!list || !badge) return;
    list.innerHTML = '';
    if (avisosCache.length === 0) {
        list.innerHTML = '<div class="notif-item">Nenhuma notificacao nova.</div>';
        badge.style.display = 'none';
        return;
    }
    badge.textContent = avisosCache.length;
    badge.style.display = 'block';
    avisosCache.forEach(a => {
        list.innerHTML += `<div class="notif-item"><strong>[${a.tipo}] ${a.mensagem}</strong>${formatAvisoDate(a.data_criacao)}</div>`;
    });
}

window.clearNotifications = function(e) {
    if (e) e.preventDefault();
    avisosCache = [];
    renderNotifications();
};

function lookupNome(cache, id, key) {
    const numId = Number(id);
    const item = cache.find(x => Number(x.id) === numId);
    return item ? item[key] : '—';
}

async function ensureLookupCaches() {
    const tasks = [];
    if (!tutoresCache.length) {
        tasks.push(API.getTutores().then(data => { tutoresCache = data; }));
    }
    if (!petsCache.length) {
        tasks.push(API.getPets().then(data => { petsCache = data; }));
    }
    if (!servicosCache.length) {
        tasks.push(API.getServicos().then(data => { servicosCache = data; }));
    }
    await Promise.all(tasks);
}

async function ensureTutoresCache() {
    if (!tutoresCache.length) tutoresCache = await API.getTutores();
}

function clearForm(formId, selectIds = []) {
    const form = document.getElementById(formId);
    if (!form) return;
    form.reset();
    form.querySelectorAll('input[type="hidden"]').forEach(el => { el.value = ''; });
    form.querySelectorAll('input[type="datetime-local"], input[type="number"]').forEach(el => { el.value = ''; });
    selectIds.forEach(id => {
        const select = document.getElementById(id);
        if (select) {
            select.innerHTML = PLACEHOLDER_HTML;
            select.disabled = false;
        }
    });
}

function openModal(id) {
    document.getElementById(id).classList.remove('hidden');
}

function closeModal(id) {
    document.getElementById(id).classList.add('hidden');
    const config = MODAL_FORM_MAP[id];
    if (config) clearForm(config.formId, config.selects);
    if (id === 'modal-tutor') {
        pendingTutorFoto = null;
        resetTutorFotoPreview();
    }
    if (id === 'modal-agendamento') {
        const petSelect = document.getElementById('agen-pet-id');
        if (petSelect) petSelect.disabled = true;
    }
}

function populateSelect(selectId, items, labelFn, valueKey, placeholder = true) {
    const select = document.getElementById(selectId);
    if (!select) return;
    let html = placeholder ? PLACEHOLDER_HTML : '';
    html += items.map(item =>
        `<option value="${item[valueKey]}">${labelFn(item)}</option>`
    ).join('');
    select.innerHTML = html;
    select.disabled = false;
}

function filterPetsByTutor(tutorId, selectedPetId = null) {
    const petSelect = document.getElementById('agen-pet-id');
    if (!petSelect) return;
    if (!tutorId) {
        petSelect.innerHTML = PLACEHOLDER_HTML;
        petSelect.disabled = true;
        return;
    }
    const filtered = petsCache.filter(p => p.tutor_id === parseInt(tutorId, 10));
    if (filtered.length === 0) {
        petSelect.innerHTML = '<option value="" disabled selected>Nenhum pet cadastrado para este tutor</option>';
        petSelect.disabled = true;
        return;
    }
    populateSelect('agen-pet-id', filtered, p => `${p.nome} (${p.especie})`, 'id', !selectedPetId);
    if (selectedPetId) petSelect.value = String(selectedPetId);
}

function openCreateModal(modalId, options = {}) {
    const config = MODAL_FORM_MAP[modalId];
    if (config) clearForm(config.formId, config.selects);
    setModalTitle(modalId, 'create');
    if (modalId === 'modal-pet' && !options.keepTutorContext) {
        currentTutorPetsId = null;
    }
    if (modalId === 'modal-pet') {
        API.getTutores().then(tutores => {
            populateSelect('pet-tutor-id', tutores, t => t.nome, 'id', true);
        }).catch(e => console.error(e));
    }
    if (modalId === 'modal-tutor') {
        pendingTutorFoto = null;
        resetTutorFotoPreview();
    }
    if (modalId === 'modal-agendamento') {
        document.getElementById('agen-status').value = 'Agendado';
    }
    openModal(modalId);
}

async function openEditTutor(id) {
    const t = tutoresCache.find(x => x.id === id);
    if (!t) return;
    clearForm('form-tutor');
    document.getElementById('tutor-id').value = t.id;
    document.getElementById('tutor-nome').value = t.nome || '';
    document.getElementById('tutor-contato').value = t.contato || '';
    document.getElementById('tutor-telefone').value = t.telefone || '';
    document.getElementById('tutor-endereco').value = t.endereco || '';
    pendingTutorFoto = t.foto || null;
    resetTutorFotoPreview(t);
    setModalTitle('modal-tutor', 'edit');
    openModal('modal-tutor');
}

async function openEditPet(id) {
    const p = petsCache.find(x => x.id === id);
    if (!p) return;
    clearForm('form-pet', ['pet-tutor-id']);
    try {
        const tutores = tutoresCache.length ? tutoresCache : await API.getTutores();
        populateSelect('pet-tutor-id', tutores, t => t.nome, 'id', false);
        document.getElementById('pet-id').value = p.id;
        document.getElementById('pet-nome').value = p.nome || '';
        document.getElementById('pet-especie').value = p.especie || '';
        document.getElementById('pet-sexo').value = p.sexo || '';
        document.getElementById('pet-tutor-id').value = p.tutor_id;
        setModalTitle('modal-pet', 'edit');
        openModal('modal-pet');
    } catch (e) {
        alert(e.message);
    }
}

function openEditServico(id) {
    const s = servicosCache.find(x => x.id === id);
    if (!s) return;
    clearForm('form-servico');
    document.getElementById('servico-id').value = s.id;
    document.getElementById('servico-nome').value = s.nome || '';
    document.getElementById('servico-descricao').value = s.descricao || '';
    document.getElementById('servico-preco').value = s.preco ?? '';
    setModalTitle('modal-servico', 'edit');
    openModal('modal-servico');
}

async function openEditAgendamento(id) {
    const a = agendamentosCache.find(x => x.id === id);
    if (!a) return;
    clearForm('form-agendamento', ['agen-tutor-id', 'agen-pet-id', 'agen-servico-id']);
    const petSelect = document.getElementById('agen-pet-id');
    if (petSelect) petSelect.disabled = true;
    try {
        const [tutores, pets, servicos] = await Promise.all([
            API.getTutores(), API.getPets(), API.getServicos()
        ]);
        petsCache = pets;
        populateSelect('agen-tutor-id', tutores, t => t.nome, 'id', false);
        populateSelect('agen-servico-id', servicos, s => s.nome, 'id', false);
        document.getElementById('agendamento-id').value = a.id;
        document.getElementById('agen-tutor-id').value = a.tutor_id;
        filterPetsByTutor(a.tutor_id, a.pet_id);
        document.getElementById('agen-servico-id').value = a.servico_id;
        document.getElementById('agen-datahora').value = toDatetimeLocal(a.data_hora);
        document.getElementById('agen-status').value = a.status || 'Agendado';
        setModalTitle('modal-agendamento', 'edit');
        openModal('modal-agendamento');
    } catch (e) {
        alert(e.message);
    }
}

async function openAgendamentoModal() {
    clearForm('form-agendamento', ['agen-tutor-id', 'agen-pet-id', 'agen-servico-id']);
    const petSelect = document.getElementById('agen-pet-id');
    if (petSelect) petSelect.disabled = true;
    setModalTitle('modal-agendamento', 'create');
    document.getElementById('agen-status').value = 'Agendado';
    try {
        const [tutores, pets, servicos] = await Promise.all([
            API.getTutores(), API.getPets(), API.getServicos()
        ]);
        petsCache = pets;
        populateSelect('agen-tutor-id', tutores, t => t.nome, 'id', true);
        populateSelect('agen-servico-id', servicos, s => s.nome, 'id', true);
        petSelect.innerHTML = PLACEHOLDER_HTML;
        petSelect.disabled = true;
        openModal('modal-agendamento');
    } catch (e) {
        alert(e.message);
    }
}

function getAgendamentosDoDia(year, month, day) {
    return agendamentosCache.filter(a => {
        const d = new Date(a.data_hora);
        return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
    });
}

function onDiaClick(year, month, day) {
    const detalhe = document.getElementById('agenda-dia-detalhe');
    const titulo = document.getElementById('agenda-dia-titulo');
    const lista = document.getElementById('agenda-dia-lista');
    if (!detalhe || !titulo || !lista) return;

    const dataStr = new Date(year, month, day).toLocaleDateString('pt-BR', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
    titulo.textContent = dataStr.charAt(0).toUpperCase() + dataStr.slice(1);

    const doDia = getAgendamentosDoDia(year, month, day);
    if (doDia.length === 0) {
        lista.innerHTML = '<li class="agenda-dia-vazio">Nenhum agendamento neste dia.</li>';
    } else {
        lista.innerHTML = doDia.map(a => {
            const hora = new Date(a.data_hora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
            const tutor = lookupNome(tutoresCache, a.tutor_id, 'nome');
            const pet = lookupNome(petsCache, a.pet_id, 'nome');
            const servico = lookupNome(servicosCache, a.servico_id, 'nome');
            return `<li><strong>${hora}</strong> — ${servico} · ${pet} (${tutor}) · <em>${a.status}</em></li>`;
        }).join('');
    }
    detalhe.classList.remove('hidden');
}

function renderAgendaCalendario() {
    const grid = document.getElementById('agenda-grid');
    const mesAno = document.getElementById('agenda-mes-ano');
    if (!grid || !mesAno) return;

    const { year, month } = agendaView;
    const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    mesAno.textContent = `${meses[month]} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();

    let html = '';
    for (let i = 0; i < firstDay; i++) {
        html += '<div class="agenda-cell agenda-cell-empty"></div>';
    }
    for (let day = 1; day <= daysInMonth; day++) {
        const count = getAgendamentosDoDia(year, month, day).length;
        const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
        const classes = ['agenda-cell', 'agenda-cell-day'];
        if (isToday) classes.push('agenda-cell-today');
        if (count > 0) classes.push('agenda-cell-has-events');
        html += `<button type="button" class="${classes.join(' ')}" data-day="${day}" aria-label="Dia ${day}">`;
        html += `<span class="agenda-day-num">${day}</span>`;
        if (count > 0) html += `<span class="agenda-day-badge">${count}</span>`;
        html += '</button>';
    }
    grid.innerHTML = html;

    grid.querySelectorAll('.agenda-cell-day').forEach(btn => {
        btn.addEventListener('click', () => {
            grid.querySelectorAll('.agenda-cell-day').forEach(b => b.classList.remove('agenda-cell-selected'));
            btn.classList.add('agenda-cell-selected');
            onDiaClick(year, month, parseInt(btn.dataset.day, 10));
        });
    });
}

function formatPetSexo(sexo) {
    return sexo === 'F' ? 'Fêmea' : 'Macho';
}

function tutorMatchesSearch(tutor, term) {
    if (!term) return true;
    const fields = [tutor.nome, tutor.contato, tutor.telefone, tutor.endereco];
    return fields.some(f => normalizeSearchText(f).includes(term));
}

function petMatchesSearch(pet, term) {
    if (!term) return true;
    const sexoLabel = pet.sexo === 'F' ? 'femea' : 'macho';
    const fields = [pet.nome, pet.especie, pet.raca, sexoLabel];
    return fields.some(f => normalizeSearchText(f).includes(term));
}

function toggleTutorExpand(tutorId) {
    const id = Number(tutorId);
    if (expandedTutorIds.has(id)) expandedTutorIds.delete(id);
    else expandedTutorIds.add(id);
    renderTutoresPetsView();
}

function renderTutoresPetsView() {
    const container = document.getElementById('tutores-pets-list');
    if (!container) return;

    const term = normalizeSearchText(tutoresPetsSearchTerm.trim());

    if (!tutoresCache.length) {
        container.innerHTML = '<div class="tutor-folders-empty">Nenhum tutor cadastrado. Clique em "+ Novo Tutor" para começar.</div>';
        return;
    }

    const petsByTutor = {};
    petsCache.forEach(p => {
        const tid = Number(p.tutor_id);
        if (!petsByTutor[tid]) petsByTutor[tid] = [];
        petsByTutor[tid].push(p);
    });

    const sorted = [...tutoresCache].sort((a, b) =>
        (a.nome || '').localeCompare(b.nome || '', 'pt-BR')
    );

    const filtered = sorted.filter(t => {
        const pets = petsByTutor[Number(t.id)] || [];
        if (!term) return true;
        if (tutorMatchesSearch(t, term)) return true;
        return pets.some(p => petMatchesSearch(p, term));
    });

    if (filtered.length === 0) {
        container.innerHTML = `<div class="tutor-folders-empty">Nenhum tutor ou pet encontrado para "${escapeHtml(tutoresPetsSearchTerm)}".</div>`;
        return;
    }

    if (term) {
        filtered.forEach(t => {
            const pets = petsByTutor[Number(t.id)] || [];
            if (pets.some(p => petMatchesSearch(p, term))) {
                expandedTutorIds.add(Number(t.id));
            }
        });
    }

    container.innerHTML = filtered.map(t => {
        const tid = Number(t.id);
        const allPets = petsByTutor[tid] || [];
        const tutorHit = tutorMatchesSearch(t, term);
        const pets = term
            ? allPets.filter(p => tutorHit || petMatchesSearch(p, term))
            : allPets;
        const expanded = expandedTutorIds.has(tid);
        const count = allPets.length;
        const foto = getTutorFotoUrl(t);
        const metaParts = [t.contato, t.telefone].filter(Boolean).map(escapeHtml);
        const meta = metaParts.join(' · ');

        const petsHtml = pets.length === 0
            ? '<p class="tutor-pets-empty-inline">Nenhum pet cadastrado para este tutor.</p>'
            : `<div class="data-table-container"><table>
                <thead><tr><th>ID</th><th>Nome</th><th>Espécie</th><th>Sexo</th><th>Ações</th></tr></thead>
                <tbody>${pets.map(p =>
                    `<tr><td>${p.id}</td><td>${escapeHtml(p.nome)}</td><td>${escapeHtml(p.especie)}</td><td>${formatPetSexo(p.sexo)}</td>${renderActionsCell(`openEditPet(${p.id})`, `deletePetFromAccordion(${p.id})`)}</tr>`
                ).join('')}</tbody></table></div>`;

        return `<div class="tutor-card${expanded ? ' expanded' : ''}" data-tutor-id="${tid}">
            <div class="tutor-card-header" onclick="toggleTutorExpand(${tid})" role="button" tabindex="0" aria-expanded="${expanded}">
                <img class="tutor-avatar" src="${foto}" alt="Foto de ${escapeHtml(t.nome)}">
                <div class="tutor-card-info">
                    <strong>${escapeHtml(t.nome)}</strong>
                    ${meta ? `<span class="tutor-card-meta">${meta}</span>` : ''}
                    <span class="tutor-card-badge">${count === 1 ? '1 pet' : count + ' pets'}</span>
                </div>
                <div class="tutor-card-actions td-actions" onclick="event.stopPropagation()">
                    ${renderActionButtons(`openEditTutor(${t.id})`, `deleteTutorFromAccordion(${t.id})`)}
                </div>
                <i class="fas fa-chevron-right tutor-chevron"></i>
            </div>
            <div class="tutor-card-body">
                <div class="tutor-card-body-toolbar">
                    <button type="button" class="btn-primary btn-sm" onclick="openCreatePetForTutor(${tid})">+ Novo Pet</button>
                </div>
                ${petsHtml}
            </div>
        </div>`;
    }).join('');
}

async function openCreatePetForTutor(tutorId) {
    currentTutorPetsId = tutorId;
    expandedTutorIds.add(Number(tutorId));
    openCreateModal('modal-pet', { keepTutorContext: true });
    try {
        const tutores = tutoresCache.length ? tutoresCache : await API.getTutores();
        populateSelect('pet-tutor-id', tutores, t => t.nome, 'id', false);
        document.getElementById('pet-tutor-id').value = tutorId;
    } catch (e) {
        alert(e.message);
    }
}

async function deletePetFromAccordion(petId) {
    if (!confirm('Excluir este pet?')) return;
    try {
        await API.deletePet(petId);
        await loadData('tutores-pets');
    } catch (err) {
        alert(err.message);
    }
}

async function deleteTutorFromAccordion(tutorId) {
    if (!confirm('Excluir este tutor e todos os pets vinculados?')) return;
    try {
        await API.deleteTutor(tutorId);
        expandedTutorIds.delete(Number(tutorId));
        await loadData('tutores-pets');
    } catch (err) {
        alert(err.message);
    }
}

function renderAgendamentosTable() {
    const tbody = document.getElementById('tbody-agendamentos');
    if (!tbody) return;
    tbody.innerHTML = '';
    agendamentosCache.forEach(a => {
        const tutor = lookupNome(tutoresCache, a.tutor_id, 'nome');
        const pet = lookupNome(petsCache, a.pet_id, 'nome');
        const servico = lookupNome(servicosCache, a.servico_id, 'nome');
        tbody.innerHTML += `<tr><td>${a.id}</td><td>${tutor}</td><td>${pet}</td><td>${servico}</td><td>${new Date(a.data_hora).toLocaleString('pt-BR')}</td><td>${a.status}</td>${renderActionsCell(`openEditAgendamento(${a.id})`, `API.deleteAgendamento(${a.id}).then(()=>loadData('agendamentos'))`)}</tr>`;
    });
    renderAgendaCalendario();
}

function navigateAgendaMonth(delta) {
    agendaView.month += delta;
    if (agendaView.month > 11) { agendaView.month = 0; agendaView.year++; }
    if (agendaView.month < 0) { agendaView.month = 11; agendaView.year--; }
    document.getElementById('agenda-dia-detalhe')?.classList.add('hidden');
    renderAgendaCalendario();
}

window.openCreateModal = openCreateModal;
window.openAgendamentoModal = openAgendamentoModal;
window.openEditTutor = openEditTutor;
window.openEditPet = openEditPet;
window.openEditServico = openEditServico;
window.openEditAgendamento = openEditAgendamento;
window.toggleTutorExpand = toggleTutorExpand;
window.openCreatePetForTutor = openCreatePetForTutor;
window.deletePetFromAccordion = deletePetFromAccordion;
window.deleteTutorFromAccordion = deleteTutorFromAccordion;
window.openModal = openModal;
window.closeModal = closeModal;

async function loadData(module) {
    if (module === 'tutores' || module === 'pets') module = 'tutores-pets';

    if (module === 'tutores-pets') {
        try {
            const [tutores, pets] = await Promise.all([API.getTutores(), API.getPets()]);
            tutoresCache = tutores;
            petsCache = pets;
            renderTutoresPetsView();
        } catch (e) { console.error(e); }
    } else if (module === 'servicos') {
        try {
            const data = await API.getServicos();
            servicosCache = data;
            const tbody = document.getElementById('tbody-servicos');
            tbody.innerHTML = '';
            data.forEach(s => {
                tbody.innerHTML += `<tr><td>${s.id}</td><td>${s.nome}</td><td>R$ ${s.preco}</td>${renderActionsCell(`openEditServico(${s.id})`, `API.deleteServico(${s.id}).then(()=>loadData('servicos'))`)}</tr>`;
            });
        } catch (e) { console.error(e); }
    } else if (module === 'agendamentos') {
        try {
            await ensureLookupCaches();
            const data = await API.getAgendamentos();
            agendamentosCache = data;
            renderAgendamentosTable();
        } catch (e) { console.error(e); }
    }
}

document.getElementById('agen-tutor-id').addEventListener('change', (e) => {
    filterPetsByTutor(e.target.value);
});

document.getElementById('agenda-prev')?.addEventListener('click', () => navigateAgendaMonth(-1));
document.getElementById('agenda-next')?.addEventListener('click', () => navigateAgendaMonth(1));

document.getElementById('form-tutor').addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
        nome: document.getElementById('tutor-nome').value,
        contato: document.getElementById('tutor-contato').value,
        telefone: document.getElementById('tutor-telefone').value || null,
        endereco: document.getElementById('tutor-endereco').value || null,
        foto: pendingTutorFoto
    };
    const id = document.getElementById('tutor-id').value;
    try {
        if (id) await API.updateTutor(id, payload);
        else await API.createTutor(payload);
        closeModal('modal-tutor');
        await loadData('tutores-pets');
    } catch (err) { alert(err.message); }
});

document.getElementById('form-pet').addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
        nome: document.getElementById('pet-nome').value,
        especie: document.getElementById('pet-especie').value,
        sexo: document.getElementById('pet-sexo').value,
        tutor_id: parseInt(document.getElementById('pet-tutor-id').value, 10)
    };
    const id = document.getElementById('pet-id').value;
    const tutorIdForExpand = currentTutorPetsId || payload.tutor_id;
    try {
        if (id) await API.updatePet(id, payload);
        else await API.createPet(payload);
        closeModal('modal-pet');
        if (tutorIdForExpand) expandedTutorIds.add(Number(tutorIdForExpand));
        await loadData('tutores-pets');
    } catch (err) { alert(err.message); }
});

document.getElementById('form-servico').addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
        nome: document.getElementById('servico-nome').value,
        descricao: document.getElementById('servico-descricao').value,
        preco: parseFloat(document.getElementById('servico-preco').value)
    };
    const id = document.getElementById('servico-id').value;
    try {
        if (id) await API.updateServico(id, payload);
        else await API.createServico(payload);
        closeModal('modal-servico');
        loadData('servicos');
    } catch (err) { alert(err.message); }
});

document.getElementById('form-agendamento').addEventListener('submit', async (e) => {
    e.preventDefault();
    const tutorId = parseInt(document.getElementById('agen-tutor-id').value, 10);
    const petId = parseInt(document.getElementById('agen-pet-id').value, 10);
    const pet = petsCache.find(p => p.id === petId);
    if (!pet || pet.tutor_id !== tutorId) {
        alert('Selecione um pet que pertence ao tutor escolhido.');
        return;
    }
    const payload = {
        tutor_id: tutorId,
        pet_id: petId,
        servico_id: parseInt(document.getElementById('agen-servico-id').value, 10),
        data_hora: document.getElementById('agen-datahora').value,
        status: document.getElementById('agen-status').value
    };
    const id = document.getElementById('agendamento-id').value;
    try {
        if (id) await API.updateAgendamento(id, payload);
        else await API.createAgendamento(payload);
        closeModal('modal-agendamento');
        loadData('agendamentos');
    } catch (err) { alert(err.message); }
});

async function loadProfile() {
    try {
        const data = await API.getProfile();
        document.getElementById('perfil-nome').value = data.username;
        document.getElementById('perfil-email').value = data.email;
        const savedAvatar = localStorage.getItem('aumiau_avatar');
        const defaultAvatar = `https://ui-avatars.com/api/?name=${data.username}&background=ffd1dc&color=111`;
        document.getElementById('perfil-avatar-preview').src = savedAvatar || defaultAvatar;
        document.getElementById('user-avatar-img').src = savedAvatar || defaultAvatar;
    } catch (e) { console.error('Erro ao carregar perfil:', e); }
}

document.getElementById('form-perfil').addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
        username: document.getElementById('perfil-nome').value,
        email: document.getElementById('perfil-email').value
    };
    const password = document.getElementById('perfil-senha').value;
    if (password.trim() !== '') payload.password = password;
    try {
        await API.updateProfile(payload);
        closeModal('modal-perfil');
        document.getElementById('perfil-senha').value = '';
        loadProfile();
        alert('Perfil atualizado com sucesso!');
    } catch (err) { alert(err.message); }
});

document.getElementById('foto-upload').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const base64Img = event.target.result;
            localStorage.setItem('aumiau_avatar', base64Img);
            document.getElementById('perfil-avatar-preview').src = base64Img;
            document.getElementById('user-avatar-img').src = base64Img;
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById('btn-remover-foto').addEventListener('click', () => {
    localStorage.removeItem('aumiau_avatar');
    loadProfile();
});

document.getElementById('tutor-foto-upload')?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
        pendingTutorFoto = event.target.result;
        document.getElementById('tutor-foto-preview').src = pendingTutorFoto;
    };
    reader.readAsDataURL(file);
});

document.getElementById('btn-remover-foto-tutor')?.addEventListener('click', () => {
    pendingTutorFoto = null;
    const nome = document.getElementById('tutor-nome').value || 'Tutor';
    resetTutorFotoPreview({ nome });
});

document.getElementById('tutores-pets-search')?.addEventListener('input', (e) => {
    clearTimeout(searchDebounceTimer);
    searchDebounceTimer = setTimeout(() => {
        tutoresPetsSearchTerm = e.target.value;
        renderTutoresPetsView();
    }, 250);
});

window.onload = () => {
    checkAuth();
    if (localStorage.getItem('aumiau_token')) {
        loadProfile();
    }
};
