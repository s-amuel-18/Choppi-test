import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { env } from './config/env.config';

/**
 * Carga y valida las variables de entorno antes de iniciar la aplicación
 * Esto asegura que todas las variables requeridas estén presentes
 */
async function bootstrap() {
  // Las variables de entorno se validan al importar env.config
  // Si alguna variable requerida falta, la aplicación fallará con un error claro

  const app = await NestFactory.create(AppModule);

  await app.listen(env.PORT);
  console.log(`🚀 Backend running on http://localhost:${env.PORT}`);
  console.log(`📦 Environment: ${env.NODE_ENV}`);
  console.log(`🗄️  Database: ${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}`);
}
bootstrap();
