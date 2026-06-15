const API_BASE =
  typeof window !== 'undefined'
    ? window.location.origin
    : process.env.NEXT_PUBLIC_APP_URL ?? 'http://127.0.0.1:3000';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('aumiau_token');
}

export function setToken(token: string) {
  localStorage.setItem('aumiau_token', token);
}

export function clearToken() {
  localStorage.removeItem('aumiau_token');
}

async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });

  if (response.status === 401 && typeof window !== 'undefined') {
    clearToken();
    window.location.href = '/login';
    throw new Error('Não autorizado');
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error((data as { detail?: string }).detail ?? `Erro HTTP ${response.status}`);
  }
  return data as T;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface Tutor {
  id: number;
  nome: string;
  contato: string;
  endereco?: string;
  telefone?: string;
  foto?: string;
}

export interface Pet {
  id: number;
  nome: string;
  especie: 'Cachorro' | 'Gato';
  raca?: string;
  sexo: 'M' | 'F';
  tutor_id: number;
}

export interface Servico {
  id: number;
  nome: string;
  descricao?: string;
  preco: number;
}

export interface Agendamento {
  id: number;
  tutor_id: number;
  pet_id: number;
  servico_id: number;
  data_hora: string;
  status: string;
}

export interface Aviso {
  id: number;
  tipo: string;
  mensagem: string;
  data_criacao?: string;
}

export interface Profile {
  username: string;
  email: string;
}

export const API = {
  login: async (username: string, password: string): Promise<TokenResponse> => {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData,
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error((data as { detail?: string }).detail ?? 'Erro no login');
    return data as TokenResponse;
  },

  getTutores: () => apiFetch<Tutor[]>('/api/tutores'),
  createTutor: (tutor: Omit<Tutor, 'id'>) =>
    apiFetch<Tutor>('/api/tutores', { method: 'POST', body: JSON.stringify(tutor) }),
  updateTutor: (id: number, tutor: Omit<Tutor, 'id'>) =>
    apiFetch<{ message: string }>(`/api/tutores/${id}`, { method: 'PUT', body: JSON.stringify(tutor) }),
  deleteTutor: (id: number) =>
    apiFetch<{ message: string }>(`/api/tutores/${id}`, { method: 'DELETE' }),

  getPets: () => apiFetch<Pet[]>('/api/pets'),
  createPet: (pet: Omit<Pet, 'id'>) =>
    apiFetch<Pet>('/api/pets', { method: 'POST', body: JSON.stringify(pet) }),
  updatePet: (id: number, pet: Omit<Pet, 'id'>) =>
    apiFetch<Pet>(`/api/pets/${id}`, { method: 'PUT', body: JSON.stringify(pet) }),
  deletePet: (id: number) =>
    apiFetch<{ message: string }>(`/api/pets/${id}`, { method: 'DELETE' }),

  getServicos: () => apiFetch<Servico[]>('/api/servicos'),
  createServico: (servico: Omit<Servico, 'id'>) =>
    apiFetch<Servico>('/api/servicos', { method: 'POST', body: JSON.stringify(servico) }),
  updateServico: (id: number, servico: Omit<Servico, 'id'>) =>
    apiFetch<Servico>(`/api/servicos/${id}`, { method: 'PUT', body: JSON.stringify(servico) }),
  deleteServico: (id: number) =>
    apiFetch<{ message: string }>(`/api/servicos/${id}`, { method: 'DELETE' }),

  getAgendamentos: () => apiFetch<Agendamento[]>('/api/agendamentos'),
  createAgendamento: (ag: Omit<Agendamento, 'id'>) =>
    apiFetch<Agendamento>('/api/agendamentos', { method: 'POST', body: JSON.stringify(ag) }),
  updateAgendamento: (id: number, ag: Omit<Agendamento, 'id'>) =>
    apiFetch<Agendamento>(`/api/agendamentos/${id}`, { method: 'PUT', body: JSON.stringify(ag) }),
  deleteAgendamento: (id: number) =>
    apiFetch<{ message: string }>(`/api/agendamentos/${id}`, { method: 'DELETE' }),

  getAvisos: () => apiFetch<Aviso[]>('/api/avisos'),

  getProfile: () => apiFetch<Profile>('/auth/me'),
  updateProfile: (data: Partial<Profile & { password?: string }>) =>
    apiFetch<{ message: string }>('/auth/me', { method: 'PUT', body: JSON.stringify(data) }),
};
