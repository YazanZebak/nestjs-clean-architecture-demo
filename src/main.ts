import * as express from 'express';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { AllExceptionFilter } from './infrastructure/common/filters/exception.filter';
import { LoggerService } from './infrastructure/services/logger/logger.service';
import * as dotenv from 'dotenv';
import { RemovePasswordInterceptor } from './infrastructure/common/interceptors/remove-password.interceptor';
import { SeedService } from './infrastructure/common/seed/seed.service';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule, { cors: true });

  app.setGlobalPrefix('api');

  // Filter
  app.useGlobalFilters(new AllExceptionFilter(new LoggerService()));

  // Pipes
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // interceptors
  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));
  app.useGlobalInterceptors(new RemovePasswordInterceptor());

  // Media
  app.enableCors();
  app.use('/public', express.static(join(__dirname, '..', 'public')));

  // Seed
  // comment and uncomment as needed
  // const seedService = app.get(SeedService);
  // await seedService.seed();

  const config = new DocumentBuilder()
    .setTitle('My Coach')
    .setVersion('1.0')
    .addBearerAuth()
    .setDescription('My Coach APIs')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/swagger', app, document);

  await app.listen(9000);
}
bootstrap();
