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
exports.AvisoDto = exports.AvisoCreateDto = exports.AgendamentoDto = exports.AgendamentoCreateDto = exports.ServicoDto = exports.ServicoCreateDto = exports.PetDto = exports.PetCreateDto = exports.TutorDto = exports.TutorCreateDto = exports.MessageResponseDto = exports.ProfileUpdateDto = exports.ProfileResponseDto = exports.TokenDto = exports.UserCreateDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class UserCreateDto {
}
exports.UserCreateDto = UserCreateDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'ShardCadu' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    __metadata("design:type", String)
], UserCreateDto.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'cadu.sport@miau.com' }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], UserCreateDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'cadu123' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    __metadata("design:type", String)
], UserCreateDto.prototype, "password", void 0);
class TokenDto {
    constructor() {
        this.token_type = 'bearer';
    }
}
exports.TokenDto = TokenDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TokenDto.prototype, "access_token", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: 'bearer' }),
    __metadata("design:type", String)
], TokenDto.prototype, "token_type", void 0);
class ProfileResponseDto {
}
exports.ProfileResponseDto = ProfileResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProfileResponseDto.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProfileResponseDto.prototype, "email", void 0);
class ProfileUpdateDto {
}
exports.ProfileUpdateDto = ProfileUpdateDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProfileUpdateDto.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], ProfileUpdateDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProfileUpdateDto.prototype, "password", void 0);
class MessageResponseDto {
}
exports.MessageResponseDto = MessageResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], MessageResponseDto.prototype, "message", void 0);
class TutorCreateDto {
}
exports.TutorCreateDto = TutorCreateDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TutorCreateDto.prototype, "nome", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TutorCreateDto.prototype, "contato", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TutorCreateDto.prototype, "endereco", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TutorCreateDto.prototype, "telefone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TutorCreateDto.prototype, "foto", void 0);
class TutorDto extends TutorCreateDto {
}
exports.TutorDto = TutorDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], TutorDto.prototype, "id", void 0);
class PetCreateDto {
}
exports.PetCreateDto = PetCreateDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PetCreateDto.prototype, "nome", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['Cachorro', 'Gato'] }),
    (0, class_validator_1.IsEnum)(['Cachorro', 'Gato']),
    __metadata("design:type", String)
], PetCreateDto.prototype, "especie", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PetCreateDto.prototype, "raca", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['M', 'F'] }),
    (0, class_validator_1.IsEnum)(['M', 'F']),
    __metadata("design:type", String)
], PetCreateDto.prototype, "sexo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], PetCreateDto.prototype, "tutor_id", void 0);
class PetDto extends PetCreateDto {
}
exports.PetDto = PetDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PetDto.prototype, "id", void 0);
class ServicoCreateDto {
}
exports.ServicoCreateDto = ServicoCreateDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ServicoCreateDto.prototype, "nome", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ServicoCreateDto.prototype, "descricao", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], ServicoCreateDto.prototype, "preco", void 0);
class ServicoDto extends ServicoCreateDto {
}
exports.ServicoDto = ServicoDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ServicoDto.prototype, "id", void 0);
class AgendamentoCreateDto {
}
exports.AgendamentoCreateDto = AgendamentoCreateDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], AgendamentoCreateDto.prototype, "tutor_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], AgendamentoCreateDto.prototype, "pet_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], AgendamentoCreateDto.prototype, "servico_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AgendamentoCreateDto.prototype, "data_hora", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: 'Agendado' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['Agendado', 'Em Andamento', 'Concluido', 'Cancelado']),
    __metadata("design:type", String)
], AgendamentoCreateDto.prototype, "status", void 0);
class AgendamentoDto extends AgendamentoCreateDto {
}
exports.AgendamentoDto = AgendamentoDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AgendamentoDto.prototype, "id", void 0);
class AvisoCreateDto {
}
exports.AvisoCreateDto = AvisoCreateDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['Urgente', 'Aviso', 'Lembrete'] }),
    (0, class_validator_1.IsEnum)(['Urgente', 'Aviso', 'Lembrete']),
    __metadata("design:type", String)
], AvisoCreateDto.prototype, "tipo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AvisoCreateDto.prototype, "mensagem", void 0);
class AvisoDto extends AvisoCreateDto {
}
exports.AvisoDto = AvisoDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AvisoDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], AvisoDto.prototype, "data_criacao", void 0);
//# sourceMappingURL=index.js.map