import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Aviso } from '../entities/aviso.entity';
import { AvisoCreateDto, AvisoDto, MessageResponseDto } from '../common/dto';
import { toAvisoDto } from '../common/mappers';

@Injectable()
export class AvisosService {
  constructor(
    @InjectRepository(Aviso)
    private repo: Repository<Aviso>,
  ) {}

  async findAll(): Promise<AvisoDto[]> {
    const list = await this.repo.find({
      order: { dataCriacao: 'DESC' },
    });
    return list.map(toAvisoDto);
  }

  async create(dto: AvisoCreateDto): Promise<AvisoDto> {
    const aviso = this.repo.create({
      tipo: dto.tipo,
      mensagem: dto.mensagem,
    });
    const saved = await this.repo.save(aviso);
    return toAvisoDto(saved);
  }

  async remove(id: number): Promise<MessageResponseDto> {
    await this.repo.delete(id);
    return { message: 'Aviso deletado' };
  }
}
