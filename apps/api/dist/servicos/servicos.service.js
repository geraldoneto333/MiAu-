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
exports.ServicosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const servico_entity_1 = require("../entities/servico.entity");
const mappers_1 = require("../common/mappers");
let ServicosService = class ServicosService {
    constructor(repo) {
        this.repo = repo;
    }
    async findAll() {
        const list = await this.repo.find();
        return list.map(mappers_1.toServicoDto);
    }
    async create(dto) {
        const servico = this.repo.create({
            nome: dto.nome,
            descricao: dto.descricao ?? null,
            preco: dto.preco,
        });
        const saved = await this.repo.save(servico);
        return (0, mappers_1.toServicoDto)(saved);
    }
    async update(id, dto) {
        await this.repo.update(id, {
            nome: dto.nome,
            descricao: dto.descricao ?? null,
            preco: dto.preco,
        });
        const updated = await this.repo.findOneByOrFail({ id });
        return (0, mappers_1.toServicoDto)(updated);
    }
    async remove(id) {
        await this.repo.delete(id);
        return { message: 'Serviço deletado' };
    }
};
exports.ServicosService = ServicosService;
exports.ServicosService = ServicosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(servico_entity_1.Servico)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ServicosService);
//# sourceMappingURL=servicos.service.js.map