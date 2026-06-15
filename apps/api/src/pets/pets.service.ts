import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pet } from '../entities/pet.entity';
import { PetCreateDto, PetDto, MessageResponseDto } from '../common/dto';
import { toPetDto } from '../common/mappers';

@Injectable()
export class PetsService {
  constructor(
    @InjectRepository(Pet)
    private repo: Repository<Pet>,
  ) {}

  async create(dto: PetCreateDto): Promise<PetDto> {
    const pet = this.repo.create({
      nome: dto.nome,
      especie: dto.especie,
      raca: dto.raca ?? null,
      sexo: dto.sexo,
      tutorId: dto.tutor_id,
    });
    const saved = await this.repo.save(pet);
    return toPetDto(saved);
  }

  async findAll(): Promise<PetDto[]> {
    const list = await this.repo.find();
    return list.map(toPetDto);
  }

  async update(id: number, dto: PetCreateDto): Promise<PetDto> {
    await this.repo.update(id, {
      nome: dto.nome,
      especie: dto.especie,
      raca: dto.raca ?? null,
      sexo: dto.sexo,
      tutorId: dto.tutor_id,
    });
    const updated = await this.repo.findOneByOrFail({ id });
    return toPetDto(updated);
  }

  async remove(id: number): Promise<MessageResponseDto> {
    await this.repo.delete(id);
    return { message: 'Pet deletado' };
  }
}
