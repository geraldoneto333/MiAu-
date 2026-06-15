"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PetsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const pet_entity_1 = require("../entities/pet.entity");
const mappers_1 = require("../common/mappers");
let PetsService = class PetsService {
    constructor(repo) {
        this.repo = repo;
    }
    async create(dto) {
        const pet = this.repo.create({
            nome: dto.nome,
            especie: dto.especie,
            raca: dto.raca ?? null,
            sexo: dto.sexo,
            tutorId: dto.tutor_id,
        });
        const saved = await this.repo.save(pet);
        return (0, mappers_1.toPetDto)(saved);
    }
    async findAll() {
        const list = await this.repo.find();
        return list.map(mappers_1.toPetDto);
    }
    async update(id, dto) {
        await this.repo.update(id, {
            nome: dto.nome,
            especie: dto.especie,
            raca: dto.raca ?? null,
            sexo: dto.sexo,
            tutorId: dto.tutor_id,
        });
        const updated = await this.repo.findOneByOrFail({ id });
        return (0, mappers_1.toPetDto)(updated);
    }
    async remove(id) {
        await this.repo.delete(id);
        return { message: 'Pet deletado' };
    }
};
exports.PetsService = PetsService;
exports.PetsService = PetsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(pet_entity_1.Pet)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PetsService);
//# sourceMappingURL=pets.service.js.map