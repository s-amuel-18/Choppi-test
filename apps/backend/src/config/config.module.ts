import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

/**
 * Módulo de configuración global que carga y valida las variables de entorno
 * Este módulo se importa globalmente para que esté disponible en toda la aplicación
 */
@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: ['.env.local', '.env'],
      // No usamos load aquí porque ya validamos con envalid en env.config.ts
    }),
  ],
  providers: [],
  exports: [],
})
export class AppConfigModule {}
