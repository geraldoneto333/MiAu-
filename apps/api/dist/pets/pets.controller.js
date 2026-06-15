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
exports.PetsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const pets_service_1 = require("./pets.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const dto_1 = require("../common/dto");
let PetsController = class PetsController {
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
exports.PetsController = PetsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Cadastrar pet' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.PetCreateDto]),
    __metadata("design:returntype", Promise)
], PetsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar pets' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PetsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Put)(':pet_id'),
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar pet' }),
    __param(0, (0, common_1.Param)('pet_id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dto_1.PetCreateDto]),
    __metadata("design:returntype", Promise)
], PetsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':pet_id'),
    (0, swagger_1.ApiOperation)({ summary: 'Excluir pet' }),
    __param(0, (0, common_1.Param)('pet_id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PetsController.prototype, "remove", null);
exports.PetsController = PetsController = __decorate([
    (0, swagger_1.ApiTags)('Pets'),
    (0, swagger_1.ApiBearerAuth)('BearerJWT'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('api/pets'),
    __metadata("design:paramtypes", [pets_service_1.PetsService])
], PetsController);
//# sourceMappingURL=pets.controller.js.map