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
exports.TutoresController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const tutores_service_1 = require("./tutores.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const dto_1 = require("../common/dto");
let TutoresController = class TutoresController {
    constructor(service) {
        this.service = service;
    }
    create(dto) {
        return this.service.create(dto);
    }
    findAll() {
        return this.service.findAll();
    }
    update(id, dto) {
        return this.service.update(id, dto);
    }
    remove(id) {
        return this.service.remove(id);
    }
};
exports.TutoresController = TutoresController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Cadastrar tutor' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.TutorCreateDto]),
    __metadata("design:returntype", Promise)
], TutoresController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar tutores' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TutoresController.prototype, "findAll", null);
__decorate([
    (0, common_1.Put)(':tutor_id'),
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar tutor' }),
    __param(0, (0, common_1.Param)('tutor_id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dto_1.TutorCreateDto]),
    __metadata("design:returntype", Promise)
], TutoresController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':tutor_id'),
    (0, swagger_1.ApiOperation)({ summary: 'Excluir tutor' }),
    __param(0, (0, common_1.Param)('tutor_id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TutoresController.prototype, "remove", null);
exports.TutoresController = TutoresController = __decorate([
    (0, swagger_1.ApiTags)('Tutores'),
    (0, swagger_1.ApiBearerAuth)('BearerJWT'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('api/tutores'),
    __metadata("design:paramtypes", [tutores_service_1.TutoresService])
], TutoresController);
//# sourceMappingURL=tutores.controller.js.map