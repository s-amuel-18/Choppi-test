# Backend - Choppi API

API REST desarrollada con NestJS para la gestión de tiendas y productos. Este backend proporciona autenticación JWT, CRUD completo de tiendas y productos, y gestión de inventario.

## 🚀 Inicio Rápido

### Requisitos Previos

- Node.js >= 20.0.0
- npm >= 10.0.0
- Docker y Docker Compose (para PostgreSQL)

### Configuración

1. **Instalar dependencias:**

   ```bash
   npm install
   ```

2. **Configurar variables de entorno:**

   Crea un archivo `.env` en la raíz del backend con:

   ```env
   NODE_ENV=development
   PORT=3001

   # Base de datos
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=choppi_db
   DB_USER=postgres
   DB_PASSWORD=postgres
   DB_SSL=false
   DB_SYNCHRONIZE=false
   DB_LOGGING=true
   DB_MAX_CONNECTIONS=10

   # JWT
   JWT_SECRET=your-secret-key-change-in-production
   JWT_EXPIRES_IN=86400

   # CORS
   CORS_ORIGIN=http://localhost:3000
   ```

3. **Iniciar base de datos:**

   ```bash
   # Desde la raíz del monorepo
   npm run docker:up
   ```

4. **Ejecutar migraciones:**

   ```bash
   npm run migration:run
   ```

5. **Poblar datos de prueba:**

   ```bash
   npm run seed
   ```

6. **Iniciar servidor:**
   ```bash
   npm run start:dev
   ```

El servidor estará disponible en `http://localhost:3001` y la documentación Swagger en `http://localhost:3001/api`.

## 📚 Endpoints Principales

### Autenticación (`/auth`)

- `POST /auth/signup` - Registrar nuevo usuario
- `POST /auth/login` - Iniciar sesión (retorna JWT)

### Tiendas (`/stores`)

- `GET /stores` - Listar tiendas (paginado, búsqueda)
- `GET /stores/summary` - Resumen para dashboard
- `GET /stores/top` - Top tiendas con métricas
- `GET /stores/:id` - Obtener detalles de una tienda
- `POST /stores` - Crear tienda (requiere autenticación)
- `PUT /stores/:id` - Actualizar tienda (requiere autenticación)
- `DELETE /stores/:id` - Eliminar tienda (requiere autenticación)

### Productos (`/products`)

- `GET /products` - Listar productos (paginado, búsqueda)
- `GET /products/out-of-stock` - Productos sin inventario
- `GET /products/:id` - Obtener detalles de un producto
- `POST /products` - Crear producto (requiere autenticación)
- `PUT /products/:id` - Actualizar producto (requiere autenticación)
- `DELETE /products/:id` - Eliminar producto (requiere autenticación)

### Productos de Tienda (`/stores/:id/products`)

- `GET /stores/:id/products` - Listar productos de una tienda
- `POST /stores/:id/products` - Agregar producto a tienda (requiere autenticación)
- `PUT /stores/:id/products/:storeProductId` - Actualizar stock/precio (requiere autenticación)
- `DELETE /stores/:id/products/:storeProductId` - Eliminar producto de tienda (requiere autenticación)

## 🏗️ Arquitectura

### Estructura de Carpetas

```
src/
├── components/          # Módulos por funcionalidad
│   ├── auth/           # Autenticación y JWT
│   ├── user/           # Gestión de usuarios
│   ├── store/          # CRUD de tiendas
│   └── products/       # CRUD de productos y store-products
├── config/             # Configuración y variables de entorno
├── database/           # Configuración de TypeORM
├── migrations/         # Migraciones de base de datos
├── seeds/              # Datos de prueba
├── interceptors/       # Interceptores globales
└── main.ts             # Punto de entrada
```

### Tecnologías Principales

- **NestJS** - Framework Node.js
- **TypeORM** - ORM para PostgreSQL
- **Passport JWT** - Autenticación
- **Swagger** - Documentación de API
- **class-validator** - Validación de DTOs
- **bcrypt** - Hash de contraseñas

### Características

- ✅ Autenticación JWT
- ✅ Validación automática de datos
- ✅ Respuestas estandarizadas con interceptores
- ✅ Documentación Swagger interactiva
- ✅ Migraciones de base de datos
- ✅ Seeds para datos de prueba
- ✅ Tests end-to-end

## 🧪 Tests

### Configurar Base de Datos de Test

**Linux/Mac:**

```bash
./scripts/setup-test-db.sh
```

**Windows:**

```powershell
.\scripts\setup-test-db.ps1
```

### Ejecutar Tests

```bash
# Tests end-to-end
npm run test:e2e

# Tests en modo watch
npm run test:e2e:watch

# Tests con cobertura
npm run test:e2e:cov
```

Los tests cubren:

- Autenticación (signup, login)
- CRUD completo de tiendas
- CRUD completo de productos
- Gestión de productos en tiendas

## 📝 Scripts Disponibles

- `npm run start:dev` - Inicia servidor en modo desarrollo (watch)
- `npm run start:prod` - Inicia servidor en modo producción
- `npm run build` - Compila el proyecto
- `npm run migration:run` - Ejecuta migraciones pendientes
- `npm run migration:revert` - Revierte la última migración
- `npm run migration:generate` - Genera nueva migración
- `npm run seed` - Pobla la base de datos con datos de prueba
- `npm run test:e2e` - Ejecuta tests end-to-end
- `npm run lint` - Ejecuta el linter

## 🔐 Autenticación

La mayoría de los endpoints de creación, actualización y eliminación requieren autenticación JWT.

Para usar estos endpoints:

1. Obtén un token haciendo login en `/auth/login`
2. Incluye el token en el header: `Authorization: Bearer <token>`

Ejemplo con curl:

```bash
curl -X GET http://localhost:3001/stores \
  -H "Authorization: Bearer tu-token-jwt-aqui"
```

## 📖 Documentación de la API

Una vez que el servidor esté corriendo, accede a la documentación interactiva de Swagger en:

**http://localhost:3001/api**

Desde ahí puedes:

- Ver todos los endpoints disponibles
- Probar los endpoints directamente
- Ver los esquemas de request/response
- Autenticarte y probar endpoints protegidos

## 🗄️ Base de Datos

El proyecto usa PostgreSQL con TypeORM. Las migraciones están en `src/migrations/` y se ejecutan con:

```bash
npm run migration:run
```

Para crear una nueva migración:

```bash
npm run migration:generate -- -n NombreDeLaMigracion
```
