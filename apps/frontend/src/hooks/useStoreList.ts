import { useState, useEffect } from 'react';
import { storeService } from '@/src/services/store.service';
import { Store, ApiError } from '@/src/types/store';

export function useStoreList() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadStores = async () => {
      setLoading(true);
      setError('');

      try {
        // Cargar todas las tiendas (sin paginación para el selector)
        const result = await storeService.findAll({
          page: 1,
          limit: 1000, // Límite alto para obtener todas
        });
        setStores(result.data);
      } catch (err) {
        const apiError = err as ApiError;
        setError(apiError.message || 'Error al cargar las tiendas');
        setStores([]);
      } finally {
        setLoading(false);
      }
    };

    loadStores();
  }, []);

  return { stores, loading, error };
}

