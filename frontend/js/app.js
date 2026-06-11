// Arquivo principal de controle da UI (Single Page Application) - [Carlos Eduardo]

let avisosCache = [];

function checkAuth() {
    const token = localStorage.getItem('aumiau_token');
    if (token) {
        document.getElementById('login-view').classList.add('hidden');
        document.getElementById('app-view').classList.remove('hidden');
        loadData('tutores');
        loadData('pets');
        loadData('servicos');
        loadData('agendamentos');
        loadAvisos();
    } else {
        document.getElementById('login-view').classList.remove('hidden');
        document.getElementById('app-view').classList.add('hidden');
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

document.getElementById('btn-notifications').addEventListener('click', (e) => {
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

function openModal(id) {
    document.getElementById(id).classList.remove('hidden');
}

function closeModal(id) {
    document.getElementById(id).classList.add('hidden');
}

function resetForm(formId) {
    const form = document.getElementById(formId);
    if (form) form.reset();
}

function openCreateModal(modalId) {
    const formMap = {
        'modal-tutor': 'form-tutor',
        'modal-pet': 'form-pet',
        'modal-servico': 'form-servico'
    };
    resetForm(formMap[modalId]);
    if (modalId === 'modal-pet') {
        API.getTutores().then(tutores => {
            populateSelect('pet-tutor-id', tutores, t => t.nome, 'id');
        }).catch(e => console.error(e));
    }
    openModal(modalId);
}

function populateSelect(selectId, items, labelFn, valueKey) {
    const select = document.getElementById(selectId);
    if (!select) return;
    select.innerHTML = items.map(item =>
        `<option value="${item[valueKey]}">${labelFn(item)}</option>`
    ).join('');
}

async function openAgendamentoModal() {
    resetForm('form-agendamento');
    try {
        const [tutores, pets, servicos] = await Promise.all([
            API.getTutores(), API.getPets(), API.getServicos()
        ]);
        populateSelect('agen-tutor-id', tutores, t => t.nome, 'id');
        populateSelect('agen-pet-id', pets, p => p.nome + ' (' + p.especie + ')', 'id');
        populateSelect('agen-servico-id', servicos, s => s.nome, 'id');
        openModal('modal-agendamento');
    } catch (e) {
        alert(e.message);
    }
}

window.openCreateModal = openCreateModal;
window.openAgendamentoModal = openAgendamentoModal;
window.openModal = openModal;
window.closeModal = closeModal;

async function loadData(module) {
    if (module === 'tutores') {
        try {
            const data = await API.getTutores();
            const tbody = document.getElementById('tbody-tutores');
            tbody.innerHTML = '';
            data.forEach(t => {
                tbody.innerHTML += `<tr><td>${t.id}</td><td>${t.nome}</td><td>${t.contato || ''}</td><td><button class="btn-delete" onclick="API.deleteTutor(${t.id}).then(()=>loadData('tutores'))">Excluir</button></td></tr>`;
            });
        } catch (e) { console.error(e); }
    } else if (module === 'pets') {
        try {
            const data = await API.getPets();
            const tbody = document.getElementById('tbody-pets');
            tbody.innerHTML = '';
            data.forEach(p => {
                tbody.innerHTML += `<tr><td>${p.id}</td><td>${p.nome}</td><td>${p.especie}</td><td>${p.tutor_id}</td><td><button class="btn-delete" onclick="API.deletePet(${p.id}).then(()=>loadData('pets'))">Excluir</button></td></tr>`;
            });
        } catch (e) { console.error(e); }
    } else if (module === 'servicos') {
        try {
            const data = await API.getServicos();
            const tbody = document.getElementById('tbody-servicos');
            tbody.innerHTML = '';
            data.forEach(s => {
                tbody.innerHTML += `<tr><td>${s.id}</td><td>${s.nome}</td><td>R$ ${s.preco}</td><td><button class="btn-delete" onclick="API.deleteServico(${s.id}).then(()=>loadData('servicos'))">Excluir</button></td></tr>`;
            });
        } catch (e) { console.error(e); }
    } else if (module === 'agendamentos') {
        try {
            const data = await API.getAgendamentos();
            const tbody = document.getElementById('tbody-agendamentos');
            tbody.innerHTML = '';
            data.forEach(a => {
                tbody.innerHTML += `<tr><td>${a.id}</td><td>${a.tutor_id}</td><td>${a.pet_id}</td><td>${a.servico_id}</td><td>${new Date(a.data_hora).toLocaleString()}</td><td>${a.status}</td><td><button class="btn-delete" onclick="API.deleteAgendamento(${a.id}).then(()=>loadData('agendamentos'))">Excluir</button></td></tr>`;
            });
        } catch (e) { console.error(e); }
    }
}

document.getElementById('form-tutor').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        await API.createTutor({
            nome: document.getElementById('tutor-nome').value,
            contato: document.getElementById('tutor-contato').value
        });
        closeModal('modal-tutor');
        loadData('tutores');
    } catch (err) { alert(err.message); }
});

document.getElementById('form-pet').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        await API.createPet({
            nome: document.getElementById('pet-nome').value,
            especie: document.getElementById('pet-especie').value,
            sexo: document.getElementById('pet-sexo').value,
            tutor_id: parseInt(document.getElementById('pet-tutor-id').value, 10)
        });
        closeModal('modal-pet');
        loadData('pets');
    } catch (err) { alert(err.message); }
});

document.getElementById('form-servico').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        await API.createServico({
            nome: document.getElementById('servico-nome').value,
            descricao: document.getElementById('servico-descricao').value,
            preco: parseFloat(document.getElementById('servico-preco').value)
        });
        closeModal('modal-servico');
        loadData('servicos');
    } catch (err) { alert(err.message); }
});

document.getElementById('form-agendamento').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        await API.createAgendamento({
            tutor_id: parseInt(document.getElementById('agen-tutor-id').value, 10),
            pet_id: parseInt(document.getElementById('agen-pet-id').value, 10),
            servico_id: parseInt(document.getElementById('agen-servico-id').value, 10),
            data_hora: document.getElementById('agen-datahora').value,
            status: 'Agendado'
        });
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

window.onload = () => {
    checkAuth();
    if (localStorage.getItem('aumiau_token')) {
        loadProfile();
    }
};

