'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import { API, Aviso, clearToken, getToken } from '@/lib/api';
import { useAuthGuard } from '@/lib/useAuth';
import { Modal } from '@/components/Modal';

const NAV = [
  { href: '/', label: 'Home', icon: 'fa-home' },
  { href: '/tutores-pets', label: 'Tutores & Pets', icon: 'fa-user-friends' },
  { href: '/servicos', label: 'Serviços', icon: 'fa-concierge-bell' },
  { href: '/agendamentos', label: 'Agendamentos', icon: 'fa-calendar-alt' },
  { href: '/docs', label: 'API Docs', icon: 'fa-book' },
];

function pageTitle(pathname: string): string {
  const item = NAV.find((n) => n.href === pathname);
  return item?.label ?? 'MiAu';
}

export function DashboardLayout({ children }: { children: ReactNode }) {
  useAuthGuard();
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const [profileOpenModal, setProfileOpenModal] = useState(false);
  const [profile, setProfile] = useState({ username: '', email: '', password: '' });
  const [avatar, setAvatar] = useState('');

  const loadAvisos = useCallback(async () => {
    try {
      setAvisos(await API.getAvisos());
    } catch {
      setAvisos([]);
    }
  }, []);

  useEffect(() => {
    if (!getToken()) return;
    loadAvisos();
    API.getProfile()
      .then((p) => {
        setProfile((prev) => ({ ...prev, username: p.username, email: p.email }));
        const stored = localStorage.getItem('aumiau_avatar');
        setAvatar(stored ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(p.username)}&background=ffd1dc&color=111`);
      })
      .catch(() => {});
  }, [loadAvisos]);

  const logout = () => {
    clearToken();
    router.push('/login');
  };

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: Record<string, string> = {
        username: profile.username,
        email: profile.email,
      };
      if (profile.password) payload.password = profile.password;
      await API.updateProfile(payload);
      alert('Perfil atualizado com sucesso');
      setProfileOpenModal(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao atualizar');
    }
  };

  return (
    <div id="app-view" className="view">
      <aside className={`sidebar${collapsed ? ' collapsed' : ''}`} id="sidebar">
        <div className="sidebar-logo">
          <img src="/imagens/logo_completo_miau.png" alt="MiAu" />
        </div>
        <nav>
          <ul>
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`nav-link${pathname === item.href ? ' active' : ''}`}
                >
                  <i className={`fas ${item.icon}`} /> <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <button
            type="button"
            id="sidebar-toggle"
            className="btn-toggle"
            onClick={() => setCollapsed((c) => !c)}
          >
            <i className="fas fa-bars" />
          </button>
          <h1 id="page-title">{pageTitle(pathname)}</h1>
          <div className="topbar-actions">
            <div className="notification-wrapper" id="notif-wrapper">
              <button
                type="button"
                className="icon-btn"
                id="btn-notifications"
                onClick={(e) => {
                  e.stopPropagation();
                  setNotifOpen((o) => !o);
                  setProfileOpen(false);
                }}
              >
                <i className="far fa-bell" />
                {avisos.length > 0 && (
                  <span className="badge" id="notif-badge">
                    {avisos.length}
                  </span>
                )}
              </button>
              <div className={`dropdown-menu${notifOpen ? ' show' : ''}`} id="notif-dropdown">
                <div className="dropdown-header">
                  <strong>Notificações</strong>
                  <a
                    href="#"
                    id="mark-read-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      setAvisos([]);
                    }}
                  >
                    Ler todas
                  </a>
                </div>
                <div className="dropdown-list" id="notif-list">
                  {avisos.length === 0 ? (
                    <div className="notif-item">Nenhuma notificacao nova.</div>
                  ) : (
                    avisos.map((a) => (
                      <div key={a.id} className="notif-item">
                        <strong>
                          [{a.tipo}] {a.mensagem}
                        </strong>
                        {a.data_criacao &&
                          new Date(a.data_criacao).toLocaleString('pt-BR')}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="profile-wrapper" id="profile-wrapper">
              <button
                type="button"
                className="profile-btn"
                id="btn-profile"
                onClick={(e) => {
                  e.stopPropagation();
                  setProfileOpen((o) => !o);
                  setNotifOpen(false);
                }}
              >
                <img src={avatar} alt="Avatar" id="user-avatar-img" />
              </button>
              <div className={`dropdown-menu${profileOpen ? ' show' : ''}`} id="profile-dropdown">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setProfileOpenModal(true);
                    setProfileOpen(false);
                  }}
                >
                  <i className="far fa-user" /> Meu Perfil
                </a>
                <div className="dropdown-divider" />
                <a href="#" id="btn-logout" className="text-danger" onClick={() => logout()}>
                  <i className="fas fa-sign-out-alt" /> Sair do Sistema
                </a>
              </div>
            </div>
          </div>
        </header>

        <div className="content-area">{children}</div>
      </main>

      <Modal
        id="modal-perfil"
        title="Meu Perfil"
        open={profileOpenModal}
        onClose={() => setProfileOpenModal(false)}
        footer={
          <>
            <button type="button" className="btn-cancel" onClick={() => setProfileOpenModal(false)}>
              Cancelar
            </button>
            <button type="submit" form="form-perfil" className="btn-primary">
              Salvar
            </button>
          </>
        }
      >
        <form id="form-perfil" onSubmit={saveProfile}>
          <div className="input-group">
            <label htmlFor="profile-username">Usuário</label>
            <input
              id="profile-username"
              value={profile.username}
              onChange={(e) => setProfile({ ...profile, username: e.target.value })}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="profile-email">E-mail</label>
            <input
              id="profile-email"
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="profile-password">Nova senha (opcional)</label>
            <input
              id="profile-password"
              type="password"
              value={profile.password}
              onChange={(e) => setProfile({ ...profile, password: e.target.value })}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
