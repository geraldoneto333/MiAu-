import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Tutor } from './tutor.entity';

@Entity('pets')
export class Pet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'tutor_id' })
  tutorId: number;

  @Column({ length: 50 })
  nome: string;

  @Column({ type: 'enum', enum: ['Cachorro', 'Gato'] })
  especie: 'Cachorro' | 'Gato';

  @Column({ length: 50, nullable: true })
  raca: string | null;

  @Column({ type: 'enum', enum: ['M', 'F'] })
  sexo: 'M' | 'F';

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Tutor, (tutor) => tutor.pets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tutor_id' })
  tutor: Tutor;
}
