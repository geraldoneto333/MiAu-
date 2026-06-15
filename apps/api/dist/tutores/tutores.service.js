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
exports.TutoresService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const tutor_entity_1 = require("../entities/tutor.entity");
const mappers_1 = require("../common/mappers");
let TutoresService = class TutoresService {
    constructor(repo) {
        this.repo = repo;
    }
    async create(dto) {
        const tutor = this.repo.create({
            nome: dto.nome,
            contato: dto.contato,
            endereco: dto.endereco ?? null,
            telefone: dto.telefone ?? null,
            foto: dto.foto ?? null,
        });
        const saved = await this.repo.save(tutor);
        return (0, mappers_1.toTutorDto)(saved);
    }
    async findAll() {
        const list = await this.repo.find();
        return list.map(mappers_1.toTutorDto);
    }
    async update(id, dto) {
        await this.repo.update(id, {
            nome: dto.nome,
            contato: dto.contato,
            endereco: dto.endereco ?? null,
            telefone: dto.telefone ?? null,
            foto: dto.foto ?? null,
        });
        return { message: 'Tutor atualizado com sucesso' };
    }
    async remove(id) {
        await this.repo.delete(id);
        return { message: 'Tutor deletado com sucesso' };
    }
};
exports.TutoresService = TutoresService;
exports.TutoresService = TutoresService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(tutor_entity_1.Tutor)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TutoresService);
//# sourceMappingURL=tutores.service.js.map