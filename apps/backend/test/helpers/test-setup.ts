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
 * Elimina todas las tablas y las recrea
 */
export async function cleanDatabase(dataSource: DataSource): Promise<void> {
  const entities = dataSource.entityMetadatas;

  for (const entity of entities) {
    const repository = dataSource.getRepository(entity.name);
    await repository.clear();
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
