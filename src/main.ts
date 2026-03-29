import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

import { validateBackendEnv } from './config/validate-env';
import { createCorsOriginHandler } from './cors.util';

async function bootstrap() {
  validateBackendEnv();

  const app = await NestFactory.create(AppModule);

  // localhost:3000, FRONTEND_URL, giftcurator-app.vercel.app, FRONTEND_URLS, optional *.vercel.app previews
  app.enableCors({
    origin: createCorsOriginHandler(),
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  // API prefix
  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT || 4000);
}
bootstrap();