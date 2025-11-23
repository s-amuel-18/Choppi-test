'use client';

import Link from 'next/link';
import { useStores } from '@/src/hooks/useStores';
import ConfirmModal from '@/src/components/ConfirmModal';
import Pagination from '@/src/components/Pagination';

export default function StoresPage() {
  const {
    stores,
    loading,
    error,
    pagination,
    searchTerm,
    itemsPerPage,
    deletingId,
    deleteModal,
    errorModal,
    setSearchTerm,
    handlePageChange,
    handleItemsPerPageChange,
    handleDeleteClick,
    handleDeleteConfirm,
    handleDeleteCancel,
    closeErrorModal,
  } = useStores(10);

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
        onClose={closeErrorModal}
        onConfirm={closeErrorModal}
        title="Error"
        message={errorModal.message}
        confirmText="Aceptar"
        cancelText=""
        confirmVariant="primary"
      />
    </div>
  );
}
