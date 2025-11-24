# Frontend - Choppi

Aplicación web desarrollada con Next.js 16 para la gestión de tiendas y productos. Interfaz moderna y responsive construida con React, Tailwind CSS y DaisyUI.

## 🚀 Inicio Rápido

### Requisitos Previos

- Node.js >= 20.0.0
- npm >= 10.0.0
- Backend corriendo en `http://localhost:3001`

### Configuración

1. **Instalar dependencias:**

   ```bash
   npm install
   ```

2. **Configurar variables de entorno:**

   Crea un archivo `.env.local` en la raíz del frontend:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   NEXTAUTH_SECRET=tu-secret-aleatorio-aqui
   NEXTAUTH_URL=http://localhost:3000
   ```

   Para generar un `NEXTAUTH_SECRET` aleatorio, puedes usar:

   ```bash
   openssl rand -base64 32
   ```

3. **Iniciar servidor de desarrollo:**
   ```bash
   npm run dev
   ```

La aplicación estará disponible en `http://localhost:3000`.

## 🏗️ Arquitectura

### Estructura de Carpetas

```
app/
├── (public)/           # Rutas públicas (sin autenticación)
│   ├── login/         # Página de inicio de sesión
│   ├── register/      # Página de registro
│   └── page.tsx       # Página de inicio
├── (dashboard)/       # Rutas protegidas (requieren autenticación)
│   ├── dashboard/     # Dashboard principal
│   ├── stores/        # Gestión de tiendas
│   └── products/      # Gestión de productos
└── api/               # API routes de Next.js
    └── auth/          # NextAuth handlers

src/
├── components/        # Componentes reutilizables
│   ├── dashboard/     # Componentes del dashboard
│   ├── forms/         # Formularios
│   ├── modals/        # Modales
│   └── providers/     # Context providers
├── hooks/             # Custom hooks
├── services/          # Servicios de API
├── schemas/           # Esquemas de validación (Zod)
├── types/             # Tipos TypeScript
└── lib/               # Utilidades y configuración
```

### Tecnologías Principales

- **Next.js 16** - Framework React con App Router
- **NextAuth** - Autenticación y sesiones
- **React Hook Form** - Manejo de formularios
- **Zod** - Validación de esquemas
- **Axios** - Cliente HTTP
- **Tailwind CSS** - Estilos
- **DaisyUI** - Componentes UI

### Características

- ✅ Autenticación con NextAuth
- ✅ Rutas protegidas
- ✅ Formularios con validación
- ✅ Paginación
- ✅ Búsqueda y filtros
- ✅ Modales para confirmaciones
- ✅ Diseño responsive
- ✅ Manejo de errores

## 📱 Páginas y Funcionalidades

### Rutas Públicas

- **`/`** - Página de inicio (redirige a login si no estás autenticado)
- **`/login`** - Inicio de sesión
- **`/register`** - Registro de nuevos usuarios

### Rutas Protegidas (requieren autenticación)

- **`/dashboard`** - Dashboard principal con métricas y resumen
- **`/stores`** - Lista de tiendas con búsqueda y paginación
- **`/stores/create`** - Crear nueva tienda
- **`/stores/[id]/edit`** - Editar tienda existente
- **`/products`** - Lista de productos con búsqueda y paginación
- **`/products/create`** - Crear nuevo producto
- **`/products/[id]/edit`** - Editar producto existente

## 🎨 Componentes Principales

### Formularios (`src/components/forms/`)

- `StoreForm` - Formulario para crear/editar tiendas
- `ProductForm` - Formulario para crear/editar productos
- `LoginForm` - Formulario de inicio de sesión
- `RegisterForm` - Formulario de registro

### Dashboard (`src/components/dashboard/`)

- Componentes para mostrar métricas y resúmenes
- Listas de tiendas y productos destacados

### Hooks Personalizados (`src/hooks/`)

- `useStores` - Obtener y gestionar tiendas
- `useProducts` - Obtener y gestionar productos
- `useCreateStore` - Crear tienda
- `useUpdateStore` - Actualizar tienda
- `useCreateProduct` - Crear producto
- `useUpdateProduct` - Actualizar producto

## 🔐 Autenticación

La autenticación se maneja con NextAuth. El token JWT se almacena en la sesión y se incluye automáticamente en las peticiones al backend.

Para proteger una ruta, usa el layout en `app/(dashboard)/layout.tsx` que verifica la autenticación automáticamente.

## 📝 Scripts Disponibles

- `npm run dev` - Inicia servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Inicia servidor en modo producción
- `npm run lint` - Ejecuta el linter

## 🎯 Flujo de Datos

1. **Usuario interactúa** con la UI (formularios, botones)
2. **Hooks personalizados** manejan la lógica de negocio
3. **Servicios** (`src/services/`) hacen las peticiones HTTP al backend
4. **Axios** (`src/lib/axios.ts`) configura las peticiones con el token JWT
5. **Backend** procesa y retorna datos
6. **UI se actualiza** con los datos recibidos

## 🔧 Configuración de API

La URL del backend se configura en `.env.local` con `NEXT_PUBLIC_API_URL`. El cliente Axios está configurado en `src/lib/axios.ts` y automáticamente incluye el token JWT en las peticiones autenticadas.

## 📦 Paquetes Compartidos

El proyecto usa el paquete `@choppi/types` para compartir tipos entre frontend y backend. Esto asegura consistencia en los tipos de datos.

## 🎨 Estilos

Los estilos se manejan con Tailwind CSS y DaisyUI. La configuración está en `tailwind.config.ts`. Los estilos globales están en `app/globals.css`.

## 🐛 Manejo de Errores

Los errores se manejan en varios niveles:

- Validación de formularios con Zod
- Manejo de errores de API en los hooks
- Mensajes de error amigables en la UI
- Modales de confirmación para acciones destructivas
