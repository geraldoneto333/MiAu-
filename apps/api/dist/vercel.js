"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const core_1 = require("@nestjs/core");
const platform_express_1 = require("@nestjs/platform-express");
const express_1 = __importDefault(require("express"));
const app_module_1 = require("./app.module");
const swagger_1 = require("./swagger");
const common_1 = require("@nestjs/common");
const server = (0, express_1.default)();
let appInitialized = false;
async function bootstrapServer() {
    if (appInitialized)
        return server;
    const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_express_1.ExpressAdapter(server));
    server.use(express_1.default.urlencoded({ extended: true }));
    server.use(express_1.default.json());
    app.enableCors({ origin: true, credentials: true });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
    }));
    (0, swagger_1.initSwagger)(app);
    await app.init();
    appInitialized = true;
    return server;
}
async function handler(req, res) {
    const app = await bootstrapServer();
    app(req, res);
}
//# sourceMappingURL=vercel.js.map