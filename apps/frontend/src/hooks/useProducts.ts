import { useState, useEffect, useCallback } from 'react';
import { productService } from '@/src/services/product.service';
import { Product, ApiError } from '@/src/types/product';

interface PaginatedProducts {
  data: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface UseProductsReturn {
  // Estado
  products: Product[];
  loading: boolean;
  error: string;
  pagination: PaginatedProducts;
  searchTerm: string;
  currentPage: number;
  itemsPerPage: number;
  deletingId: string | null;
  deleteModal: {
    isOpen: boolean;
    productId: string | null;
    productName: string;
  };
  errorModal: {
    isOpen: boolean;
    message: string;
  };

  // Acciones
  setSearchTerm: (term: string) => void;
  clearSearch: () => void;
  handlePageChange: (page: number) => void;
  handleItemsPerPageChange: (itemsPerPage: number) => void;
  handleDeleteClick: (id: string, name: string) => void;
  handleDeleteConfirm: () => Promise<void>;
  handleDeleteCancel: () => void;
  closeErrorModal: () => void;
  reload: () => Promise<void>;
}

export function useProducts(
  initialItemsPerPage: number = 10
): UseProductsReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);
  const [pagination, setPagination] = useState<PaginatedProducts>({
    data: [],
    total: 0,
    page: 1,
    limit: initialItemsPerPage,
    totalPages: 0,
  });
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    productId: string | null;
    productName: string;
  }>({
    isOpen: false,
    productId: null,
    productName: '',
  });
  const [errorModal, setErrorModal] = useState<{
    isOpen: boolean;
    message: string;
  }>({
    isOpen: false,
    message: '',
  });

  const loadProducts = useCallback(
    async (page: number = 1, search: string = '', limit: number = 10) => {
      setLoading(true);
      setError('');

      try {
        const result = await productService.findAll({
          page,
          limit,
          q: search || undefined,
        });
        setProducts(result.data);
        setPagination(result);
      } catch (err) {
        const apiError = err as ApiError;
        setError(apiError.message || 'Error al cargar los productos');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Cargar productos cuando cambian la página o items por página
  useEffect(() => {
    loadProducts(currentPage, searchTerm, itemsPerPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, itemsPerPage]);

  // Debounce para la búsqueda - cuando cambia searchTerm, resetea a página 1 y busca
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage === 1) {
        loadProducts(1, searchTerm, itemsPerPage);
      } else {
        setCurrentPage(1);
      }
    }, 500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleItemsPerPageChange = useCallback((newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Resetear a la primera página
  }, []);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setCurrentPage(1);
  }, []);

  const handleDeleteClick = useCallback((id: string, name: string) => {
    setDeleteModal({
      isOpen: true,
      productId: id,
      productName: name,
    });
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteModal.productId) return;

    setDeletingId(deleteModal.productId);
    try {
      await productService.remove(deleteModal.productId);
      // Cerrar el modal
      setDeleteModal({ isOpen: false, productId: null, productName: '' });
      // Recargar la lista
      await loadProducts(currentPage, searchTerm, itemsPerPage);
    } catch (err) {
      const apiError = err as ApiError;
      // Cerrar el modal de confirmación
      setDeleteModal({ isOpen: false, productId: null, productName: '' });
      // Mostrar modal de error
      setErrorModal({
        isOpen: true,
        message: apiError.message || 'Error al eliminar el producto',
      });
    } finally {
      setDeletingId(null);
    }
  }, [
    deleteModal.productId,
    currentPage,
    searchTerm,
    itemsPerPage,
    loadProducts,
  ]);

  const handleDeleteCancel = useCallback(() => {
    setDeleteModal({ isOpen: false, productId: null, productName: '' });
  }, []);

  const closeErrorModal = useCallback(() => {
    setErrorModal({ isOpen: false, message: '' });
  }, []);

  const reload = useCallback(async () => {
    await loadProducts(currentPage, searchTerm, itemsPerPage);
  }, [currentPage, searchTerm, itemsPerPage, loadProducts]);

  return {
    // Estado
    products,
    loading,
    error,
    pagination,
    searchTerm,
    currentPage,
    itemsPerPage,
    deletingId,
    deleteModal,
    errorModal,

    // Acciones
    setSearchTerm,
    clearSearch,
    handlePageChange,
    handleItemsPerPageChange,
    handleDeleteClick,
    handleDeleteConfirm,
    handleDeleteCancel,
    closeErrorModal,
    reload,
  };
}
