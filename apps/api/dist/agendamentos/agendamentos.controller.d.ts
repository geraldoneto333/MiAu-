import { AgendamentosService } from './agendamentos.service';
import { AgendamentoCreateDto, AgendamentoDto, MessageResponseDto } from '../common/dto';
export declare class AgendamentosController {
    private service;
    constructor(service: AgendamentosService);
    findAll(): Promise<AgendamentoDto[]>;
    create(dto: AgendamentoCreateDto): Promise<AgendamentoDto>;
    update(id: number, dto: AgendamentoCreateDto): Promise<AgendamentoDto>;
    remove(id: number): Promise<MessageResponseDto>;
}
