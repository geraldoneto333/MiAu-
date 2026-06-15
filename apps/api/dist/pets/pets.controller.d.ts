import { PetsService } from './pets.service';
import { PetCreateDto, PetDto, MessageResponseDto } from '../common/dto';
export declare class PetsController {
    private service;
    constructor(service: PetsService);
    create(dto: PetCreateDto): Promise<PetDto>;
    findAll(): Promise<PetDto[]>;
    update(id: number, dto: PetCreateDto): Promise<PetDto>;
    remove(id: number): Promise<MessageResponseDto>;
}
