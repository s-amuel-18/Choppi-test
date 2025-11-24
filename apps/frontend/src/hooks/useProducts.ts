import { useState, useEffect, useCallback } from 'react';
import { productService } from '@/src/services/product.service';
import { Product, ApiError } from '@/src/types/product';
import { StoreProduct } from '@/src/types/store-product';

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
  storeProducts: StoreProduct[];
  loading: boolean;
  error: string;
  pagination: PaginatedProducts;
  searchTerm: string;
  currentPage: number;
  itemsPerPage: number;
  selectedStoreId: string | null;
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
  addProductModal: {
    isOpen: boolean;
  };
  addingProduct: boolean;

  // Acciones
  setSearchTerm: (term: string) => void;
  setSelectedStoreId: (storeId: string | null) => void;
  clearSearch: () => void;
  handlePageChange: (page: number) => void;
  handleItemsPerPageChange: (itemsPerPage: number) => void;
  handleDeleteClick: (id: string, name: string) => void;
  handleDeleteConfirm: () => Promise<void>;
  handleDeleteCancel: () => void;
  openAddProductModal: () => void;
  closeAddProductModal: () => void;
  handleAddProductToStore: (
    productId: string,
    stock: number,
    storePrice?: number | null
  ) => Promise<void>;
  closeErrorModal: () => void;
  reload: () => Promise<void>;
}

export function useProducts(
  initialItemsPerPage: number = 10
): UseProductsReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [storeProducts, setStoreProducts] = useState<StoreProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);
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
  const [addProductModal, setAddProductModal] = useState<{
    isOpen: boolean;
  }>({
    isOpen: false,
  });
  const [addingProduct, setAddingProduct] = useState(false);

  const loadProducts = useCallback(
    async (
      page: number = 1,
      search: string = '',
      limit: number = 10,
      storeId: string | null = null
    ) => {
      setLoading(true);
      setError('');

      try {
        if (storeId) {
          // Cargar productos de la tienda
          const result = await productService.findStoreProducts(storeId, {
            page,
            limit,
            q: search || undefined,
          });
          setStoreProducts(result.data);
          setPagination({
            data: [],
            total: result.meta.total,
            page: result.meta.page,
            limit: result.meta.limit,
            totalPages: result.meta.totalPages,
          });
          setProducts([]);
        } else {
          // Cargar todos los productos
          const result = await productService.findAll({
            page,
            limit,
            q: search || undefined,
          });
          setProducts(result.data);
          setPagination(result);
          setStoreProducts([]);
        }
      } catch (err) {
        const apiError = err as ApiError;
        setError(apiError.message || 'Error al cargar los productos');
        setProducts([]);
        setStoreProducts([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Cargar productos cuando cambian la página, items por página o tienda seleccionada
  useEffect(() => {
    loadProducts(currentPage, searchTerm, itemsPerPage, selectedStoreId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, itemsPerPage, selectedStoreId]);

  // Debounce para la búsqueda - cuando cambia searchTerm, resetea a página 1 y busca
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage === 1) {
        loadProducts(1, searchTerm, itemsPerPage, selectedStoreId);
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
      await loadProducts(
        currentPage,
        searchTerm,
        itemsPerPage,
        selectedStoreId
      );
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

  const openAddProductModal = useCallback(() => {
    setAddProductModal({ isOpen: true });
  }, []);

  const closeAddProductModal = useCallback(() => {
    setAddProductModal({ isOpen: false });
  }, []);

  const handleAddProductToStore = useCallback(
    async (productId: string, stock: number, storePrice?: number | null) => {
      if (!selectedStoreId) return;

      setAddingProduct(true);
      try {
        await productService.addProductToStore(selectedStoreId, {
          productId,
          stock,
          storePrice: storePrice ?? null,
        });
        // Cerrar el modal
        setAddProductModal({ isOpen: false });
        // Recargar la lista
        await loadProducts(
          currentPage,
          searchTerm,
          itemsPerPage,
          selectedStoreId
        );
      } catch (err) {
        const apiError = err as ApiError;
        // Mostrar modal de error
        setErrorModal({
          isOpen: true,
          message:
            apiError.message || 'Error al agregar el producto a la tienda',
        });
        throw err;
      } finally {
        setAddingProduct(false);
      }
    },
    [selectedStoreId, currentPage, searchTerm, itemsPerPage, loadProducts]
  );

  const reload = useCallback(async () => {
    await loadProducts(currentPage, searchTerm, itemsPerPage, selectedStoreId);
  }, [currentPage, searchTerm, itemsPerPage, selectedStoreId, loadProducts]);

  const handleStoreChange = useCallback((storeId: string | null) => {
    setSelectedStoreId(storeId);
    setCurrentPage(1);
  }, []);

  return {
    // Estado
    products,
    storeProducts,
    loading,
    error,
    pagination,
    searchTerm,
    currentPage,
    itemsPerPage,
    selectedStoreId,
    deletingId,
    deleteModal,
    errorModal,
    addProductModal,
    addingProduct,

    // Acciones
    setSearchTerm,
    setSelectedStoreId: handleStoreChange,
    clearSearch,
    handlePageChange,
    handleItemsPerPageChange,
    handleDeleteClick,
    handleDeleteConfirm,
    handleDeleteCancel,
    openAddProductModal,
    closeAddProductModal,
    handleAddProductToStore,
    closeErrorModal,
    reload,
  };
}
