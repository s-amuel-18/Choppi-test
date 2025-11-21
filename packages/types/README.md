# @choppi/types

Paquete de tipos compartidos entre el backend (NestJS) y el frontend (Next.js) del proyecto Choppi.

## Uso

### Instalación

El paquete está disponible como workspace en el monorepo. No necesitas instalarlo, solo referenciarlo en tus proyectos.

### En el Backend

En `apps/backend/package.json`, agrega la dependencia:

```json
{
  "dependencies": {
    "@choppi/types": "*"
  }
}
```

Luego en tu código TypeScript:

```typescript
import { User, ApiResponse } from '@choppi/types';

// Usa los tipos compartidos
const user: User = { ... };
```

### En el Frontend

En `apps/frontend/package.json`, agrega la dependencia:

```json
{
  "dependencies": {
    "@choppi/types": "*"
  }
}
```

Luego en tu código TypeScript:

```typescript
import { User, ApiResponse } from '@choppi/types';

// Usa los tipos compartidos
const user: User = { ... };
```

## Desarrollo

### Compilar los tipos

```bash
cd packages/types
npm run build
```

### Compilar en modo watch

```bash
npm run build:watch
```

### Limpiar build

```bash
npm run clean
```

## Estructura

```
packages/types/
├── src/          # Código fuente TypeScript
│   └── index.ts  # Punto de entrada principal
├── dist/         # Código compilado (generado)
├── package.json
├── tsconfig.json
└── README.md
```
