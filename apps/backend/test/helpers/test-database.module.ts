import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
import { env } from '../../src/config/env.config';

/**
 * Configuración de TypeORM específica para tests
 * Usa una base de datos separada y permite sincronización automática
 */
const testTypeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  entities: [__dirname + '/../../src/components/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../../src/migrations/*{.ts,.js}'],
  synchronize: true, // Siempre true en tests para facilitar el setup
  logging: false, // Desactivado en tests para mejor rendimiento
  dropSchema: false, // Se controla manualmente en los tests
  ssl: false,
};

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...testTypeOrmConfig,
      autoLoadEntities: true,
    }),
  ],
  exports: [TypeOrmModule],
})
export class TestDatabaseModule {}
