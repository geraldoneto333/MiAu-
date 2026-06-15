import { Tutor } from '../entities/tutor.entity';
import { Pet } from '../entities/pet.entity';
import { Servico } from '../entities/servico.entity';
import { Agendamento } from '../entities/agendamento.entity';
import { Aviso } from '../entities/aviso.entity';
import { TutorDto, PetDto, ServicoDto, AgendamentoDto, AvisoDto } from './dto';

export function toTutorDto(t: Tutor): TutorDto {
  return {
    id: t.id,
    nome: t.nome,
    contato: t.contato,
    endereco: t.endereco ?? undefined,
    telefone: t.telefone ?? undefined,
    foto: t.foto ?? undefined,
  };
}

export function toPetDto(p: Pet): PetDto {
  return {
    id: p.id,
    nome: p.nome,
    especie: p.especie,
    raca: p.raca ?? undefined,
    sexo: p.sexo,
    tutor_id: p.tutorId,
  };
}

export function toServicoDto(s: Servico): ServicoDto {
  return {
    id: s.id,
    nome: s.nome,
    descricao: s.descricao ?? undefined,
    preco: Number(s.preco),
  };
}

export function toAgendamentoDto(a: Agendamento): AgendamentoDto {
  const dt =
    a.dataHora instanceof Date
      ? a.dataHora.toISOString().slice(0, 19)
      : String(a.dataHora);
  return {
    id: a.id,
    tutor_id: a.tutorId,
    pet_id: a.petId,
    servico_id: a.servicoId,
    data_hora: dt.replace('T', ' '),
    status: a.status,
  };
}

export function toAvisoDto(a: Aviso): AvisoDto {
  return {
    id: a.id,
    tipo: a.tipo,
    mensagem: a.mensagem,
    data_criacao: a.dataCriacao?.toISOString?.() ?? undefined,
  };
}

export function parseDataHora(value: string): Date {
  const normalized = value.includes('T')
    ? value
    : value.replace(' ', 'T');
  return new Date(normalized);
}
