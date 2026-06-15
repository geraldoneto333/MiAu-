"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TutoresModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const tutor_entity_1 = require("../entities/tutor.entity");
const tutores_controller_1 = require("./tutores.controller");
const tutores_service_1 = require("./tutores.service");
let TutoresModule = class TutoresModule {
};
exports.TutoresModule = TutoresModule;
exports.TutoresModule = TutoresModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([tutor_entity_1.Tutor])],
        controllers: [tutores_controller_1.TutoresController],
        providers: [tutores_service_1.TutoresService],
    })
], TutoresModule);
//# sourceMappingURL=tutores.module.js.map