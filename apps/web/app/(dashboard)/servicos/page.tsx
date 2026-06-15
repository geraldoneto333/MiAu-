'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import { API, Servico } from '@/lib/api';
import { Modal } from '@/components/Modal';

const emptyForm = { nome: '', descricao: '', preco: '' };

export default function ServicosPage() {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);

  const load = useCallback(async () => {
    setServicos(await API.getServicos());
  }, []);

  useEffect(() => {
    load().catch(console.error);
  }, [load]);

  const openCreate = () => {
    setEditId(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (s: Servico) => {
    setEditId(s.id);
    setForm({
      nome: s.nome,
      descricao: s.descricao ?? '',
      preco: String(s.preco),
    });
    setOpen(true);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const payload = {
      nome: form.nome,
      descricao: form.descricao || undefined,
      preco: parseFloat(form.preco),
    };
    try {
      if (editId) await API.updateServico(editId, payload);
      else await API.createServico(payload);
      setOpen(false);
      await load();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro');
    }
  };

  const remove = async (id: number) => {
    if (!confirm('Excluir este serviço?')) return;
    await API.deleteServico(id);
    await load();
  };

  return (
    <section id="sec-servicos" className="content-section">
      <div className="action-bar">
        <h2>Catálogo de Serviços</h2>
        <button type="button" onClick={openCreate}>
          + Novo Serviço
        </button>
      </div>
      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Preço</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {servicos.map((s) => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.nome}</td>
                <td>R$ {Number(s.preco).toFixed(2)}</td>
                <td className="td-actions">
                  <button type="button" className="btn-edit" onClick={() => openEdit(s)}>
                    <i className="fas fa-pencil-alt" />
                  </button>
                  <button type="button" className="btn-delete" onClick={() => remove(s.id)}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        id="modal-servico"
        title={editId ? 'Editar Serviço' : 'Novo Serviço'}
        open={open}
        onClose={() => setOpen(false)}
        footer={
          <>
            <button type="button" className="btn-cancel" onClick={() => setOpen(false)}>
              Cancelar
            </button>
            <button type="submit" form="form-servico" className="btn-primary">
              Salvar
            </button>
          </>
        }
      >
        <form id="form-servico" onSubmit={submit}>
          <div className="input-group">
            <label>Nome</label>
            <input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required />
          </div>
          <div className="input-group">
            <label>Descrição</label>
            <textarea
              value={form.descricao}
              onChange={(e) => setForm({ ...form, descricao: e.target.value })}
            />
          </div>
          <div className="input-group">
            <label>Preço (R$)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.preco}
              onChange={(e) => setForm({ ...form, preco: e.target.value })}
              required
            />
          </div>
        </form>
      </Modal>
    </section>
  );
}
