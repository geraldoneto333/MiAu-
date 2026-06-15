'use client';

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { API, Agendamento, Pet, Servico, Tutor } from '@/lib/api';
import { Modal } from '@/components/Modal';

const STATUS = ['Agendado', 'Em Andamento', 'Concluido', 'Cancelado'] as const;

function toLocalInput(iso: string) {
  const d = new Date(iso.includes('T') ? iso : iso.replace(' ', 'T'));
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function toApiDateTime(local: string) {
  const d = new Date(local);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:00`;
}

export default function AgendamentosPage() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [tutores, setTutores] = useState<Tutor[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [viewDate, setViewDate] = useState(() => new Date());
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [form, setForm] = useState({
    tutor_id: 0,
    pet_id: 0,
    servico_id: 0,
    data_hora: '',
    status: 'Agendado' as string,
  });

  const load = useCallback(async () => {
    const [a, t, p, s] = await Promise.all([
      API.getAgendamentos(),
      API.getTutores(),
      API.getPets(),
      API.getServicos(),
    ]);
    setAgendamentos(a);
    setTutores(t);
    setPets(p);
    setServicos(s);
  }, []);

  useEffect(() => {
    load().catch(console.error);
  }, [load]);

  const lookup = (cache: { id: number; nome: string }[], id: number) =>
    cache.find((x) => x.id === id)?.nome ?? '—';

  const filteredPets = pets.filter((p) => p.tutor_id === form.tutor_id);

  const openCreate = () => {
    setEditId(null);
    setForm({
      tutor_id: tutores[0]?.id ?? 0,
      pet_id: 0,
      servico_id: servicos[0]?.id ?? 0,
      data_hora: '',
      status: 'Agendado',
    });
    setOpen(true);
  };

  const openEdit = (a: Agendamento) => {
    setEditId(a.id);
    setForm({
      tutor_id: a.tutor_id,
      pet_id: a.pet_id,
      servico_id: a.servico_id,
      data_hora: toLocalInput(a.data_hora),
      status: a.status,
    });
    setOpen(true);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const payload = {
      tutor_id: form.tutor_id,
      pet_id: form.pet_id,
      servico_id: form.servico_id,
      data_hora: toApiDateTime(form.data_hora),
      status: form.status,
    };
    try {
      if (editId) await API.updateAgendamento(editId, payload);
      else await API.createAgendamento(payload);
      setOpen(false);
      await load();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro');
    }
  };

  const remove = async (id: number) => {
    if (!confirm('Excluir agendamento?')) return;
    await API.deleteAgendamento(id);
    await load();
  };

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const countByDay = useMemo(() => {
    const map: Record<string, number> = {};
    agendamentos.forEach((a) => {
      const d = a.data_hora.slice(0, 10);
      map[d] = (map[d] ?? 0) + 1;
    });
    return map;
  }, [agendamentos]);

  const dayAgendamentos = selectedDay
    ? agendamentos.filter((a) => a.data_hora.startsWith(selectedDay))
    : [];

  return (
    <section id="sec-agendamentos" className="content-section">
      <div className="action-bar">
        <h2>Agendamentos</h2>
        <button type="button" onClick={openCreate}>
          + Novo Agendamento
        </button>
      </div>

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tutor</th>
              <th>Pet</th>
              <th>Serviço</th>
              <th>Data/Hora</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {agendamentos.map((a) => (
              <tr key={a.id}>
                <td>{a.id}</td>
                <td>{lookup(tutores, a.tutor_id)}</td>
                <td>{lookup(pets, a.pet_id)}</td>
                <td>{lookup(servicos, a.servico_id)}</td>
                <td>{a.data_hora}</td>
                <td>{a.status}</td>
                <td className="td-actions">
                  <button type="button" className="btn-edit" onClick={() => openEdit(a)}>
                    <i className="fas fa-pencil-alt" />
                  </button>
                  <button type="button" className="btn-delete" onClick={() => remove(a.id)}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="agenda-section">
        <div className="agenda-header">
          <button type="button" onClick={() => setViewDate(new Date(year, month - 1, 1))}>
            <i className="fas fa-chevron-left" />
          </button>
          <h3>
            {viewDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}
          </h3>
          <button type="button" onClick={() => setViewDate(new Date(year, month + 1, 1))}>
            <i className="fas fa-chevron-right" />
          </button>
        </div>
        <div className="agenda-grid">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((d) => (
            <div key={d} className="agenda-day-label">
              {d}
            </div>
          ))}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="agenda-cell empty" />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const count = countByDay[key] ?? 0;
            return (
              <button
                key={key}
                type="button"
                className={`agenda-cell${selectedDay === key ? ' selected' : ''}${count ? ' has-events' : ''}`}
                onClick={() => setSelectedDay(key)}
              >
                <span>{day}</span>
                {count > 0 && <span className="agenda-badge">{count}</span>}
              </button>
            );
          })}
        </div>
        {selectedDay && (
          <div className="agenda-detail">
            <h4>Agendamentos em {selectedDay.split('-').reverse().join('/')}</h4>
            {dayAgendamentos.length === 0 ? (
              <p>Nenhum agendamento neste dia.</p>
            ) : (
              <ul>
                {dayAgendamentos.map((a) => (
                  <li key={a.id}>
                    {a.data_hora.slice(11, 16)} — {lookup(tutores, a.tutor_id)} /{' '}
                    {lookup(pets, a.pet_id)} — {lookup(servicos, a.servico_id)} ({a.status})
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <Modal
        id="modal-agendamento"
        title={editId ? 'Editar Agendamento' : 'Novo Agendamento'}
        open={open}
        onClose={() => setOpen(false)}
        footer={
          <>
            <button type="button" className="btn-cancel" onClick={() => setOpen(false)}>
              Cancelar
            </button>
            <button type="submit" form="form-agendamento" className="btn-primary">
              Salvar
            </button>
          </>
        }
      >
        <form id="form-agendamento" onSubmit={submit}>
          <div className="input-group">
            <label>Tutor</label>
            <select
              value={form.tutor_id}
              onChange={(e) =>
                setForm({ ...form, tutor_id: Number(e.target.value), pet_id: 0 })
              }
              required
            >
              {tutores.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nome}
                </option>
              ))}
            </select>
          </div>
          <div className="input-group">
            <label>Pet</label>
            <select
              value={form.pet_id}
              onChange={(e) => setForm({ ...form, pet_id: Number(e.target.value) })}
              required
              disabled={filteredPets.length === 0}
            >
              <option value={0} disabled>
                {filteredPets.length ? 'Selecione...' : 'Nenhum pet para este tutor'}
              </option>
              {filteredPets.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome} ({p.especie})
                </option>
              ))}
            </select>
          </div>
          <div className="input-group">
            <label>Serviço</label>
            <select
              value={form.servico_id}
              onChange={(e) => setForm({ ...form, servico_id: Number(e.target.value) })}
              required
            >
              {servicos.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nome}
                </option>
              ))}
            </select>
          </div>
          <div className="input-group">
            <label>Data e Hora</label>
            <input
              type="datetime-local"
              value={form.data_hora}
              onChange={(e) => setForm({ ...form, data_hora: e.target.value })}
              required
            />
          </div>
          <div className="input-group">
            <label>Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              {STATUS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </form>
      </Modal>
    </section>
  );
}
