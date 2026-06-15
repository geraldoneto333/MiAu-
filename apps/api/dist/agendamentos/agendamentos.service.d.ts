import { Repository } from 'typeorm';
import { Agendamento } from '../entities/agendamento.entity';
import { Pet } from '../entities/pet.entity';
import { AgendamentoCreateDto, AgendamentoDto, MessageResponseDto } from '../common/dto';
export declare class AgendamentosService {
    private repo;
    private petsRepo;
    constructor(repo: Repository<Agendamento>, petsRepo: Repository<Pet>);
    private validatePetTutor;
    findAll(): Promise<AgendamentoDto[]>;
    create(dto: AgendamentoCreateDto): Promise<AgendamentoDto>;
    update(id: number, dto: AgendamentoCreateDto): Promise<AgendamentoDto>;
    remove(id: number): Promise<MessageResponseDto>;
}
