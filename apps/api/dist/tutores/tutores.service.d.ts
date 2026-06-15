import { Repository } from 'typeorm';
import { Tutor } from '../entities/tutor.entity';
import { TutorCreateDto, TutorDto, MessageResponseDto } from '../common/dto';
export declare class TutoresService {
    private repo;
    constructor(repo: Repository<Tutor>);
    create(dto: TutorCreateDto): Promise<TutorDto>;
    findAll(): Promise<TutorDto[]>;
    update(id: number, dto: TutorCreateDto): Promise<MessageResponseDto>;
    remove(id: number): Promise<MessageResponseDto>;
}
