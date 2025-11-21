/**
 * Configuración global para tests e2e
 * Se ejecuta antes de cada suite de tests
 */

// Configurar variables de entorno para tests si no están definidas
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'test';
}

if (!process.env.DB_HOST) {
  process.env.DB_HOST = 'localhost';
}

if (!process.env.DB_PORT) {
  process.env.DB_PORT = '5433';
}

if (!process.env.DB_NAME) {
  process.env.DB_NAME = 'choppi_db_test';
}

if (!process.env.DB_USER) {
  process.env.DB_USER = 'postgres';
}

if (!process.env.DB_PASSWORD) {
  process.env.DB_PASSWORD = 'postgres';
}

if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'test-secret-key-change-in-production';
}

if (!process.env.JWT_EXPIRES_IN) {
  process.env.JWT_EXPIRES_IN = '86400';
}

// Configuraciones adicionales para tests
process.env.DB_SYNCHRONIZE = 'true';
process.env.DB_LOGGING = 'false';
process.env.DB_SSL = 'false';

// Aumentar timeout para operaciones de base de datos
jest.setTimeout(30000);

// Limpiar después de todos los tests
afterAll(async () => {
  // Dar tiempo para que las conexiones se cierren
  await new Promise((resolve) => setTimeout(resolve, 1000));
});
