'use client';

import { useEffect, useState } from 'react';
import { API, Aviso } from '@/lib/api';

export default function HomePage() {
  const [avisos, setAvisos] = useState<Aviso[]>([]);

  useEffect(() => {
    API.getAvisos()
      .then(setAvisos)
      .catch(() => setAvisos([]));
  }, []);

  return (
    <section id="sec-home" className="content-section">
      <div className="home-grid">
        <div className="home-card welcome-card">
          <h2>
            <i className="fas fa-paw" /> Bem-vindo ao MiAu!
          </h2>
          <p>Este é o sistema completo de gestão fullstack para a sua clínica pet.</p>
          <ul className="home-features">
            <li>
              <i className="fas fa-user-friends" /> <strong>Tutores & Pets:</strong> Cadastre donos,
              fotos e todos os pets em um só lugar.
            </li>
            <li>
              <i className="fas fa-calendar-check" /> <strong>Agendamentos:</strong> Marque consultas
              e banhos de forma rápida.
            </li>
            <li>
              <i className="fas fa-book" /> <strong>API Docs:</strong> Swagger integrado no menu
              lateral.
            </li>
          </ul>
        </div>
        <div className="home-card mural-card">
          <h2>
            <i className="fas fa-thumbtack" /> Mural de Avisos
          </h2>
          <div id="mural-list">
            {avisos.length === 0 ? (
              <div className="aviso">Nenhum aviso no mural.</div>
            ) : (
              avisos.map((a) => (
                <div key={a.id} className="aviso">
                  <strong>[{a.tipo}]</strong> {a.mensagem}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
