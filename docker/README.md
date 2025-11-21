# Docker Compose - PostgreSQL

Este directorio contiene la configuración de Docker Compose para PostgreSQL.

## Inicio Rápido

### 1. Levantar PostgreSQL

```bash
# Desde la raíz del proyecto
npm run docker:up

# O directamente con docker-compose
docker-compose up -d
```

### 2. Verificar que PostgreSQL está corriendo

```bash
# Ver logs
npm run docker:logs

# O verificar el estado
docker-compose ps
```

### 3. Configurar variables de entorno

El archivo `.env.example` en `apps/backend/.env.example` contiene las variables de entorno necesarias. Copia el archivo y ajusta según tus necesidades:

```bash
cd apps/backend
cp .env.example .env
```

**Configuración por defecto de Docker Compose:**

- Host: `localhost`
- Puerto: `5432`
- Base de datos: `choppi_db`
- Usuario: `postgres`
- Contraseña: `postgres`

## Comandos Disponibles

### Gestión del contenedor

```bash
# Levantar PostgreSQL
npm run docker:up

# Detener PostgreSQL (mantiene datos)
npm run docker:stop

# Iniciar PostgreSQL (si ya existe)
npm run docker:start

# Reiniciar PostgreSQL
npm run docker:restart

# Detener y eliminar contenedores
npm run docker:down

# Detener y eliminar contenedores y volúmenes (elimina datos)
npm run docker:clean
```

### Ver logs

```bash
# Ver logs en tiempo real
npm run docker:logs

# Ver últimas 100 líneas
docker-compose logs --tail=100 postgres
```

### Acceder a PostgreSQL

```bash
# Usando psql dentro del contenedor
docker-compose exec postgres psql -U postgres -d choppi_db

# O desde tu máquina local (si tienes psql instalado)
psql -h localhost -p 5432 -U postgres -d choppi_db
```

## Configuración

### Cambiar contraseña

Edita el archivo `docker-compose.yml` y cambia `POSTGRES_PASSWORD`. También actualiza la variable `DB_PASSWORD` en tu archivo `.env` del backend.

### Cambiar puerto

Edita `docker-compose.yml` y cambia `"5432:5432"` por `"PUERTO_LOCAL:5432"`. También actualiza `DB_PORT` en tu `.env`.

### Scripts de inicialización

El archivo `docker/postgres/init.sql` se ejecuta automáticamente cuando el contenedor se crea por primera vez. Úsalo para crear extensiones o configuraciones iniciales.

## Persistencia de Datos

Los datos se almacenan en un volumen de Docker llamado `postgres_data`. Esto significa que los datos persisten incluso si detienes y eliminas el contenedor.

Para eliminar completamente los datos:

```bash
npm run docker:clean
```

## Troubleshooting

### El puerto 5432 ya está en uso

Si ya tienes PostgreSQL corriendo en tu máquina, cambia el puerto en `docker-compose.yml`:

```yaml
ports:
  - '5433:5432' # Cambia 5433 por el puerto que prefieras
```

Y actualiza `DB_PORT=5433` en tu `.env`.

### No se puede conectar a la base de datos

1. Verifica que el contenedor esté corriendo: `docker-compose ps`
2. Verifica los logs: `npm run docker:logs`
3. Verifica que las variables de entorno en `.env` coincidan con las de `docker-compose.yml`

### Restablecer la base de datos

```bash
# Detener y eliminar todo
npm run docker:clean

# Volver a levantar
npm run docker:up
```

## Volúmenes

- `postgres_data`: Almacena los datos de PostgreSQL persistentes

## Red

El contenedor usa la red `choppi-network` que permite comunicación entre servicios si añades más contenedores en el futuro.
