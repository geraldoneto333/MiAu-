export declare class Agendamento {
    id: number;
    tutorId: number;
    petId: number;
    servicoId: number;
    dataHora: Date;
    status: 'Agendado' | 'Em Andamento' | 'Concluido' | 'Cancelado';
    createdAt: Date;
}
