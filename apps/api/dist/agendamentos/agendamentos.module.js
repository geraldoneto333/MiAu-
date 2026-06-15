"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgendamentosModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const agendamento_entity_1 = require("../entities/agendamento.entity");
const pet_entity_1 = require("../entities/pet.entity");
const agendamentos_controller_1 = require("./agendamentos.controller");
const agendamentos_service_1 = require("./agendamentos.service");
let AgendamentosModule = class AgendamentosModule {
};
exports.AgendamentosModule = AgendamentosModule;
exports.AgendamentosModule = AgendamentosModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([agendamento_entity_1.Agendamento, pet_entity_1.Pet])],
        controllers: [agendamentos_controller_1.AgendamentosController],
        providers: [agendamentos_service_1.AgendamentosService],
    })
], AgendamentosModule);
//# sourceMappingURL=agendamentos.module.js.map