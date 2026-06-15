import { ServicosService } from './servicos.service';
import { ServicoCreateDto, ServicoDto, MessageResponseDto } from '../common/dto';
export declare class ServicosController {
    private service;
    constructor(service: ServicosService);
    findAll(): Promise<ServicoDto[]>;
    create(dto: ServicoCreateDto): Promise<ServicoDto>;
    update(id: number, dto: ServicoCreateDto): Promise<ServicoDto>;
    remove(id: number): Promise<MessageResponseDto>;
}
