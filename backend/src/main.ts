import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerMiddleware } from './middleware/logger/logger.middleware';
import { winstonLogger } from './logger/winstion.logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: winstonLogger,
  });
  app.use(new LoggerMiddleware().use.bind(new LoggerMiddleware()));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
