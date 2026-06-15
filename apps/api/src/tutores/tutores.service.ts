import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tutor } from '../entities/tutor.entity';
import { TutorCreateDto, TutorDto, MessageResponseDto } from '../common/dto';
import { toTutorDto } from '../common/mappers';

@Injectable()
export class TutoresService {
  constructor(
    @InjectRepository(Tutor)
    private repo: Repository<Tutor>,
  ) {}

  async create(dto: TutorCreateDto): Promise<TutorDto> {
    const tutor = this.repo.create({
      nome: dto.nome,
      contato: dto.contato,
      endereco: dto.endereco ?? null,
      telefone: dto.telefone ?? null,
      foto: dto.foto ?? null,
    });
    const saved = await this.repo.save(tutor);
    return toTutorDto(saved);
  }

  async findAll(): Promise<TutorDto[]> {
    const list = await this.repo.find();
    return list.map(toTutorDto);
  }

  async update(id: number, dto: TutorCreateDto): Promise<MessageResponseDto> {
    await this.repo.update(id, {
      nome: dto.nome,
      contato: dto.contato,
      endereco: dto.endereco ?? null,
      telefone: dto.telefone ?? null,
      foto: dto.foto ?? null,
    });
    return { message: 'Tutor atualizado com sucesso' };
  }

  async remove(id: number): Promise<MessageResponseDto> {
    await this.repo.delete(id);
    return { message: 'Tutor deletado com sucesso' };
  }
}
