import { cleanEnv, str, url } from 'envalid';

// Función auxiliar para obtener variables de entorno con fallback
const getEnvVar = (key: string, defaultValue: string): string => {
  return process.env[key] || defaultValue;
};

// Validar solo en el servidor, en el cliente usar directamente process.env
const isServer = typeof window === 'undefined';

const envVars = {
  NODE_ENV: getEnvVar('NODE_ENV', 'development'),
  NEXT_PUBLIC_API_URL: getEnvVar(
    'NEXT_PUBLIC_API_URL',
    'http://localhost:3001'
  ),
  NEXTAUTH_SECRET: getEnvVar('NEXTAUTH_SECRET', ''),
  NEXTAUTH_URL: getEnvVar('NEXTAUTH_URL', 'http://localhost:3000'),
};

export const env = isServer
  ? cleanEnv(envVars, {
      NODE_ENV: str({
        choices: ['development', 'production', 'test'],
        default: 'development',
        desc: 'Entorno de ejecución de la aplicación',
      }),
      NEXT_PUBLIC_API_URL: url({
        desc: 'URL de la API del backend',
        example: 'http://localhost:3001',
        default: 'http://localhost:3001',
      }),
      NEXTAUTH_SECRET: str({
        desc: 'Secret para NextAuth',
        default: '',
      }),
      NEXTAUTH_URL: str({
        desc: 'URL base de la aplicación para NextAuth',
        default: 'http://localhost:3000',
      }),
    })
  : {
      NODE_ENV: envVars.NODE_ENV,
      NEXT_PUBLIC_API_URL: envVars.NEXT_PUBLIC_API_URL,
      NEXTAUTH_URL: envVars.NEXTAUTH_URL,
    };
