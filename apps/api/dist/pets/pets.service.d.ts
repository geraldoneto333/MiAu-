import { Repository } from 'typeorm';
import { Pet } from '../entities/pet.entity';
import { PetCreateDto, PetDto, MessageResponseDto } from '../common/dto';
export declare class PetsService {
    private repo;
    constructor(repo: Repository<Pet>);
    create(dto: PetCreateDto): Promise<PetDto>;
    findAll(): Promise<PetDto[]>;
    update(id: number, dto: PetCreateDto): Promise<PetDto>;
    remove(id: number): Promise<MessageResponseDto>;
}
