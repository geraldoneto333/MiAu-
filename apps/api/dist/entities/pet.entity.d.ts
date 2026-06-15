import { Tutor } from './tutor.entity';
export declare class Pet {
    id: number;
    tutorId: number;
    nome: string;
    especie: 'Cachorro' | 'Gato';
    raca: string | null;
    sexo: 'M' | 'F';
    createdAt: Date;
    tutor: Tutor;
}
