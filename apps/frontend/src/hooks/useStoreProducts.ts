import { useState, useEffect, useCallback } from 'react';
import { productService } from '@/src/services/product.service';
import { StoreProduct, ApiError } from '@/src/types/store-product';

interface UseStoreProductsReturn {
  storeProducts: StoreProduct[];
  loading: boolean;
  error: string;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  searchTerm: string;
  itemsPerPage: number;
  inStockFilter: boolean | null;
  setSearchTerm: (term: string) => void;
  setInStockFilter: (filter: boolean | null) => void;
  clearSearch: () => void;
  handlePageChange: (page: number) => void;
  handleItemsPerPageChange: (itemsPerPage: number) => void;
  reload: () => Promise<void>;
}

export function useStoreProducts(
  storeId: string | null,
  initialItemsPerPage: number = 10
): UseStoreProductsReturn {
  const [storeProducts, setStoreProducts] = useState<StoreProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);
  const [inStockFilter, setInStockFilter] = useState<boolean | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: initialItemsPerPage,
    total: 0,
    totalPages: 0,
  });

  const loadStoreProducts = useCallback(
    async (
      page: number = 1,
      search: string = '',
      limit: number = 10,
      inStock: boolean | null = null
    ) => {
      if (!storeId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const result = await productService.findStoreProducts(storeId, {
          page,
          limit,
          q: search || undefined,
          inStock:
            inStock === true ? true : inStock === false ? false : undefined,
        });
        setStoreProducts(result.data);
        setPagination({
          page: result.meta.page,
          limit: result.meta.limit,
          total: result.meta.total,
          totalPages: result.meta.totalPages,
        });
      } catch (err) {
        const apiError = err as ApiError;
        setError(apiError.message || 'Error al cargar los productos');
        setStoreProducts([]);
      } finally {
        setLoading(false);
      }
    },
    [storeId]
  );

  useEffect(() => {
    loadStoreProducts(currentPage, searchTerm, itemsPerPage, inStockFilter);
  }, [currentPage, itemsPerPage, inStockFilter, loadStoreProducts]);

  // Debounce para búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage === 1) {
        loadStoreProducts(1, searchTerm, itemsPerPage, inStockFilter);
      } else {
        setCurrentPage(1);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleItemsPerPageChange = useCallback((newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setCurrentPage(1);
  }, []);

  const reload = useCallback(async () => {
    await loadStoreProducts(
      currentPage,
      searchTerm,
      itemsPerPage,
      inStockFilter
    );
  }, [currentPage, searchTerm, itemsPerPage, inStockFilter, loadStoreProducts]);

  return {
    storeProducts,
    loading,
    error,
    pagination,
    searchTerm,
    itemsPerPage,
    inStockFilter,
    setSearchTerm,
    setInStockFilter,
    clearSearch,
    handlePageChange,
    handleItemsPerPageChange,
    reload,
  };
}
