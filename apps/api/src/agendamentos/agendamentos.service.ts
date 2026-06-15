import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agendamento } from '../entities/agendamento.entity';
import { Pet } from '../entities/pet.entity';
import {
  AgendamentoCreateDto,
  AgendamentoDto,
  MessageResponseDto,
} from '../common/dto';
import { parseDataHora, toAgendamentoDto } from '../common/mappers';

@Injectable()
export class AgendamentosService {
  constructor(
    @InjectRepository(Agendamento)
    private repo: Repository<Agendamento>,
    @InjectRepository(Pet)
    private petsRepo: Repository<Pet>,
  ) {}

  private async validatePetTutor(dto: AgendamentoCreateDto): Promise<void> {
    const pet = await this.petsRepo.findOneBy({ id: dto.pet_id });
    if (!pet || pet.tutorId !== dto.tutor_id) {
      throw new BadRequestException('Pet não pertence ao tutor selecionado');
    }
  }

  async findAll(): Promise<AgendamentoDto[]> {
    const list = await this.repo.find();
    return list.map(toAgendamentoDto);
  }

  async create(dto: AgendamentoCreateDto): Promise<AgendamentoDto> {
    await this.validatePetTutor(dto);
    const agendamento = this.repo.create({
      tutorId: dto.tutor_id,
      petId: dto.pet_id,
      servicoId: dto.servico_id,
      dataHora: parseDataHora(dto.data_hora),
      status: dto.status ?? 'Agendado',
    });
    const saved = await this.repo.save(agendamento);
    return toAgendamentoDto(saved);
  }

  async update(id: number, dto: AgendamentoCreateDto): Promise<AgendamentoDto> {
    await this.validatePetTutor(dto);
    await this.repo.update(id, {
      tutorId: dto.tutor_id,
      petId: dto.pet_id,
      servicoId: dto.servico_id,
      dataHora: parseDataHora(dto.data_hora),
      status: dto.status ?? 'Agendado',
    });
    const updated = await this.repo.findOneByOrFail({ id });
    return toAgendamentoDto(updated);
  }

  async remove(id: number): Promise<MessageResponseDto> {
    await this.repo.delete(id);
    return { message: 'Agendamento deletado' };
  }
}
