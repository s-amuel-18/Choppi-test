import { cleanEnv, str, num, bool, host, port } from 'envalid';

/**
 * Configuración y validación de variables de entorno usando envalid
 * Este archivo valida todas las variables de entorno requeridas y opcionales
 */
export const env = cleanEnv(process.env, {
  // Variables de aplicación
  NODE_ENV: str({
    choices: ['development', 'production', 'test'],
    default: 'development',
    desc: 'Entorno de ejecución de la aplicación',
  }),
  PORT: num({
    default: 3001,
    desc: 'Puerto en el que se ejecutará el servidor',
  }),

  // Variables de PostgreSQL (Base de datos)
  DB_HOST: host({
    default: 'localhost',
    desc: 'Host de la base de datos PostgreSQL',
  }),
  DB_PORT: port({
    default: 5432,
    desc: 'Puerto de la base de datos PostgreSQL',
  }),
  DB_NAME: str({
    desc: 'Nombre de la base de datos PostgreSQL',
  }),
  DB_USER: str({
    desc: 'Usuario de la base de datos PostgreSQL',
  }),
  DB_PASSWORD: str({
    desc: 'Contraseña de la base de datos PostgreSQL',
  }),
  DB_SSL: bool({
    default: false,
    desc: 'Habilitar conexión SSL a la base de datos',
  }),
  DB_SYNCHRONIZE: bool({
    default: false,
    desc: 'Sincronizar automáticamente el esquema de la base de datos (solo para desarrollo)',
  }),
  DB_LOGGING: bool({
    default: false,
    desc: 'Habilitar logging de consultas SQL',
  }),
  DB_MAX_CONNECTIONS: num({
    default: 10,
    desc: 'Número máximo de conexiones al pool de la base de datos',
  }),
});

/**
 * Interface para tipar la configuración de la base de datos
 */
export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl: boolean;
  synchronize: boolean;
  logging: boolean;
  maxConnections: number;
}

/**
 * Configuración de la base de datos extraída de las variables de entorno
 */
export const databaseConfig: DatabaseConfig = {
  host: env.DB_HOST,
  port: env.DB_PORT,
  database: env.DB_NAME,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  ssl: env.DB_SSL,
  synchronize: env.DB_SYNCHRONIZE && env.NODE_ENV === 'development',
  logging: env.DB_LOGGING || env.NODE_ENV === 'development',
  maxConnections: env.DB_MAX_CONNECTIONS,
};

/**
 * URL de conexión a la base de datos PostgreSQL
 */
export const databaseUrl = `postgresql://${env.DB_USER}:${env.DB_PASSWORD}@${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}`;
