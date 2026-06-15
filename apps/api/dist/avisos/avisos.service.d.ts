import { Repository } from 'typeorm';
import { Aviso } from '../entities/aviso.entity';
import { AvisoCreateDto, AvisoDto, MessageResponseDto } from '../common/dto';
export declare class AvisosService {
    private repo;
    constructor(repo: Repository<Aviso>);
    findAll(): Promise<AvisoDto[]>;
    create(dto: AvisoCreateDto): Promise<AvisoDto>;
    remove(id: number): Promise<MessageResponseDto>;
}
