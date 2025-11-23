import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { productService } from '@/src/services/product.service';
import { Product, ApiError, CreateProductRequest } from '@/src/types/product';

interface UseUpdateProductReturn {
  product: Product | null;
  loading: boolean;
  updating: boolean;
  loadingProduct: boolean;
  error: string;
  notFound: boolean;
  updateProduct: (data: Partial<CreateProductRequest>) => Promise<void>;
  clearError: () => void;
}

export function useUpdateProduct(productId: string | null): UseUpdateProductReturn {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string>('');
  const [notFound, setNotFound] = useState(false);

  // Load product data
  useEffect(() => {
    const loadProduct = async () => {
      if (!productId) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const productData = await productService.findOne(productId);
        setProduct(productData);
      } catch (err) {
        const apiError = err as ApiError;
        if (apiError.statusCode === 404) {
          setNotFound(true);
          setError('Producto no encontrado');
        } else {
          setError(
            apiError.message || 'Error al cargar los datos del producto'
          );
        }
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  const updateProduct = useCallback(
    async (data: Partial<CreateProductRequest>) => {
      if (!productId) return;

      setUpdating(true);
      setError('');

      try {
        await productService.update(productId, data);
        router.push('/products');
      } catch (err) {
        const apiError = err as ApiError;
        if (apiError.errors && Array.isArray(apiError.errors)) {
          setError(apiError.errors.join(', '));
        } else {
          setError(apiError.message || 'Error al actualizar el producto');
        }
        throw err;
      } finally {
        setUpdating(false);
      }
    },
    [productId, router]
  );

  const clearError = useCallback(() => {
    setError('');
  }, []);

  return {
    product,
    loading: loading,
    updating,
    loadingProduct: loading,
    error,
    notFound,
    updateProduct,
    clearError,
  };
}

