"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvisosModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const aviso_entity_1 = require("../entities/aviso.entity");
const avisos_controller_1 = require("./avisos.controller");
const avisos_service_1 = require("./avisos.service");
let AvisosModule = class AvisosModule {
};
exports.AvisosModule = AvisosModule;
exports.AvisosModule = AvisosModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([aviso_entity_1.Aviso])],
        controllers: [avisos_controller_1.AvisosController],
        providers: [avisos_service_1.AvisosService],
    })
], AvisosModule);
//# sourceMappingURL=avisos.module.js.map