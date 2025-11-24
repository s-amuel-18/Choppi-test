import 'dotenv/config';
import { join } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';
import { databaseConfig } from './src/config/env.config';

const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: databaseConfig.host,
  port: databaseConfig.port,
  username: databaseConfig.username,
  password: databaseConfig.password,
  database: databaseConfig.database,
  entities: [join(__dirname, 'src/components/**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, 'src/migrations/*{.ts,.js}')],
  synchronize: false,
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

const appDataSource = new DataSource({
  ...dataSourceOptions,
  migrationsTableName: 'migrations',
});

export default appDataSource;
