'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { API, setToken } from '@/lib/api';
import { useRedirectIfAuthed } from '@/lib/useAuth';

export default function LoginPage() {
  useRedirectIfAuthed();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const data = await API.login(username, password);
      setToken(data.access_token);
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro no login');
    }
  };

  return (
    <div id="login-view" className="view">
      <div className="login-view-inner">
        <img src="/imagens/logo_completo_miau.png" alt="MiAu Logo Completo" />
        <div className="login-card">
          <h2>Bem-vindo ao MiAu!</h2>
          <form id="login-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="username">Usuário</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Senha</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-primary">
              Entrar
            </button>
            {error && (
              <p id="login-error" style={{ color: 'red', marginTop: 10 }}>
                {error}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
