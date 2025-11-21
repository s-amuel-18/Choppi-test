-- Script de inicialización de PostgreSQL
-- Este script se ejecuta automáticamente cuando el contenedor se crea por primera vez

-- Crear extensiones útiles
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Nota: La base de datos y el usuario ya se crean automáticamente
-- a través de las variables de entorno del docker-compose.yml