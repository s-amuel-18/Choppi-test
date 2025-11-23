import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { productService } from '@/src/services/product.service';
import { CreateProductRequest, ApiError } from '@/src/types/product';

interface UseCreateProductReturn {
  loading: boolean;
  error: string;
  createProduct: (data: CreateProductRequest) => Promise<void>;
  clearError: () => void;
}

export function useCreateProduct(): UseCreateProductReturn {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const createProduct = useCallback(
    async (data: CreateProductRequest) => {
      setLoading(true);
      setError('');

      try {
        await productService.create(data);
        router.push('/products');
      } catch (err) {
        const apiError = err as ApiError;
        if (apiError.errors && Array.isArray(apiError.errors)) {
          setError(apiError.errors.join(', '));
        } else {
          setError(apiError.message || 'Error al crear el producto');
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
    createProduct,
    clearError,
  };
}

