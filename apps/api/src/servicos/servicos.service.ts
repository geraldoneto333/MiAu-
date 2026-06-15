import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Servico } from '../entities/servico.entity';
import { ServicoCreateDto, ServicoDto, MessageResponseDto } from '../common/dto';
import { toServicoDto } from '../common/mappers';

@Injectable()
export class ServicosService {
  constructor(
    @InjectRepository(Servico)
    private repo: Repository<Servico>,
  ) {}

  async findAll(): Promise<ServicoDto[]> {
    const list = await this.repo.find();
    return list.map(toServicoDto);
  }

  async create(dto: ServicoCreateDto): Promise<ServicoDto> {
    const servico = this.repo.create({
      nome: dto.nome,
      descricao: dto.descricao ?? null,
      preco: dto.preco,
    });
    const saved = await this.repo.save(servico);
    return toServicoDto(saved);
  }

  async update(id: number, dto: ServicoCreateDto): Promise<ServicoDto> {
    await this.repo.update(id, {
      nome: dto.nome,
      descricao: dto.descricao ?? null,
      preco: dto.preco,
    });
    const updated = await this.repo.findOneByOrFail({ id });
    return toServicoDto(updated);
  }

  async remove(id: number): Promise<MessageResponseDto> {
    await this.repo.delete(id);
    return { message: 'Serviço deletado' };
  }
}
