import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Pet } from './pet.entity';

@Entity('tutores')
export class Tutor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nome: string;

  @Column({ length: 50 })
  contato: string;

  @Column({ length: 20, nullable: true })
  telefone: string | null;

  @Column({ length: 200, nullable: true })
  endereco: string | null;

  @Column({ type: 'mediumtext', nullable: true })
  foto: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => Pet, (pet) => pet.tutor)
  pets: Pet[];
}
