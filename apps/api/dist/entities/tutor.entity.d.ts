import { Pet } from './pet.entity';
export declare class Tutor {
    id: number;
    nome: string;
    contato: string;
    telefone: string | null;
    endereco: string | null;
    foto: string | null;
    createdAt: Date;
    pets: Pet[];
}
