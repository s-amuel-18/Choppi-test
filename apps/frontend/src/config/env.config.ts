import { cleanEnv, str, url } from 'envalid';

export const env = cleanEnv(process.env, {
  NODE_ENV: str({
    choices: ['development', 'production', 'test'],
    default: 'development',
    desc: 'Entorno de ejecución de la aplicación',
  }),
  NEXT_PUBLIC_API_URL: url({
    desc: 'URL de la API del backend',
    example: 'http://localhost:3001',
  }),
});
