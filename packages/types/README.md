# @choppi/types

Paquete de tipos compartidos entre el backend y frontend del proyecto Choppi. Este paquete asegura la consistencia de tipos TypeScript en toda la aplicación.

## 📦 Propósito

Este paquete centraliza las definiciones de tipos, interfaces y esquemas de validación que son utilizados tanto en el backend (NestJS) como en el frontend (Next.js). Esto evita duplicación de código y garantiza que ambos lados de la aplicación usen los mismos tipos.

## 🚀 Uso

### Instalación

El paquete ya está configurado en el monorepo. Para usarlo en cualquier parte del proyecto:

```typescript
import { User, ApiResponse, PaginatedResponse } from '@choppi/types';
```

### Construir el Paquete

Antes de usar los tipos en otros proyectos del monorepo, necesitas compilar el paquete:

```bash
npm run build
```

O desde la raíz del monorepo:

```bash
npm run build:types
```

## 📚 Contenido del Paquete

### Tipos de Usuario

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Esquemas de Validación

Esquemas Zod para validación en el frontend:

- `registerSchema` - Validación de registro de usuarios
- `loginSchema` - Validación de login

### Tipos de API

- `ApiResponse<T>` - Respuesta estándar de la API
- `PaginatedResponse<T>` - Respuesta paginada
- `ErrorResponse` - Respuesta de error

### Tipos de Formularios

- `RegisterFormData` - Datos del formulario de registro
- `LoginFormData` - Datos del formulario de login
- `RegisterRequest` - Request para registro

## 🔧 Scripts Disponibles

- `npm run build` - Compila TypeScript a JavaScript
- `npm run build:watch` - Compila en modo watch (desarrollo)
- `npm run clean` - Elimina la carpeta `dist`

## 📝 Estructura

```
src/
├── index.ts           # Exportaciones principales
├── api.ts             # Tipos de API (responses, paginación, errores)
└── schemas/
    ├── index.ts       # Exportaciones de esquemas
    └── auth.ts        # Esquemas de autenticación
```

## 🔄 Flujo de Trabajo

1. **Desarrollo**: Modifica los tipos en `src/`
2. **Compilación**: Ejecuta `npm run build` para generar `dist/`
3. **Uso**: Importa los tipos en backend o frontend
4. **Monorepo**: El paquete se referencia como `@choppi/types` en los `package.json`

## ⚠️ Notas Importantes

- Siempre compila el paquete después de hacer cambios antes de usarlo en otros proyectos
- Los tipos deben mantenerse sincronizados con las entidades del backend
- Los esquemas Zod deben coincidir con las validaciones del backend (class-validator)

## 🎯 Casos de Uso

### En el Backend

```typescript
import { ApiResponse } from '@choppi/types';

// Usar en DTOs o servicios
const response: ApiResponse<User> = {
  success: true,
  data: user,
};
```

### En el Frontend

```typescript
import { registerSchema, type RegisterFormData } from '@choppi/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Usar en formularios
const form = useForm<RegisterFormData>({
  resolver: zodResolver(registerSchema),
});
```
