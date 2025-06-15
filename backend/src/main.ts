import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  });
  
  app.useGlobalPipes(new ValidationPipe());
  
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });
  
  const port = configService.get('PORT') || 3000;
  const host = configService.get('HOST') || '0.0.0.0';
  
  await app.listen(port, host);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
