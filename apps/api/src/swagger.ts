import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { API_DESCRIPTION, OPENAPI_SERVERS } from './swagger.constants';

let cachedDocument: Record<string, unknown> | null = null;

export function initSwagger(app: INestApplication): Record<string, unknown> {
  const config = new DocumentBuilder()
    .setTitle('MiAu API REST')
    .setDescription(API_DESCRIPTION)
    .setVersion('1.0.0')
    .setContact(
      'Carlos Eduardo (Cadu)',
      'https://github.com/Dev-Carlos-Alves/MiAu-',
      '',
    )
    .setLicense('Projeto Acadêmico — Henning 2026.1', '')
    .addServer(OPENAPI_SERVERS[0].url, OPENAPI_SERVERS[0].description)
    .addServer(OPENAPI_SERVERS[1].url, OPENAPI_SERVERS[1].description)
    .addOAuth2(
      {
        type: 'oauth2',
        flows: {
          password: {
            tokenUrl: '/auth/login',
            scopes: {},
          },
        },
        description:
          'Autenticação JWT. No Authorize, use username `ShardCadu` e password `cadu123`. ' +
          'Deixe client_id e client_secret vazios. Rotas /api/* exigem token.',
      },
      'OAuth2PasswordBearer',
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description:
          'Alternativa manual: faça POST /auth/login, copie access_token e cole aqui ' +
          '(apenas o token, sem a palavra Bearer).',
      },
      'BearerJWT',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  document.openapi = '3.0.3';
  document.servers = OPENAPI_SERVERS;
  document.externalDocs = {
    description: 'Guia completo da API (Markdown)',
    url: 'https://github.com/Dev-Carlos-Alves/MiAu-/blob/main/docs/API-Swagger.md',
  };

  cachedDocument = document as unknown as Record<string, unknown>;

  SwaggerModule.setup('api-docs', app, document);

  const httpAdapter = app.getHttpAdapter();
  httpAdapter.get('/openapi.json', (_req: unknown, res: { json: (d: unknown) => void }) => {
    res.json(cachedDocument ?? document);
  });

  return document as unknown as Record<string, unknown>;
}

export function getOpenApiDocument(): Record<string, unknown> | null {
  return cachedDocument;
}
