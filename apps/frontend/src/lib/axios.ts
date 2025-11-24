import axios from 'axios';
import { env } from '@/src/config';
import { getSession } from 'next-auth/react';

export const apiClient = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


apiClient.interceptors.request.use(
  async (config) => {
    
    
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


apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    
    return Promise.reject(error);
  }
);
