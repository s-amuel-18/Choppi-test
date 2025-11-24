import { useEffect, useState } from 'react';
import { productService } from '@/src/services/product.service';
import { ApiError } from '@/src/types/product';

interface ProductStore {
  id: string;
  storeId: string;
  storeName: string;
  storeAddress: string;
  storeEmail: string;
  stock: number;
  storePrice: number | null;
  createdAt: string;
  updatedAt: string;
}

export function useProductStores(productId: string | null) {
  const [productStores, setProductStores] = useState<ProductStore[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadProductStores = async () => {
      if (!productId) return;

      setLoading(true);
      setError('');

      try {
        const stores = await productService.getProductStores(productId);
        setProductStores(stores);
      } catch (err) {
        const apiError = err as ApiError;
        setError(
          apiError.message ||
            'Error al cargar las tiendas donde está disponible'
        );
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      loadProductStores();
    }
  }, [productId]);

  return { productStores, loading, error };
}

