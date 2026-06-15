import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('agendamentos')
export class Agendamento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'tutor_id' })
  tutorId: number;

  @Column({ name: 'pet_id' })
  petId: number;

  @Column({ name: 'servico_id' })
  servicoId: number;

  @Column({ name: 'data_hora', type: 'datetime' })
  dataHora: Date;

  @Column({
    type: 'enum',
    enum: ['Agendado', 'Em Andamento', 'Concluido', 'Cancelado'],
    default: 'Agendado',
  })
  status: 'Agendado' | 'Em Andamento' | 'Concluido' | 'Cancelado';

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
