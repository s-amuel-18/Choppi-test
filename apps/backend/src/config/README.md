# Configuración de Variables de Entorno

Este módulo gestiona la validación y carga de variables de entorno usando `envalid` y `@nestjs/config`.

## Variables de Entorno

### Variables Requeridas

Estas variables **DEBEN** estar definidas o la aplicación fallará al iniciar:

- `DB_NAME` - Nombre de la base de datos PostgreSQL
- `DB_USER` - Usuario de la base de datos PostgreSQL
- `DB_PASSWORD` - Contraseña de la base de datos PostgreSQL

### Variables Opcionales

Estas variables tienen valores por defecto pero pueden ser sobrescritas:

- `NODE_ENV` - Entorno de ejecución (default: `development`)
  - Valores permitidos: `development`, `production`, `test`
- `PORT` - Puerto del servidor (default: `3001`)
- `DB_HOST` - Host de PostgreSQL (default: `localhost`)
- `DB_PORT` - Puerto de PostgreSQL (default: `5432`)
- `DB_SSL` - Habilitar SSL (default: `false`)
- `DB_SYNCHRONIZE` - Auto-sincronizar esquema (default: `false`)
- `DB_LOGGING` - Habilitar logging SQL (default: `false`)
- `DB_MAX_CONNECTIONS` - Conexiones máximas (default: `10`)

## Configuración

1. Copia el archivo `.env.example` a `.env`:

```bash
cp .env.example .env
```

2. Edita el archivo `.env` con tus valores:

```env
DB_NAME=choppi_db
DB_USER=postgres
DB_PASSWORD=tu_contraseña
```

3. Las variables se validan automáticamente al iniciar la aplicación

## Uso en el Código

### Importar la configuración validada

```typescript
import { env } from './config/env.config';

// Usar variables validadas
const port = env.PORT;
const dbHost = env.DB_HOST;
```

### Usar la configuración de base de datos

```typescript
import { databaseConfig, databaseUrl } from './config/env.config';

// Configuración completa
console.log(databaseConfig);

// URL de conexión
console.log(databaseUrl);
```

## Validación

Si falta una variable requerida, la aplicación mostrará un error claro:

```
Error: Missing required env var: DB_NAME
```

Esto ayuda a identificar rápidamente qué variables faltan en tu configuración.
