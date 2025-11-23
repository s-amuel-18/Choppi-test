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
    const session = await getSession();
    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
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

