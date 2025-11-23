import { DataSource } from 'typeorm';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { TestDatabaseModule } from './test-database.module';
import { DatabaseModule } from '../../src/database/database.module';

/**
 * Configuración global para tests e2e
 * Crea una aplicación NestJS con configuración de test
 */
export async function createTestApp(): Promise<INestApplication> {
  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideModule(DatabaseModule)
    .useModule(TestDatabaseModule)
    .compile();

  const app = moduleFixture.createNestApplication();

  // Aplicar las mismas configuraciones globales que en main.ts
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  await app.init();
  return app;
}

/**
 * Limpia la base de datos de test
 * Elimina todas las tablas en el orden correcto para respetar las claves foráneas
 */
export async function cleanDatabase(dataSource: DataSource): Promise<void> {
  const queryRunner = dataSource.createQueryRunner();

  try {
    // Deshabilitar temporalmente las restricciones de claves foráneas
    await queryRunner.query('SET session_replication_role = replica;');

    // Obtener todas las tablas
    const tables = await queryRunner.query(`
      SELECT tablename FROM pg_tables 
      WHERE schemaname = 'public' 
      AND tablename NOT LIKE 'pg_%'
      ORDER BY tablename;
    `);

    // Eliminar datos de todas las tablas
    for (const table of tables) {
      await queryRunner.query(`DELETE FROM "${table.tablename}";`);
    }

    // Restaurar las restricciones de claves foráneas
    await queryRunner.query('SET session_replication_role = DEFAULT;');
  } finally {
    await queryRunner.release();
  }
}

/**
 * Cierra todas las conexiones de la base de datos
 */
export async function closeDatabase(dataSource: DataSource): Promise<void> {
  if (dataSource.isInitialized) {
    await dataSource.destroy();
  }
}

/**
 * Obtiene el DataSource de la aplicación
 */
export function getDataSource(app: INestApplication): DataSource {
  return app.get(DataSource);
}
