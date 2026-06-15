import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { initSwagger } from './swagger';
import * as express from 'express';

export async function createNestApp() {
  const app = await NestFactory.create(AppModule);

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  initSwagger(app);

  return app;
}

async function bootstrap() {
  const app = await createNestApp();
  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`MiAu API (NestJS) rodando em http://127.0.0.1:${port}`);
  console.log(`OpenAPI: http://127.0.0.1:${port}/openapi.json`);
  console.log(`Swagger debug: http://127.0.0.1:${port}/api-docs`);
}

bootstrap();
