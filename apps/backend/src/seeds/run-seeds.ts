import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(__dirname, '../../.env') });
import { DataSource } from 'typeorm';
import { databaseConfig } from '../config/env.config';
import { runSeeds } from './index';







async function bootstrap() {
  console.log('📦 Configurando conexión a la base de datos...');

  const dataSource = new DataSource({
    type: 'postgres',
    host: databaseConfig.host,
    port: databaseConfig.port,
    username: databaseConfig.username,
    password: databaseConfig.password,
    database: databaseConfig.database,
    entities: [__dirname + '/../components/**/*.entity{.ts,.js}'],
    synchronize: false,
    logging: false,
    ssl: databaseConfig.ssl
      ? {
          rejectUnauthorized: false,
        }
      : false,
  });

  try {
    console.log('🔌 Conectando a la base de datos...');
    await dataSource.initialize();
    console.log('✅ Conexión establecida.\n');

    
    await runSeeds(dataSource);

    
    await dataSource.destroy();
    console.log('\n🔌 Conexión cerrada.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
    process.exit(1);
  }
}

bootstrap();
