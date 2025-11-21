import { env } from '@/config';

/**
 * URL base de la API del backend
 */
export const API_URL = env.NEXT_PUBLIC_API_URL;

/**
 * Construye una URL completa para un endpoint de la API
 * @param endpoint - El endpoint relativo (ej: '/auth/login')
 * @returns La URL completa
 */
export function getApiUrl(endpoint: string): string {
  // Asegurar que el endpoint comience con /
  const normalizedEndpoint = endpoint.startsWith('/')
    ? endpoint
    : `/${endpoint}`;
  // Remover la barra final de la URL base si existe
  const baseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
  return `${baseUrl}${normalizedEndpoint}`;
}
