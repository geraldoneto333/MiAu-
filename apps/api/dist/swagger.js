"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSwagger = initSwagger;
exports.getOpenApiDocument = getOpenApiDocument;
const swagger_1 = require("@nestjs/swagger");
const swagger_constants_1 = require("./swagger.constants");
let cachedDocument = null;
function initSwagger(app) {
    const config = new swagger_1.DocumentBuilder()
        .setTitle('MiAu API REST')
        .setDescription(swagger_constants_1.API_DESCRIPTION)
        .setVersion('1.0.0')
        .setContact('Carlos Eduardo (Cadu)', 'https://github.com/Dev-Carlos-Alves/MiAu-', '')
        .setLicense('Projeto Acadêmico — Henning 2026.1', '')
        .addServer(swagger_constants_1.OPENAPI_SERVERS[0].url, swagger_constants_1.OPENAPI_SERVERS[0].description)
        .addServer(swagger_constants_1.OPENAPI_SERVERS[1].url, swagger_constants_1.OPENAPI_SERVERS[1].description)
        .addOAuth2({
        type: 'oauth2',
        flows: {
            password: {
                tokenUrl: '/auth/login',
                scopes: {},
            },
        },
        description: 'Autenticação JWT. No Authorize, use username `ShardCadu` e password `cadu123`. ' +
            'Deixe client_id e client_secret vazios. Rotas /api/* exigem token.',
    }, 'OAuth2PasswordBearer')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Alternativa manual: faça POST /auth/login, copie access_token e cole aqui ' +
            '(apenas o token, sem a palavra Bearer).',
    }, 'BearerJWT')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    document.openapi = '3.0.3';
    document.servers = swagger_constants_1.OPENAPI_SERVERS;
    document.externalDocs = {
        description: 'Guia completo da API (Markdown)',
        url: 'https://github.com/Dev-Carlos-Alves/MiAu-/blob/main/docs/API-Swagger.md',
    };
    cachedDocument = document;
    swagger_1.SwaggerModule.setup('api-docs', app, document);
    const httpAdapter = app.getHttpAdapter();
    httpAdapter.get('/openapi.json', (_req, res) => {
        res.json(cachedDocument ?? document);
    });
    return document;
}
function getOpenApiDocument() {
    return cachedDocument;
}
//# sourceMappingURL=swagger.js.map