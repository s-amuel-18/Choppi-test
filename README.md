# Choppi - Prueba Técnica

Este es un proyecto monorepo desarrollado como prueba técnica que incluye un backend en NestJS y un frontend en Next.js para la gestión de tiendas y productos.

## 📋 Requisitos

Para ejecutar este proyecto necesitas tener instalado:

- **Node.js** >= 20.0.0
- **npm** >= 10.0.0
- **Docker** y **Docker Compose** (para la base de datos PostgreSQL)

## 🚀 Configuración e Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/s-amuel-18/Choppi-test.git
cd choppi-test
```

### 2. Instalar dependencias

Desde la raíz del proyecto, ejecuta:

```bash
npm run install:all
```

Este comando instalará las dependencias del monorepo, backend y frontend.

### 3. Configurar variables de entorno

#### Backend

Crea un archivo `.env` en la carpeta `apps/backend/` con el siguiente contenido:

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

#### Frontend

Crea un archivo `.env.local` en la carpeta `apps/frontend/` con:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXTAUTH_SECRET=tu-secret-aleatorio-aqui
NEXTAUTH_URL=http://localhost:3000
```

### 4. Iniciar la base de datos

Levanta el contenedor de PostgreSQL con Docker Compose:

```bash
npm run docker:up
```

Esto iniciará PostgreSQL en el puerto `5432` con las credenciales configuradas.

### 5. Ejecutar migraciones

Desde la carpeta `apps/backend/`, ejecuta las migraciones para crear las tablas:

```bash
cd apps/backend
npm run migration:run
```

### 6. Poblar la base de datos con datos de prueba

Ejecuta los seeds para tener datos iniciales:

```bash
npm run seed
```

Esto creará usuarios, tiendas y productos de ejemplo para poder probar la aplicación.

### 7. Iniciar el proyecto

Desde la raíz del proyecto, ejecuta:

```bash
npm run dev
```

Esto iniciará tanto el backend (puerto 3001) como el frontend (puerto 3000) en modo desarrollo.

**URLs importantes:**

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Documentación Swagger: http://localhost:3001/api

## 🔑 Credenciales Demo

Después de ejecutar los seeds, puedes usar las siguientes credenciales para iniciar sesión:

**Usuario Demo:**

- **Email:** `test@test.com`
- **Contraseña:** `1234Pepe**`

Estas credenciales se crean automáticamente al ejecutar `npm run seed` en el backend.

## 🏗️ Arquitectura del Proyecto

### Estructura del Monorepo

```
choppi-test/
├── apps/
│   ├── backend/          # API REST con NestJS
│   └── frontend/         # Aplicación web con Next.js
├── packages/
│   └── types/            # Tipos compartidos entre frontend y backend
└── docker/               # Configuración de Docker
```

### Backend (NestJS)

El backend está organizado en módulos por funcionalidad:

- **Auth**: Autenticación y autorización con JWT
- **User**: Gestión de usuarios
- **Store**: CRUD de tiendas
- **Products**: Gestión de productos y relación con tiendas (store-products)

**Características principales:**

- TypeORM para el manejo de base de datos
- Migraciones para el esquema de base de datos
- Validación de datos con class-validator
- Swagger para documentación de la API
- Interceptores para transformar respuestas
- Seeds para datos de prueba

### Frontend (Next.js)

El frontend utiliza:

- **Next.js 16** con App Router
- **NextAuth** para autenticación
- **React Hook Form** con **Zod** para validación de formularios
- **Tailwind CSS** y **DaisyUI** para estilos
- **Axios** para peticiones HTTP

**Estructura:**

- Rutas públicas: login y registro
- Rutas protegidas: dashboard, productos y tiendas
- Hooks personalizados para manejo de estado
- Servicios para comunicación con la API

## 🧪 Tests

El proyecto incluye tests end-to-end (e2e) para el backend:

### Ejecutar tests

Primero, asegúrate de que la base de datos de test esté corriendo:

**En Linux/Mac:**

```bash
cd apps/backend
./scripts/setup-test-db.sh
```

**En Windows:**

```powershell
cd apps/backend
.\scripts\setup-test-db.ps1
```

Luego ejecuta los tests:

```bash
cd apps/backend
npm run test:e2e
```

Los tests cubren:

- Autenticación (login, registro)
- Gestión de tiendas (CRUD completo)
- Gestión de productos (CRUD y relación con tiendas)

## 📝 Scripts Disponibles

### Desde la raíz del proyecto:

- `npm run dev` - Inicia backend y frontend en modo desarrollo
- `npm run build` - Construye todos los proyectos
- `npm run docker:up` - Inicia PostgreSQL
- `npm run docker:down` - Detiene PostgreSQL
- `npm run docker:logs` - Muestra logs de PostgreSQL

### Desde `apps/backend/`:

- `npm run start:dev` - Inicia el servidor en modo desarrollo
- `npm run migration:run` - Ejecuta migraciones pendientes
- `npm run migration:revert` - Revierte la última migración
- `npm run seed` - Pobla la base de datos con datos de prueba
- `npm run test:e2e` - Ejecuta tests end-to-end

### Desde `apps/frontend/`:

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Inicia el servidor en modo producción

## 🔧 Comandos Útiles

Si necesitas reiniciar la base de datos desde cero:

```bash
npm run docker:clean  # Elimina volúmenes y contenedores
npm run docker:up     # Vuelve a crear todo
cd apps/backend
npm run migration:run # Ejecuta migraciones
npm run seed          # Pobla con datos
```

## 📚 Documentación de la API

Una vez que el backend esté corriendo, puedes acceder a la documentación interactiva de Swagger en:

http://localhost:3001/api

Ahí encontrarás todos los endpoints disponibles, sus parámetros y podrás probarlos directamente desde el navegador.
