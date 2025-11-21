import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { env } from './config/env.config';
import { TransformInterceptor } from './interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new TransformInterceptor());
  await app.listen(env.PORT);
  console.log(`🚀 Backend running on http://localhost:${env.PORT}`);
  console.log(`📦 Environment: ${env.NODE_ENV}`);
  console.log(`🗄️  Database: ${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}`);
}
bootstrap();
