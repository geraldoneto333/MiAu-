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
exports.Tutor = void 0;
const typeorm_1 = require("typeorm");
const pet_entity_1 = require("./pet.entity");
let Tutor = class Tutor {
};
exports.Tutor = Tutor;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Tutor.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], Tutor.prototype, "nome", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50 }),
    __metadata("design:type", String)
], Tutor.prototype, "contato", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20, nullable: true }),
    __metadata("design:type", Object)
], Tutor.prototype, "telefone", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 200, nullable: true }),
    __metadata("design:type", Object)
], Tutor.prototype, "endereco", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'mediumtext', nullable: true }),
    __metadata("design:type", Object)
], Tutor.prototype, "foto", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Tutor.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => pet_entity_1.Pet, (pet) => pet.tutor),
    __metadata("design:type", Array)
], Tutor.prototype, "pets", void 0);
exports.Tutor = Tutor = __decorate([
    (0, typeorm_1.Entity)('tutores')
], Tutor);
//# sourceMappingURL=tutor.entity.js.map