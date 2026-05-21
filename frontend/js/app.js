// Arquivo principal de controle da UI (Single Page Application) - [Carlos Eduardo]

// Função que valida o token de acesso do usuário no Front - [Carlos Eduardo]
function checkAuth() {
    const token = localStorage.getItem('aumiau_token');
    if (token) {
        document.getElementById('login-view').classList.add('hidden');
        document.getElementById('app-view').classList.remove('hidden');
        loadData('tutores');
        loadData('pets');
        loadData('servicos');
        loadData('agendamentos');
    } else {
        document.getElementById('login-view').classList.remove('hidden');
        document.getElementById('app-view').classList.add('hidden');
    }
}

// Lógica de Login
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

// Logout
document.getElementById('btn-logout').addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('aumiau_token');
    checkAuth();
});

// Navegação entre as telas - [Carlos Eduardo]
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetElement = e.target.closest('.nav-link');
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        targetElement.classList.add('active');

        document.querySelectorAll('.content-section').forEach(sec => sec.classList.add('hidden'));
        const target = targetElement.getAttribute('data-target');
        const section = document.getElementById(`sec-${target}`);
        if(section) section.classList.remove('hidden');
        document.getElementById('page-title').textContent = targetElement.querySelector('span').textContent;
    });
});

// Lógica para abrir/fechar a sidebar (Hamburger Menu) - [Carlos Eduardo]
document.getElementById('sidebar-toggle').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('collapsed');
});

// --- Dropdowns da Topbar (Perfil e Notificações) ---
document.getElementById('btn-profile').addEventListener('click', (e) => {
    e.stopPropagation();
    document.getElementById('profile-dropdown').classList.toggle('show');
    document.getElementById('notif-dropdown').classList.remove('show');
});

document.getElementById('btn-notifications').addEventListener('click', (e) => {
    e.stopPropagation();
    document.getElementById('notif-dropdown').classList.toggle('show');
    document.getElementById('profile-dropdown').classList.remove('show');
});

// Fechar dropdowns ao clicar fora
window.addEventListener('click', (e) => {
    if (!e.target.closest('#profile-wrapper')) {
        document.getElementById('profile-dropdown').classList.remove('show');
    }
    if (!e.target.closest('#notif-wrapper')) {
        document.getElementById('notif-dropdown').classList.remove('show');
    }
});

// Lógica do Sistema de Notificações
const mockNotifications = [
    { title: "Novo Aviso: Campanha Vacinação", time: "Hoje, 10:00" },
    { title: "Sistema Atualizado v2.0", time: "Hoje, 08:00" },
    { title: "Agendamento Confirmado - Rex", time: "Ontem" }
];

function renderNotifications() {
    const list = document.getElementById('notif-list');
    const badge = document.getElementById('notif-badge');
    
    if (!list || !badge) return;

    list.innerHTML = '';
    if (mockNotifications.length === 0) {
        list.innerHTML = '<div class="notif-item">Nenhuma notificação nova.</div>';
        badge.style.display = 'none';
    } else {
        badge.textContent = mockNotifications.length;
        badge.style.display = 'block';
        mockNotifications.forEach(n => {
            list.innerHTML += `<div class="notif-item">
                <strong>${n.title}</strong>
                ${n.time}
            </div>`;
        });
    }
}

window.clearNotifications = function(e) {
    if(e) e.preventDefault();
    mockNotifications.length = 0; // Zera a lista
    renderNotifications();
};

function openModal(id) {
    document.getElementById(id).classList.remove('hidden');
}

function closeModal(id) {
    document.getElementById(id).classList.add('hidden');
}

