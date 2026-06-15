export declare class UserCreateDto {
    username: string;
    email: string;
    password: string;
}
export declare class TokenDto {
    access_token: string;
    token_type: string;
}
export declare class ProfileResponseDto {
    username: string;
    email: string;
}
export declare class ProfileUpdateDto {
    username?: string;
    email?: string;
    password?: string;
}
export declare class MessageResponseDto {
    message: string;
}
export declare class TutorCreateDto {
    nome: string;
    contato: string;
    endereco?: string;
    telefone?: string;
    foto?: string;
}
export declare class TutorDto extends TutorCreateDto {
    id: number;
}
export declare class PetCreateDto {
    nome: string;
    especie: 'Cachorro' | 'Gato';
    raca?: string;
    sexo: 'M' | 'F';
    tutor_id: number;
}
export declare class PetDto extends PetCreateDto {
    id: number;
}
export declare class ServicoCreateDto {
    nome: string;
    descricao?: string;
    preco: number;
}
export declare class ServicoDto extends ServicoCreateDto {
    id: number;
}
export declare class AgendamentoCreateDto {
    tutor_id: number;
    pet_id: number;
    servico_id: number;
    data_hora: string;
    status?: 'Agendado' | 'Em Andamento' | 'Concluido' | 'Cancelado';
}
export declare class AgendamentoDto extends AgendamentoCreateDto {
    id: number;
}
export declare class AvisoCreateDto {
    tipo: 'Urgente' | 'Aviso' | 'Lembrete';
    mensagem: string;
}
export declare class AvisoDto extends AvisoCreateDto {
    id: number;
    data_criacao?: string;
}
