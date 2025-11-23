import { useState, useEffect, useCallback } from 'react';
import { storeService } from '@/src/services/store.service';
import { Store, ApiError } from '@/src/types/store';

interface PaginatedStores {
  data: Store[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface UseStoresReturn {
  // Estado
  stores: Store[];
  loading: boolean;
  error: string;
  pagination: PaginatedStores;
  searchTerm: string;
  currentPage: number;
  itemsPerPage: number;
  deletingId: string | null;
  deleteModal: {
    isOpen: boolean;
    storeId: string | null;
    storeName: string;
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

export function useStores(initialItemsPerPage: number = 10): UseStoresReturn {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);
  const [pagination, setPagination] = useState<PaginatedStores>({
    data: [],
    total: 0,
    page: 1,
    limit: initialItemsPerPage,
    totalPages: 0,
  });
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    storeId: string | null;
    storeName: string;
  }>({
    isOpen: false,
    storeId: null,
    storeName: '',
  });
  const [errorModal, setErrorModal] = useState<{
    isOpen: boolean;
    message: string;
  }>({
    isOpen: false,
    message: '',
  });

  const loadStores = useCallback(
    async (page: number = 1, search: string = '', limit: number = 10) => {
      setLoading(true);
      setError('');

      try {
        const result = await storeService.findAll({
          page,
          limit,
          q: search || undefined,
        });
        setStores(result.data);
        setPagination(result);
      } catch (err) {
        const apiError = err as ApiError;
        setError(apiError.message || 'Error al cargar las tiendas');
        setStores([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Cargar stores cuando cambian la página o items por página
  useEffect(() => {
    loadStores(currentPage, searchTerm, itemsPerPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, itemsPerPage]);

  // Debounce para la búsqueda - cuando cambia searchTerm, resetea a página 1 y busca
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage === 1) {
        loadStores(1, searchTerm, itemsPerPage);
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
      storeId: id,
      storeName: name,
    });
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteModal.storeId) return;

    setDeletingId(deleteModal.storeId);
    try {
      await storeService.remove(deleteModal.storeId);
      // Cerrar el modal
      setDeleteModal({ isOpen: false, storeId: null, storeName: '' });
      // Recargar la lista
      await loadStores(currentPage, searchTerm, itemsPerPage);
    } catch (err) {
      const apiError = err as ApiError;
      // Cerrar el modal de confirmación
      setDeleteModal({ isOpen: false, storeId: null, storeName: '' });
      // Mostrar modal de error
      setErrorModal({
        isOpen: true,
        message: apiError.message || 'Error al eliminar la tienda',
      });
    } finally {
      setDeletingId(null);
    }
  }, [deleteModal.storeId, currentPage, searchTerm, itemsPerPage, loadStores]);

  const handleDeleteCancel = useCallback(() => {
    setDeleteModal({ isOpen: false, storeId: null, storeName: '' });
  }, []);

  const closeErrorModal = useCallback(() => {
    setErrorModal({ isOpen: false, message: '' });
  }, []);

  const reload = useCallback(async () => {
    await loadStores(currentPage, searchTerm, itemsPerPage);
  }, [currentPage, searchTerm, itemsPerPage, loadStores]);

  return {
    // Estado
    stores,
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
