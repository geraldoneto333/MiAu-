import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { AppModule } from './app.module';
import { initSwagger } from './swagger';
import { ValidationPipe } from '@nestjs/common';

const server = express();
let appInitialized = false;

async function bootstrapServer() {
  if (appInitialized) return server;

  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  server.use(express.urlencoded({ extended: true }));
  server.use(express.json());

  app.enableCors({ origin: true, credentials: true });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  initSwagger(app);
  await app.init();
  appInitialized = true;
  return server;
}

export default async function handler(req: express.Request, res: express.Response) {
  const app = await bootstrapServer();
  app(req, res);
}
