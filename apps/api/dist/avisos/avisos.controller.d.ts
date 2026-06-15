import { AvisosService } from './avisos.service';
import { AvisoCreateDto, AvisoDto, MessageResponseDto } from '../common/dto';
export declare class AvisosController {
    private service;
    constructor(service: AvisosService);
    findAll(): Promise<AvisoDto[]>;
    create(dto: AvisoCreateDto): Promise<AvisoDto>;
    remove(id: number): Promise<MessageResponseDto>;
}
