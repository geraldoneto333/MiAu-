'use client';

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { API, Pet, Tutor } from '@/lib/api';
import { Modal } from '@/components/Modal';

function normalize(s: string) {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export default function TutoresPetsPage() {
  const [tutores, setTutores] = useState<Tutor[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [search, setSearch] = useState('');

  const [tutorModal, setTutorModal] = useState(false);
  const [petModal, setPetModal] = useState(false);
  const [editTutorId, setEditTutorId] = useState<number | null>(null);
  const [editPetId, setEditPetId] = useState<number | null>(null);
  const [tutorForm, setTutorForm] = useState({
    nome: '',
    contato: '',
    telefone: '',
    endereco: '',
    foto: '' as string | undefined,
  });
  const [petForm, setPetForm] = useState({
    nome: '',
    especie: 'Cachorro' as 'Cachorro' | 'Gato',
    raca: '',
    sexo: 'M' as 'M' | 'F',
    tutor_id: 0,
  });

  const load = useCallback(async () => {
    const [t, p] = await Promise.all([API.getTutores(), API.getPets()]);
    setTutores(t);
    setPets(p);
  }, []);

  useEffect(() => {
    load().catch(console.error);
  }, [load]);

  const filteredTutores = useMemo(() => {
    const q = normalize(search.trim());
    if (!q) return tutores;
    return tutores.filter((t) => {
      const matchTutor =
        normalize(t.nome).includes(q) ||
        normalize(t.contato ?? '').includes(q) ||
        normalize(t.telefone ?? '').includes(q);
      const matchPet = pets.some(
        (p) => p.tutor_id === t.id && normalize(p.nome).includes(q),
      );
      return matchTutor || matchPet;
    });
  }, [tutores, pets, search]);

  useEffect(() => {
    if (search.trim()) {
      setExpanded(new Set(filteredTutores.map((t) => t.id)));
    }
  }, [search, filteredTutores]);

  const petsByTutor = (tutorId: number) => pets.filter((p) => p.tutor_id === tutorId);

  const toggleExpand = (id: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const openCreateTutor = () => {
    setEditTutorId(null);
    setTutorForm({ nome: '', contato: '', telefone: '', endereco: '', foto: undefined });
    setTutorModal(true);
  };

  const openEditTutor = (t: Tutor) => {
    setEditTutorId(t.id);
    setTutorForm({
      nome: t.nome,
      contato: t.contato,
      telefone: t.telefone ?? '',
      endereco: t.endereco ?? '',
      foto: t.foto,
    });
    setTutorModal(true);
  };

  const openCreatePet = (tutorId?: number) => {
    setEditPetId(null);
    setPetForm({
      nome: '',
      especie: 'Cachorro',
      raca: '',
      sexo: 'M',
      tutor_id: tutorId ?? tutores[0]?.id ?? 0,
    });
    setPetModal(true);
  };

  const openEditPet = (p: Pet) => {
    setEditPetId(p.id);
    setPetForm({
      nome: p.nome,
      especie: p.especie,
      raca: p.raca ?? '',
      sexo: p.sexo,
      tutor_id: p.tutor_id,
    });
    setPetModal(true);
  };

  const onFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setTutorForm((f) => ({ ...f, foto: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const submitTutor = async (e: FormEvent) => {
    e.preventDefault();
    const payload = {
      nome: tutorForm.nome,
      contato: tutorForm.contato,
      telefone: tutorForm.telefone || undefined,
      endereco: tutorForm.endereco || undefined,
      foto: tutorForm.foto,
    };
    try {
      if (editTutorId) await API.updateTutor(editTutorId, payload);
      else await API.createTutor(payload);
      setTutorModal(false);
      await load();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro');
    }
  };

  const submitPet = async (e: FormEvent) => {
    e.preventDefault();
    const payload = {
      nome: petForm.nome,
      especie: petForm.especie,
      raca: petForm.raca || undefined,
      sexo: petForm.sexo,
      tutor_id: petForm.tutor_id,
    };
    try {
      if (editPetId) await API.updatePet(editPetId, payload);
      else await API.createPet(payload);
      setPetModal(false);
      await load();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro');
    }
  };

  const removeTutor = async (id: number) => {
    if (!confirm('Excluir tutor e pets vinculados?')) return;
    await API.deleteTutor(id);
    await load();
  };

  const removePet = async (id: number) => {
    if (!confirm('Excluir pet?')) return;
    await API.deletePet(id);
    await load();
  };

  const avatarSrc = (t: Tutor) =>
    t.foto ??
    `https://ui-avatars.com/api/?name=${encodeURIComponent(t.nome)}&background=ffd1dc&color=111`;

  return (
    <section id="sec-tutores-pets" className="content-section">
      <div className="action-bar">
        <h2>Gestão de Tutores e Pets</h2>
        <div className="action-bar-actions">
          <button type="button" onClick={openCreateTutor}>
            + Novo Tutor
          </button>
          <button type="button" onClick={() => openCreatePet()}>
            + Novo Pet
          </button>
        </div>
      </div>

      <div className="tutores-pets-search-wrap">
        <input
          type="search"
          id="tutores-pets-search"
          placeholder="Buscar tutor ou pet..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="tutores-pets-list">
        {filteredTutores.length === 0 ? (
          <p className="tutores-pets-empty">Nenhum tutor encontrado.</p>
        ) : (
          filteredTutores.map((t) => {
            const tPets = petsByTutor(t.id);
            const isExpanded = expanded.has(t.id);
            return (
              <div key={t.id} className={`tutor-card${isExpanded ? ' expanded' : ''}`}>
                <div className="tutor-card-header" onClick={() => toggleExpand(t.id)}>
                  <img src={avatarSrc(t)} alt={t.nome} className="tutor-foto-thumb" />
                  <div className="tutor-card-info">
                    <strong>{t.nome}</strong>
                    <span className="tutor-meta">
                      {t.contato}
                      {t.telefone ? ` · ${t.telefone}` : ''}
                    </span>
                  </div>
                  <span className="tutor-pet-badge">{tPets.length} pet(s)</span>
                  <div className="tutor-card-actions" onClick={(e) => e.stopPropagation()}>
                    <button type="button" className="btn-edit" onClick={() => openEditTutor(t)}>
                      <i className="fas fa-pencil-alt" />
                    </button>
                    <button type="button" className="btn-delete" onClick={() => removeTutor(t.id)}>
                      Excluir
                    </button>
                  </div>
                  <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'} tutor-chevron`} />
                </div>
                {isExpanded && (
                  <div className="tutor-card-body">
                    <div className="action-bar" style={{ marginBottom: 12 }}>
                      <button type="button" onClick={() => openCreatePet(t.id)}>
                        + Novo Pet
                      </button>
                    </div>
                    {tPets.length === 0 ? (
                      <p>Nenhum pet cadastrado.</p>
                    ) : (
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>Nome</th>
                            <th>Espécie</th>
                            <th>Sexo</th>
                            <th>Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tPets.map((p) => (
                            <tr key={p.id}>
                              <td>{p.nome}</td>
                              <td>{p.especie}</td>
                              <td>{p.sexo === 'M' ? 'Macho' : 'Fêmea'}</td>
                              <td className="td-actions">
                                <button type="button" className="btn-edit" onClick={() => openEditPet(p)}>
                                  <i className="fas fa-pencil-alt" />
                                </button>
                                <button type="button" className="btn-delete" onClick={() => removePet(p.id)}>
                                  Excluir
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <Modal
        id="modal-tutor"
        title={editTutorId ? 'Editar Tutor' : 'Novo Tutor'}
        open={tutorModal}
        onClose={() => setTutorModal(false)}
        footer={
          <>
            <button type="button" className="btn-cancel" onClick={() => setTutorModal(false)}>
              Cancelar
            </button>
            <button type="submit" form="form-tutor" className="btn-primary">
              Salvar
            </button>
          </>
        }
      >
        <form id="form-tutor" onSubmit={submitTutor}>
          <div className="input-group">
            <label>Foto</label>
            <input type="file" accept="image/*" onChange={onFotoChange} />
            {tutorForm.foto && (
              <img src={tutorForm.foto} alt="Preview" className="tutor-foto-preview" />
            )}
          </div>
          <div className="input-group">
            <label>Nome</label>
            <input
              value={tutorForm.nome}
              onChange={(e) => setTutorForm({ ...tutorForm, nome: e.target.value })}
              required
            />
          </div>
          <div className="input-group">
            <label>Contato (e-mail)</label>
            <input
              value={tutorForm.contato}
              onChange={(e) => setTutorForm({ ...tutorForm, contato: e.target.value })}
              required
            />
          </div>
          <div className="input-group">
            <label>Telefone</label>
            <input
              value={tutorForm.telefone}
              onChange={(e) => setTutorForm({ ...tutorForm, telefone: e.target.value })}
            />
          </div>
          <div className="input-group">
            <label>Endereço</label>
            <input
              value={tutorForm.endereco}
              onChange={(e) => setTutorForm({ ...tutorForm, endereco: e.target.value })}
            />
          </div>
        </form>
      </Modal>

      <Modal
        id="modal-pet"
        title={editPetId ? 'Editar Pet' : 'Novo Pet'}
        open={petModal}
        onClose={() => setPetModal(false)}
        footer={
          <>
            <button type="button" className="btn-cancel" onClick={() => setPetModal(false)}>
              Cancelar
            </button>
            <button type="submit" form="form-pet" className="btn-primary">
              Salvar
            </button>
          </>
        }
      >
        <form id="form-pet" onSubmit={submitPet}>
          <div className="input-group">
            <label>Tutor</label>
            <select
              value={petForm.tutor_id}
              onChange={(e) => setPetForm({ ...petForm, tutor_id: Number(e.target.value) })}
              required
            >
              <option value={0} disabled>
                Selecione...
              </option>
              {tutores.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nome}
                </option>
              ))}
            </select>
          </div>
          <div className="input-group">
            <label>Nome</label>
            <input
              value={petForm.nome}
              onChange={(e) => setPetForm({ ...petForm, nome: e.target.value })}
              required
            />
          </div>
          <div className="input-group">
            <label>Espécie</label>
            <select
              value={petForm.especie}
              onChange={(e) =>
                setPetForm({ ...petForm, especie: e.target.value as 'Cachorro' | 'Gato' })
              }
            >
              <option value="Cachorro">Cachorro</option>
              <option value="Gato">Gato</option>
            </select>
          </div>
          <div className="input-group">
            <label>Raça</label>
            <input
              value={petForm.raca}
              onChange={(e) => setPetForm({ ...petForm, raca: e.target.value })}
            />
          </div>
          <div className="input-group">
            <label>Sexo</label>
            <select
              value={petForm.sexo}
              onChange={(e) => setPetForm({ ...petForm, sexo: e.target.value as 'M' | 'F' })}
            >
              <option value="M">Macho</option>
              <option value="F">Fêmea</option>
            </select>
          </div>
        </form>
      </Modal>
    </section>
  );
}
