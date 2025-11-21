# Módulo de Base de Datos

Este módulo configura TypeORM para conectarse a PostgreSQL usando las variables de entorno validadas.

## Configuración

La configuración de TypeORM se basa en las variables de entorno definidas en `src/config/env.config.ts`:

- `DB_HOST` - Host de PostgreSQL
- `DB_PORT` - Puerto de PostgreSQL
- `DB_NAME` - Nombre de la base de datos
- `DB_USER` - Usuario de PostgreSQL
- `DB_PASSWORD` - Contraseña de PostgreSQL
- `DB_SSL` - Habilitar SSL
- `DB_SYNCHRONIZE` - Auto-sincronizar esquema (solo desarrollo)
- `DB_LOGGING` - Habilitar logging SQL
- `DB_MAX_CONNECTIONS` - Conexiones máximas

## Uso

### Crear una Entidad

```typescript
// src/entities/user.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  name: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
```

### Usar un Repositorio

```typescript
// src/modules/users/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
```

```typescript
// src/modules/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async create(userData: Partial<User>): Promise<User> {
    const user = this.usersRepository.create(userData);
    return this.usersRepository.save(user);
  }
}
```

## Migraciones

Las migraciones se encuentran en `src/migrations/`. Para crear una migración:

```bash
npm run typeorm migration:create -- -n MigrationName
```

Para ejecutar migraciones:

```bash
npm run typeorm migration:run
```

Para revertir migraciones:

```bash
npm run typeorm migration:revert
```
