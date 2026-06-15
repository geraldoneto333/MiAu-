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
exports.JwtAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const public_decorator_1 = require("../decorators/public.decorator");
const usuario_entity_1 = require("../../entities/usuario.entity");
let JwtAuthGuard = class JwtAuthGuard {
    constructor(reflector, jwtService, usuariosRepo) {
        this.reflector = reflector;
        this.jwtService = jwtService;
        this.usuariosRepo = usuariosRepo;
    }
    async canActivate(context) {
        const isPublic = this.reflector.getAllAndOverride(public_decorator_1.IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic)
            return true;
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            throw new common_1.UnauthorizedException('Não foi possível validar as credenciais do token JWT');
        }
        const token = authHeader.slice(7);
        try {
            const payload = this.jwtService.verify(token);
            const user = await this.usuariosRepo.findOne({
                where: { username: payload.sub },
                select: ['id', 'username', 'email'],
            });
            if (!user) {
                throw new common_1.UnauthorizedException('Não foi possível validar as credenciais do token JWT');
            }
            request.user = user;
            return true;
        }
        catch {
            throw new common_1.UnauthorizedException('Não foi possível validar as credenciais do token JWT');
        }
    }
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, typeorm_1.InjectRepository)(usuario_entity_1.Usuario)),
    __metadata("design:paramtypes", [core_1.Reflector,
        jwt_1.JwtService,
        typeorm_2.Repository])
], JwtAuthGuard);
//# sourceMappingURL=jwt-auth.guard.js.map