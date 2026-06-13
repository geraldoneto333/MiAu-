// Arquivo de comunicacao com a API REST usando Fetch - [Carlos Eduardo]

const API_BASE_URL = window.location.origin;

async function apiFetch(endpoint, options = {}) {
    const token = localStorage.getItem('aumiau_token');
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers
    });

    if (response.status === 401) {
        localStorage.removeItem('aumiau_token');
        window.location.reload();
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.detail || `Erro HTTP ${response.status}`);
    }

    return data;
}

const API = {
    login: async (username, password) => {
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);

        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.detail || `Erro HTTP ${response.status}`);
        return data;
    },

    getTutores: () => apiFetch('/api/tutores'),
    createTutor: (tutor) => apiFetch('/api/tutores', { method: 'POST', body: JSON.stringify(tutor) }),
    updateTutor: (id, tutor) => apiFetch(`/api/tutores/${id}`, { method: 'PUT', body: JSON.stringify(tutor) }),
    deleteTutor: (id) => apiFetch(`/api/tutores/${id}`, { method: 'DELETE' }),

    getPets: () => apiFetch('/api/pets'),
    createPet: (pet) => apiFetch('/api/pets', { method: 'POST', body: JSON.stringify(pet) }),
    updatePet: (id, pet) => apiFetch(`/api/pets/${id}`, { method: 'PUT', body: JSON.stringify(pet) }),
    deletePet: (id) => apiFetch(`/api/pets/${id}`, { method: 'DELETE' }),

    getServicos: () => apiFetch('/api/servicos'),
    createServico: (servico) => apiFetch('/api/servicos', { method: 'POST', body: JSON.stringify(servico) }),
    updateServico: (id, servico) => apiFetch(`/api/servicos/${id}`, { method: 'PUT', body: JSON.stringify(servico) }),
    deleteServico: (id) => apiFetch(`/api/servicos/${id}`, { method: 'DELETE' }),

    getAgendamentos: () => apiFetch('/api/agendamentos'),
    createAgendamento: (agendamento) => apiFetch('/api/agendamentos', { method: 'POST', body: JSON.stringify(agendamento) }),
    updateAgendamento: (id, agendamento) => apiFetch(`/api/agendamentos/${id}`, { method: 'PUT', body: JSON.stringify(agendamento) }),
    deleteAgendamento: (id) => apiFetch(`/api/agendamentos/${id}`, { method: 'DELETE' }),

    getAvisos: () => apiFetch('/api/avisos'),
    createAviso: (aviso) => apiFetch('/api/avisos', { method: 'POST', body: JSON.stringify(aviso) }),
    deleteAviso: (id) => apiFetch(`/api/avisos/${id}`, { method: 'DELETE' }),

    getProfile: () => apiFetch('/auth/me'),
    updateProfile: (data) => apiFetch('/auth/me', {
        method: 'PUT',
        body: JSON.stringify(data)
    })
};
