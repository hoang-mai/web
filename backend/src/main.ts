// File: backend/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { LoggerMiddleware } from './middleware/logger/logger.middleware';
import { winstonLogger } from './logger/winston.logger';
import { HttpExceptionFilter } from './exceptions/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
async function bootstrap() {
  // Create the app with the logger
  const app = await NestFactory.create(AppModule, {
    logger: winstonLogger,
  });
  app.use(new LoggerMiddleware().use.bind(new LoggerMiddleware()));

  // Add the global filter
  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Thế giới di động API')
    .setDescription('Tài liệu API cho ứng dụng NestJS')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.enableCors();
  app.useWebSocketAdapter(new IoAdapter(app));
  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
