# Migraciones

Este directorio contiene las migraciones de TypeORM para gestionar los cambios en el esquema de la base de datos.

## Configuración

Las migraciones están configuradas en `src/database/database.module.ts` para cargarse automáticamente desde `src/migrations/*.ts`.

## Crear una Migración

### Opción 1: Crear manualmente

```typescript
// src/migrations/1234567890-CreateUsersTable.ts
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUsersTable1234567890 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'email',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
```

### Opción 2: Generar automáticamente (recomendado)

Para generar migraciones automáticamente basándose en los cambios en tus entidades, necesitas configurar TypeORM CLI.

1. Instala TypeORM CLI globalmente o como dev dependency:

```bash
npm install -D typeorm ts-node
```

2. Crea un archivo `ormconfig.ts` o `data-source.ts` en la raíz de `apps/backend`:

```typescript
// apps/backend/data-source.ts
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(__dirname, '.env') });

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'choppi_db',
  entities: [__dirname + '/src/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/src/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: true,
});
```

3. Agrega scripts al `package.json`:

```json
{
  "scripts": {
    "typeorm": "typeorm-ts-node-commonjs",
    "migration:generate": "npm run typeorm -- migration:generate -d data-source.ts",
    "migration:create": "npm run typeorm -- migration:create",
    "migration:run": "npm run typeorm -- migration:run -d data-source.ts",
    "migration:revert": "npm run typeorm -- migration:revert -d data-source.ts"
  }
}
```

4. Genera una migración:

```bash
npm run migration:generate -- src/migrations/CreateUsersTable
```

## Ejecutar Migraciones

### En desarrollo

Si tienes `synchronize: true` en desarrollo, las migraciones pueden no ser necesarias. Pero es mejor práctica usarlas siempre.

### En producción

Ejecuta las migraciones antes de iniciar la aplicación:

```bash
npm run migration:run
```

## Revertir Migraciones

```bash
npm run migration:revert
```

## Mejores Prácticas

1. **No uses `synchronize: true` en producción** - Siempre usa migraciones
2. **Revisa las migraciones generadas** - TypeORM puede no generar siempre lo que esperas
3. **Prueba las migraciones** - Tanto `up` como `down` antes de hacer deploy
4. **Nombres descriptivos** - Usa nombres claros que describan el cambio
5. **Migraciones atómicas** - Cada migración debe ser independiente y reversible
