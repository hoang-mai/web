import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { LoggerMiddleware } from './middleware/logger/logger.middleware';
import { winstonLogger } from './logger/winstion.logger';
import { HttpExceptionFilter } from './exceptions/http-exception.filter';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: winstonLogger,
  });
  app.use(new LoggerMiddleware().use.bind(new LoggerMiddleware()));

  app.useGlobalFilters(new HttpExceptionFilter());


  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
