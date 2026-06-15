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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Agendamento = void 0;
const typeorm_1 = require("typeorm");
let Agendamento = class Agendamento {
};
exports.Agendamento = Agendamento;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Agendamento.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tutor_id' }),
    __metadata("design:type", Number)
], Agendamento.prototype, "tutorId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'pet_id' }),
    __metadata("design:type", Number)
], Agendamento.prototype, "petId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'servico_id' }),
    __metadata("design:type", Number)
], Agendamento.prototype, "servicoId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'data_hora', type: 'datetime' }),
    __metadata("design:type", Date)
], Agendamento.prototype, "dataHora", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ['Agendado', 'Em Andamento', 'Concluido', 'Cancelado'],
        default: 'Agendado',
    }),
    __metadata("design:type", String)
], Agendamento.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Agendamento.prototype, "createdAt", void 0);
exports.Agendamento = Agendamento = __decorate([
    (0, typeorm_1.Entity)('agendamentos')
], Agendamento);
//# sourceMappingURL=agendamento.entity.js.map