import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { storeService } from '@/src/services/store.service';
import { CreateStoreRequest, ApiError } from '@/src/types/store';

interface UseCreateStoreReturn {
  loading: boolean;
  error: string;
  createStore: (data: CreateStoreRequest) => Promise<void>;
  clearError: () => void;
}

export function useCreateStore(): UseCreateStoreReturn {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const createStore = useCallback(
    async (data: CreateStoreRequest) => {
      setLoading(true);
      setError('');

      try {
        await storeService.create(data);
        router.push('/stores');
      } catch (err) {
        const apiError = err as ApiError;
        if (apiError.errors && Array.isArray(apiError.errors)) {
          setError(apiError.errors.join(', '));
        } else {
          setError(apiError.message || 'Error al crear la tienda');
        }
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  const clearError = useCallback(() => {
    setError('');
  }, []);

  return {
    loading,
    error,
    createStore,
    clearError,
  };
}

