'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { storeService } from '@/src/services/store.service';
import { Store, ApiError } from '@/src/types/store';
import ConfirmModal from '@/src/components/ConfirmModal';
import Pagination from '@/src/components/Pagination';

interface PaginatedStores {
  data: Store[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function StoresPage() {
  const router = useRouter();
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [pagination, setPagination] = useState<PaginatedStores>({
    data: [],
    total: 0,
    page: 1,
    limit: 10,
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

  useEffect(() => {
    loadStores(currentPage, searchTerm, itemsPerPage);
  }, [currentPage, itemsPerPage, loadStores]);

  // Debounce para la búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage === 1) {
        loadStores(1, searchTerm, itemsPerPage);
      } else {
        setCurrentPage(1);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, loadStores, currentPage, itemsPerPage]);

  const handleDeleteClick = (id: string, name: string) => {
    setDeleteModal({
      isOpen: true,
      storeId: id,
      storeName: name,
    });
  };

  const handleDeleteConfirm = async () => {
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
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, storeId: null, storeName: '' });
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Resetear a la primera página
  };

  return (
    <div className="w-full">
      {/* Title and Create Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">Tiendas</h1>
        <Link href="/stores/create" className="btn btn-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="2"
            fill="none"
            stroke="currentColor"
            className="size-5"
          >
            <path d="M12 5v14"></path>
            <path d="M5 12h14"></path>
          </svg>
          Crear Tienda
        </Link>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="alert alert-error mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Search */}
      <div className="mb-6">
        <label className="input input-bordered flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="2"
            fill="none"
            stroke="currentColor"
            className="size-4 opacity-70"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </svg>
          <input
            type="text"
            className="grow"
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={loading}
          />
          {loading && (
            <span className="loading loading-spinner loading-sm"></span>
          )}
        </label>
      </div>

      {/* Table */}
      {loading && stores.length === 0 ? (
        <div className="flex justify-center items-center py-12">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Dirección</th>
                  <th>Teléfono</th>
                  <th>Email</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {stores.length > 0 ? (
                  stores.map((store) => (
                    <tr key={store.id}>
                      <td className="font-medium">{store.name}</td>
                      <td>{store.address}</td>
                      <td>{store.phone}</td>
                      <td>{store.email}</td>
                      <td>
                        <div
                          className={`badge ${
                            store.isActive ? 'badge-success' : 'badge-error'
                          }`}
                        >
                          {store.isActive ? 'Activa' : 'Inactiva'}
                        </div>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <Link
                            href={`/stores/${store.id}/edit`}
                            className="btn btn-sm btn-ghost"
                            title="Editar"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              strokeLinejoin="round"
                              strokeLinecap="round"
                              strokeWidth="2"
                              fill="none"
                              stroke="currentColor"
                              className="size-4"
                            >
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                          </Link>
                          <button
                            className="btn btn-sm btn-ghost text-error"
                            onClick={() =>
                              handleDeleteClick(store.id, store.name)
                            }
                            disabled={deletingId === store.id}
                            title="Eliminar"
                          >
                            {deletingId === store.id ? (
                              <span className="loading loading-spinner loading-sm"></span>
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                strokeLinejoin="round"
                                strokeLinecap="round"
                                strokeWidth="2"
                                fill="none"
                                stroke="currentColor"
                                className="size-4"
                              >
                                <path d="M3 6h18"></path>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                              </svg>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-8">
                      <p className="text-base-content/60">
                        {searchTerm
                          ? 'No se encontraron tiendas que coincidan con el término de búsqueda'
                          : 'No hay tiendas registradas'}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            totalItems={pagination.total}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            loading={loading}
            showItemsPerPage={true}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        </>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Eliminar Tienda"
        message={`¿Estás seguro de que deseas eliminar la tienda "${deleteModal.storeName}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        confirmVariant="error"
        loading={deletingId !== null}
      />

      {/* Error Modal */}
      <ConfirmModal
        isOpen={errorModal.isOpen}
        onClose={() => setErrorModal({ isOpen: false, message: '' })}
        onConfirm={() => setErrorModal({ isOpen: false, message: '' })}
        title="Error"
        message={errorModal.message}
        confirmText="Aceptar"
        cancelText=""
        confirmVariant="primary"
      />
    </div>
  );
}
