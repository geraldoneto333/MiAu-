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
exports.AvisosController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const avisos_service_1 = require("./avisos.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const dto_1 = require("../common/dto");
let AvisosController = class AvisosController {
    constructor(service) {
        this.service = service;
    }
    findAll() {
        return this.service.findAll();
    }
    create(dto) {
        return this.service.create(dto);
    }
    remove(id) {
        return this.service.remove(id);
    }
};
exports.AvisosController = AvisosController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar avisos do mural' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AvisosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Publicar aviso' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.AvisoCreateDto]),
    __metadata("design:returntype", Promise)
], AvisosController.prototype, "create", null);
__decorate([
    (0, common_1.Delete)(':aviso_id'),
    (0, swagger_1.ApiOperation)({ summary: 'Excluir aviso' }),
    __param(0, (0, common_1.Param)('aviso_id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AvisosController.prototype, "remove", null);
exports.AvisosController = AvisosController = __decorate([
    (0, swagger_1.ApiTags)('Avisos'),
    (0, swagger_1.ApiBearerAuth)('BearerJWT'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('api/avisos'),
    __metadata("design:paramtypes", [avisos_service_1.AvisosService])
], AvisosController);
//# sourceMappingURL=avisos.controller.js.map