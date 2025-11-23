import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { storeService } from '@/src/services/store.service';
import { Store, ApiError, CreateStoreRequest } from '@/src/types/store';

interface UseUpdateStoreReturn {
  store: Store | null;
  loading: boolean;
  updating: boolean;
  loadingStore: boolean;
  error: string;
  notFound: boolean;
  updateStore: (data: Partial<CreateStoreRequest> & { isActive?: boolean }) => Promise<void>;
  clearError: () => void;
}

export function useUpdateStore(storeId: string | null): UseUpdateStoreReturn {
  const router = useRouter();
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string>('');
  const [notFound, setNotFound] = useState(false);

  // Load store data
  useEffect(() => {
    const loadStore = async () => {
      if (!storeId) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const storeData = await storeService.findOne(storeId);
        setStore(storeData);
      } catch (err) {
        const apiError = err as ApiError;
        if (apiError.statusCode === 404) {
          setNotFound(true);
          setError('Tienda no encontrada');
        } else {
          setError(
            apiError.message || 'Error al cargar los datos de la tienda'
          );
        }
      } finally {
        setLoading(false);
      }
    };

    loadStore();
  }, [storeId]);

  const updateStore = useCallback(
    async (data: Partial<CreateStoreRequest> & { isActive?: boolean }) => {
      if (!storeId) return;

      setUpdating(true);
      setError('');

      try {
        await storeService.update(storeId, data);
        router.push('/stores');
      } catch (err) {
        const apiError = err as ApiError;
        if (apiError.errors && Array.isArray(apiError.errors)) {
          setError(apiError.errors.join(', '));
        } else {
          setError(apiError.message || 'Error al actualizar la tienda');
        }
        throw err;
      } finally {
        setUpdating(false);
      }
    },
    [storeId, router]
  );

  const clearError = useCallback(() => {
    setError('');
  }, []);

  return {
    store,
    loading: loading,
    updating,
    loadingStore: loading,
    error,
    notFound,
    updateStore,
    clearError,
  };
}