// Função para buscar e renderizar dados na tela - [Carlos Eduardo]
async function loadData(module) {
    if (module === 'tutores') {
        try {
            const data = await API.getTutores();
            const tbody = document.getElementById('tbody-tutores');
            tbody.innerHTML = '';
            data.forEach(t => {
                tbody.innerHTML += `<tr>
                    <td>${t.id}</td>
                    <td>${t.nome}</td>
                    <td>${t.contato || ''}</td>
                    <td>
                        <button class="btn-delete" onclick="API.deleteTutor(${t.id}).then(()=>loadData('tutores'))">Excluir</button>
                    </td>
                </tr>`;
            });
        } catch (e) { console.error(e); }
    } else if (module === 'pets') {
        try {
            const data = await API.getPets();
            const tbody = document.getElementById('tbody-pets');
            tbody.innerHTML = '';
            data.forEach(p => {
                tbody.innerHTML += `<tr>
                    <td>${p.id}</td>
                    <td>${p.nome}</td>
                    <td>${p.especie}</td>
                    <td>${p.tutor_id}</td>
                    <td>
                        <button class="btn-delete" onclick="API.deletePet(${p.id}).then(()=>loadData('pets'))">Excluir</button>
                    </td>
                </tr>`;
            });
        } catch (e) { console.error(e); }
    } else if (module === 'servicos') {
        try {
            const data = await API.getServicos();
            const tbody = document.getElementById('tbody-servicos');
            tbody.innerHTML = '';
            data.forEach(s => {
                tbody.innerHTML += `<tr>
                    <td>${s.id}</td>
                    <td>${s.nome}</td>
                    <td>R$ ${s.preco}</td>
                    <td><button class="btn-delete" onclick="API.deleteServico(${s.id}).then(()=>loadData('servicos'))">Excluir</button></td>
                </tr>`;
            });
        } catch (e) { console.error(e); }
    } else if (module === 'agendamentos') {
        try {
            const data = await API.getAgendamentos();
            const tbody = document.getElementById('tbody-agendamentos');
            tbody.innerHTML = '';
            data.forEach(a => {
                tbody.innerHTML += `<tr>
                    <td>${a.id}</td>
                    <td>${a.tutor_id}</td>
                    <td>${a.pet_id}</td>
                    <td>${a.servico_id}</td>
                    <td>${new Date(a.data_hora).toLocaleString()}</td>
                    <td>${a.status}</td>
                    <td><button class="btn-delete" onclick="API.deleteAgendamento(${a.id}).then(()=>loadData('agendamentos'))">Excluir</button></td>
                </tr>`;
            });
        } catch (e) { console.error(e); }
    }
}

// Função para carregar Perfil
async function loadProfile() {
    try {
        const data = await API.getProfile();
        document.getElementById('perfil-nome').value = data.username;
        document.getElementById('perfil-email').value = data.email;
        
        // Carrega a foto do localStorage
        const savedAvatar = localStorage.getItem('aumiau_avatar');
        const defaultAvatar = `https://ui-avatars.com/api/?name=${data.username}&background=ffd1dc&color=111`;
        
        document.getElementById('perfil-avatar-preview').src = savedAvatar || defaultAvatar;
        document.getElementById('user-avatar-img').src = savedAvatar || defaultAvatar;
    } catch (e) { console.error("Erro ao carregar perfil:", e); }
}

// Salvar Perfil
document.getElementById('form-perfil').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('perfil-nome').value;
    const email = document.getElementById('perfil-email').value;
    const password = document.getElementById('perfil-senha').value;
    
    const payload = { username, email };
    if (password.trim() !== '') {
        payload.password = password;
    }
    
    try {
        await API.updateProfile(payload);
        closeModal('modal-perfil');
        document.getElementById('perfil-senha').value = ''; // Limpa o campo de senha
        loadProfile(); // recarrega
        alert('Perfil atualizado com sucesso!');
    } catch(e) { alert(e.message); }
});

// Upload de Foto
document.getElementById('foto-upload').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const base64Img = event.target.result;
            localStorage.setItem('aumiau_avatar', base64Img); // Salva foto no PC localmente
            document.getElementById('perfil-avatar-preview').src = base64Img;
            document.getElementById('user-avatar-img').src = base64Img;
        };
        reader.readAsDataURL(file);
    }
});

// Remover foto
document.getElementById('btn-remover-foto').addEventListener('click', () => {
    localStorage.removeItem('aumiau_avatar');
    loadProfile();
});

// Inicializa a aplicação - [Carlos Eduardo]
window.onload = () => {
    checkAuth();
    if(localStorage.getItem('aumiau_token')) {
        loadProfile();
    }
    renderNotifications();
};
