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
exports.AgendamentosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const agendamento_entity_1 = require("../entities/agendamento.entity");
const pet_entity_1 = require("../entities/pet.entity");
const mappers_1 = require("../common/mappers");
let AgendamentosService = class AgendamentosService {
    constructor(repo, petsRepo) {
        this.repo = repo;
        this.petsRepo = petsRepo;
    }
    async validatePetTutor(dto) {
        const pet = await this.petsRepo.findOneBy({ id: dto.pet_id });
        if (!pet || pet.tutorId !== dto.tutor_id) {
            throw new common_1.BadRequestException('Pet não pertence ao tutor selecionado');
        }
    }
    async findAll() {
        const list = await this.repo.find();
        return list.map(mappers_1.toAgendamentoDto);
    }
    async create(dto) {
        await this.validatePetTutor(dto);
        const agendamento = this.repo.create({
            tutorId: dto.tutor_id,
            petId: dto.pet_id,
            servicoId: dto.servico_id,
            dataHora: (0, mappers_1.parseDataHora)(dto.data_hora),
            status: dto.status ?? 'Agendado',
        });
        const saved = await this.repo.save(agendamento);
        return (0, mappers_1.toAgendamentoDto)(saved);
    }
    async update(id, dto) {
        await this.validatePetTutor(dto);
        await this.repo.update(id, {
            tutorId: dto.tutor_id,
            petId: dto.pet_id,
            servicoId: dto.servico_id,
            dataHora: (0, mappers_1.parseDataHora)(dto.data_hora),
            status: dto.status ?? 'Agendado',
        });
        const updated = await this.repo.findOneByOrFail({ id });
        return (0, mappers_1.toAgendamentoDto)(updated);
    }
    async remove(id) {
        await this.repo.delete(id);
        return { message: 'Agendamento deletado' };
    }
};
exports.AgendamentosService = AgendamentosService;
exports.AgendamentosService = AgendamentosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(agendamento_entity_1.Agendamento)),
    __param(1, (0, typeorm_1.InjectRepository)(pet_entity_1.Pet)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], AgendamentosService);
//# sourceMappingURL=agendamentos.service.js.map