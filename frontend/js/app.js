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
        loadData('produtos');
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
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        e.target.classList.add('active');

        document.querySelectorAll('.content-section').forEach(sec => sec.classList.add('hidden'));
        const target = e.target.getAttribute('data-target');
        const section = document.getElementById(`sec-${target}`);
        if(section) section.classList.remove('hidden');
        document.getElementById('page-title').textContent = e.target.textContent;
    });
});

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
                    <td>${t.Id}</td>
                    <td>${t.Nome}</td>
                    <td>${t.Contato || ''}</td>
                    <td>
                        <button class="btn-delete" onclick="API.deleteTutor(${t.Id}).then(()=>loadData('tutores'))">Excluir</button>
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
                    <td>${p.Id}</td>
                    <td>${p.Nome}</td>
                    <td>${p.Especie}</td>
                    <td>${p.TutorId}</td>
                    <td>
                        <button class="btn-delete" onclick="API.deletePet(${p.Id}).then(()=>loadData('pets'))">Excluir</button>
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
                    <td>${s.Id}</td>
                    <td>${s.Nome}</td>
                    <td>R$ ${s.Preco}</td>
                    <td><button class="btn-delete" onclick="API.deleteServico(${s.Id}).then(()=>loadData('servicos'))">Excluir</button></td>
                </tr>`;
            });
        } catch (e) { console.error(e); }
    } else if (module === 'produtos') {
        try {
            const data = await API.getProdutos();
            const tbody = document.getElementById('tbody-produtos');
            tbody.innerHTML = '';
            data.forEach(p => {
                tbody.innerHTML += `<tr>
                    <td>${p.Id}</td>
                    <td>${p.Nome}</td>
                    <td>R$ ${p.Preco}</td>
                    <td>${p.Estoque}</td>
                    <td><button class="btn-delete" onclick="API.deleteProduto(${p.Id}).then(()=>loadData('produtos'))">Excluir</button></td>
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
                    <td>${a.Id}</td>
                    <td>${a.TutorId}</td>
                    <td>${a.PetId}</td>
                    <td>${a.ServicoId}</td>
                    <td>${new Date(a.DataHora).toLocaleString()}</td>
                    <td>${a.Status}</td>
                    <td><button class="btn-delete" onclick="API.deleteAgendamento(${a.Id}).then(()=>loadData('agendamentos'))">Excluir</button></td>
                </tr>`;
            });
        } catch (e) { console.error(e); }
    }
}

// Inicializa a aplicação - [Carlos Eduardo]
window.onload = checkAuth;
