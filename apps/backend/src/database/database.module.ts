import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from '../config/env.config';
import { DataSourceOptions } from 'typeorm';

const typeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  host: databaseConfig.host,
  port: databaseConfig.port,
  username: databaseConfig.username,
  password: databaseConfig.password,
  database: databaseConfig.database,
  entities: [__dirname + '/../components/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  synchronize: databaseConfig.synchronize,
  logging: databaseConfig.logging,
  ssl: databaseConfig.ssl
    ? {
        rejectUnauthorized: false,
      }
    : false,
  extra: {
    max: databaseConfig.maxConnections,
  },
};

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...typeOrmConfig,
      autoLoadEntities: true,
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
