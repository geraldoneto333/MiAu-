"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toTutorDto = toTutorDto;
exports.toPetDto = toPetDto;
exports.toServicoDto = toServicoDto;
exports.toAgendamentoDto = toAgendamentoDto;
exports.toAvisoDto = toAvisoDto;
exports.parseDataHora = parseDataHora;
function toTutorDto(t) {
    return {
        id: t.id,
        nome: t.nome,
        contato: t.contato,
        endereco: t.endereco ?? undefined,
        telefone: t.telefone ?? undefined,
        foto: t.foto ?? undefined,
    };
}
function toPetDto(p) {
    return {
        id: p.id,
        nome: p.nome,
        especie: p.especie,
        raca: p.raca ?? undefined,
        sexo: p.sexo,
        tutor_id: p.tutorId,
    };
}
function toServicoDto(s) {
    return {
        id: s.id,
        nome: s.nome,
        descricao: s.descricao ?? undefined,
        preco: Number(s.preco),
    };
}
function toAgendamentoDto(a) {
    const dt = a.dataHora instanceof Date
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
function toAvisoDto(a) {
    return {
        id: a.id,
        tipo: a.tipo,
        mensagem: a.mensagem,
        data_criacao: a.dataCriacao?.toISOString?.() ?? undefined,
    };
}
function parseDataHora(value) {
    const normalized = value.includes('T')
        ? value
        : value.replace(' ', 'T');
    return new Date(normalized);
}
//# sourceMappingURL=mappers.js.map