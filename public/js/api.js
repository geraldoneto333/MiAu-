// Arquivo de comunicação com a API REST usando Fetch - [Carlos Eduardo]

const API_BASE_URL = window.location.origin;

// Função que encapsula o Fetch adicionando o Token JWT no Header - [Carlos Eduardo]
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
        // Token expirado ou inválido
        localStorage.removeItem('aumiau_token');
        window.location.reload();
    }

    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.detail || 'Erro na requisição');
    }

    return data;
}

// Objeto que concentra os métodos do CRUD para consumo do Frontend - [Carlos Eduardo]
const API = {
    login: async (username, password) => {
        // O OAuth2PasswordRequestForm do FastAPI espera content-type urlencoded
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);

        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.detail);
        return data;
    },
    
    // Serviços CRUD Tutores
    getTutores: () => apiFetch('/api/tutores'),
    createTutor: (tutor) => apiFetch('/api/tutores', { method: 'POST', body: JSON.stringify(tutor) }),
    updateTutor: (id, tutor) => apiFetch(`/api/tutores/${id}`, { method: 'PUT', body: JSON.stringify(tutor) }),
    deleteTutor: (id) => apiFetch(`/api/tutores/${id}`, { method: 'DELETE' }),

    // Serviços CRUD Pets
    getPets: () => apiFetch('/api/pets'),
    createPet: (pet) => apiFetch('/api/pets', { method: 'POST', body: JSON.stringify(pet) }),
    updatePet: (id, pet) => apiFetch(`/api/pets/${id}`, { method: 'PUT', body: JSON.stringify(pet) }),
    deletePet: (id) => apiFetch(`/api/pets/${id}`, { method: 'DELETE' }),

    // Serviços CRUD Adicionais
    getServicos: () => apiFetch('/api/servicos'),
    deleteServico: (id) => apiFetch(`/api/servicos/${id}`, { method: 'DELETE' }),

    getAgendamentos: () => apiFetch('/api/agendamentos'),
    deleteAgendamento: (id) => apiFetch(`/api/agendamentos/${id}`, { method: 'DELETE' }),

    // Perfil do Usuário
    getProfile: () => apiFetch('/auth/me'),
    updateProfile: (data) => apiFetch('/auth/me', {
        method: 'PUT',
        body: JSON.stringify(data)
    })
};
