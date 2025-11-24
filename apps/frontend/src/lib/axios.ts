import axios from 'axios';
import { env } from '@/src/config';
import { getSession } from 'next-auth/react';

export const apiClient = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token de autenticación
apiClient.interceptors.request.use(
  async (config) => {
    // `getSession` solo puede ejecutarse en el cliente, por lo que evitamos
    // invocarlo cuando el interceptor corre durante SSR o en el backend.
    if (typeof window !== 'undefined') {
      const session = await getSession();
      const token = session?.accessToken ?? session?.user?.accessToken;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para respuestas
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Aquí puedes manejar errores globales
    return Promise.reject(error);
  }
);
