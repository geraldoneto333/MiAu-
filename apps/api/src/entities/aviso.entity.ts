import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('avisos')
export class Aviso {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: ['Urgente', 'Aviso', 'Lembrete'] })
  tipo: 'Urgente' | 'Aviso' | 'Lembrete';

  @Column({ type: 'text' })
  mensagem: string;

  @CreateDateColumn({ name: 'data_criacao' })
  dataCriacao: Date;
}
