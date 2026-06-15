import { Repository } from 'typeorm';
import { Servico } from '../entities/servico.entity';
import { ServicoCreateDto, ServicoDto, MessageResponseDto } from '../common/dto';
export declare class ServicosService {
    private repo;
    constructor(repo: Repository<Servico>);
    findAll(): Promise<ServicoDto[]>;
    create(dto: ServicoCreateDto): Promise<ServicoDto>;
    update(id: number, dto: ServicoCreateDto): Promise<ServicoDto>;
    remove(id: number): Promise<MessageResponseDto>;
}
