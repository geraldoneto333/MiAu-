import { TutoresService } from './tutores.service';
import { TutorCreateDto, TutorDto, MessageResponseDto } from '../common/dto';
export declare class TutoresController {
    private service;
    constructor(service: TutoresService);
    create(dto: TutorCreateDto): Promise<TutorDto>;
    findAll(): Promise<TutorDto[]>;
    update(id: number, dto: TutorCreateDto): Promise<MessageResponseDto>;
    remove(id: number): Promise<MessageResponseDto>;
}
