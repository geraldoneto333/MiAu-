"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const core_1 = require("@nestjs/core");
const entities_1 = require("./entities");
const auth_module_1 = require("./auth/auth.module");
const tutores_module_1 = require("./tutores/tutores.module");
const pets_module_1 = require("./pets/pets.module");
const servicos_module_1 = require("./servicos/servicos.module");
const agendamentos_module_1 = require("./agendamentos/agendamentos.module");
const avisos_module_1 = require("./avisos/avisos.module");
const jwt_auth_guard_1 = require("./common/guards/jwt-auth.guard");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    type: 'mysql',
                    host: config.get('DB_HOST', 'localhost'),
                    port: parseInt(config.get('DB_PORT', '3306'), 10),
                    username: config.get('DB_USER', 'root'),
                    password: config.get('DB_PASSWORD', 'root'),
                    database: config.get('DB_NAME', 'miau_db'),
                    entities: [entities_1.Usuario, entities_1.Tutor, entities_1.Pet, entities_1.Servico, entities_1.Agendamento, entities_1.Aviso],
                    synchronize: false,
                }),
            }),
            auth_module_1.AuthModule,
            tutores_module_1.TutoresModule,
            pets_module_1.PetsModule,
            servicos_module_1.ServicosModule,
            agendamentos_module_1.AgendamentosModule,
            avisos_module_1.AvisosModule,
        ],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: jwt_auth_guard_1.JwtAuthGuard,
            },
            {
                provide: core_1.APP_FILTER,
                useClass: http_exception_filter_1.FastApiExceptionFilter,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map