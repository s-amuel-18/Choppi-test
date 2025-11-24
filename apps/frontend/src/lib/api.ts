import { env } from '@/src/config';




export const API_URL = env.NEXT_PUBLIC_API_URL;






export function getApiUrl(endpoint: string): string {
  
  const normalizedEndpoint = endpoint.startsWith('/')
    ? endpoint
    : `/${endpoint}`;
  
  const baseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
  return `${baseUrl}${normalizedEndpoint}`;
}
