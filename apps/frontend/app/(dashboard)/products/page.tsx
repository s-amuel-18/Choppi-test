'use client';

import Link from 'next/link';
import { useProducts } from '@/src/hooks/useProducts';
import { useStoreList } from '@/src/hooks/useStoreList';
import ConfirmModal from '@/src/components/ConfirmModal';
import AddProductToStoreModal from '@/src/components/modals/AddProductToStoreModal';
import UpdateStoreProductModal from '@/src/components/modals/UpdateStoreProductModal';
import Pagination from '@/src/components/Pagination';

export default function ProductsPage() {
  const {
    products,
    storeProducts,
    loading,
    error,
    pagination,
    searchTerm,
    itemsPerPage,
    selectedStoreId,
    deletingId,
    deleteModal,
    errorModal,
    setSearchTerm,
    setSelectedStoreId,
    clearSearch,
    handlePageChange,
    handleItemsPerPageChange,
    handleDeleteClick,
    handleDeleteConfirm,
    handleDeleteCancel,
    openAddProductModal,
    closeAddProductModal,
    handleAddProductToStore,
    openUpdateStoreProductModal,
    closeUpdateStoreProductModal,
    handleUpdateStoreProduct,
    closeErrorModal,
    addProductModal,
    updateStoreProductModal,
    addingProduct,
    updatingStoreProduct,
  } = useProducts(5);

  const { stores, loading: storesLoading } = useStoreList();

  const displayProducts = selectedStoreId
    ? storeProducts.map((sp) => sp.product)
    : products;
  const displayData = selectedStoreId ? storeProducts : null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  return (
    <div className="w-full">
      {}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">Productos</h1>
        <div className="flex gap-2">
          <button
            onClick={openAddProductModal}
            className="btn btn-secondary"
            disabled={!selectedStoreId || loading}
            title={
              !selectedStoreId
                ? 'Selecciona una tienda para agregar productos'
                : 'Agregar producto a la tienda'
            }
          >
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
            Agregar a Tienda
          </button>
          <Link href="/products/create" className="btn btn-primary">
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
            Crear Producto
          </Link>
        </div>
      </div>

      {}
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

      {}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {}
          <div className="w-full sm:w-auto">
            <select
              className="select select-bordered w-full"
              value={selectedStoreId || ''}
              onChange={(e) => setSelectedStoreId(e.target.value || null)}
              disabled={loading || storesLoading}
            >
              <option value="">Todas las tiendas</option>
              {stores.map((store) => (
                <option key={store.id} value={store.id}>
                  {store.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
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
                placeholder="Buscar por nombre o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={loading}
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="btn btn-ghost btn-sm btn-circle"
                  title="Limpiar búsqueda"
                  disabled={loading}
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
                    <path d="M18 6L6 18"></path>
                    <path d="M6 6l12 12"></path>
                  </svg>
                </button>
              )}
              {loading && (
                <span className="loading loading-spinner loading-sm"></span>
              )}
            </label>
          </div>
        </div>
        {searchTerm && (
          <div className="mt-2 text-sm text-base-content/70">
            {loading ? (
              <span>Buscando...</span>
            ) : (
              <span>
                {pagination.total === 0
                  ? 'No se encontraron resultados'
                  : `Se encontraron ${pagination.total} producto${
                      pagination.total !== 1 ? 's' : ''
                    }`}
              </span>
            )}
          </div>
        )}
      </div>

      {}
      {loading && displayProducts.length === 0 ? (
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
                  <th>Descripción</th>
                  {selectedStoreId ? (
                    <>
                      <th>Precio de la Tienda</th>
                      <th>Stock</th>
                    </>
                  ) : (
                    <th>Precio Original</th>
                  )}
                  <th>Categoría</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {displayProducts.length > 0 ? (
                  displayProducts.map((product) => {
                    const storeProduct = displayData?.find(
                      (sp) => sp.productId === product.id
                    );
                    return (
                      <tr key={product.id}>
                        <td className="font-medium">{product.name}</td>
                        <td className="max-w-md truncate">
                          {product.description || (
                            <span className="text-base-content/50">
                              Sin descripción
                            </span>
                          )}
                        </td>
                        {selectedStoreId ? (
                          <>
                            <td>
                              {storeProduct?.storePrice !== null &&
                              storeProduct?.storePrice !== undefined ? (
                                formatPrice(storeProduct.storePrice)
                              ) : (
                                <span className="text-base-content/50">
                                  Sin precio
                                </span>
                              )}
                            </td>
                            <td>
                              <span
                                className={`badge ${
                                  (storeProduct?.stock ?? 0) > 0
                                    ? 'badge-success'
                                    : 'badge-error'
                                }`}
                              >
                                {storeProduct?.stock ?? 0}
                              </span>
                            </td>
                          </>
                        ) : (
                          <td>{formatPrice(product.originalPrice)}</td>
                        )}
                        <td>
                          {product.category ? (
                            <span className="badge badge-outline">
                              {product.category}
                            </span>
                          ) : (
                            <span className="text-base-content/50">
                              Sin categoría
                            </span>
                          )}
                        </td>
                        <td>
                          <div className="flex gap-2">
                            <Link
                              href={`/products/${product.id}`}
                              className="btn btn-sm btn-ghost"
                              title="Ver detalle del producto"
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
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                              </svg>
                            </Link>
                            <Link
                              href={`/products/${product.id}/edit`}
                              className="btn btn-sm btn-ghost"
                              title="Editar producto"
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
                            {selectedStoreId && storeProduct && (
                              <button
                                onClick={() =>
                                  openUpdateStoreProductModal(storeProduct.id)
                                }
                                className="btn btn-sm btn-ghost"
                                title="Actualizar stock y precio en tienda"
                                disabled={updatingStoreProduct}
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
                                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                                </svg>
                              </button>
                            )}
                            {selectedStoreId && !storeProduct && (
                              <button
                                className="btn btn-sm btn-ghost"
                                title="Actualizar stock y precio en tienda (selecciona un producto vinculado)"
                                disabled={true}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  strokeLinejoin="round"
                                  strokeLinecap="round"
                                  strokeWidth="2"
                                  fill="none"
                                  stroke="currentColor"
                                  className="size-4 opacity-50"
                                >
                                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                                </svg>
                              </button>
                            )}
                            <button
                              onClick={() =>
                                handleDeleteClick(product.id, product.name)
                              }
                              className="btn btn-sm btn-ghost text-error"
                              title="Eliminar"
                              disabled={deletingId === product.id}
                            >
                              {deletingId === product.id ? (
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
                                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                </svg>
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={selectedStoreId ? 6 : 5}
                      className="text-center py-8"
                    >
                      <p className="text-base-content/60">
                        {searchTerm
                          ? 'No se encontraron productos que coincidan con el término de búsqueda'
                          : 'No hay productos registrados'}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {}
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

      {}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Eliminar Producto"
        message={`¿Estás seguro de que deseas eliminar el producto "${deleteModal.productName}"? Esta acción también eliminará todas las relaciones del producto con las tiendas. Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        confirmVariant="error"
        loading={deletingId !== null}
      />

      {}
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

      {}
      <AddProductToStoreModal
        isOpen={addProductModal.isOpen}
        onClose={closeAddProductModal}
        onSubmit={handleAddProductToStore}
        loading={addingProduct}
        storeId={selectedStoreId}
        existingProductIds={
          selectedStoreId ? storeProducts.map((sp) => sp.productId) : []
        }
      />

      {}
      <UpdateStoreProductModal
        isOpen={updateStoreProductModal.isOpen}
        onClose={closeUpdateStoreProductModal}
        onSubmit={async (stock, storePrice) => {
          if (updateStoreProductModal.storeProductId) {
            await handleUpdateStoreProduct(
              updateStoreProductModal.storeProductId,
              stock,
              storePrice
            );
          }
        }}
        loading={updatingStoreProduct}
        storeProduct={
          selectedStoreId && updateStoreProductModal.storeProductId
            ? storeProducts.find(
                (sp) => sp.id === updateStoreProductModal.storeProductId
              ) || null
            : null
        }
      />
    </div>
  );
}
