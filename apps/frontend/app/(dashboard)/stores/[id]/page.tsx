'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useUpdateStore } from '@/src/hooks/useUpdateStore';
import { useStoreProducts } from '@/src/hooks/useStoreProducts';
import {
  LoadingSpinner,
  NotFoundMessage,
  DetailPageHeader,
  ErrorAlert,
  InfoCard,
  SearchInput,
  PriceDisplay,
  Pagination,
} from '@/src/components';

export default function StoreDetailPage() {
  const params = useParams();
  const storeId = (params.id as string) || null;

  const {
    store,
    loadingStore,
    error: storeError,
    notFound,
  } = useUpdateStore(storeId);
  const {
    storeProducts,
    loading: productsLoading,
    error: productsError,
    pagination,
    searchTerm,
    itemsPerPage,
    inStockFilter,
    setSearchTerm,
    setInStockFilter,
    clearSearch,
    handlePageChange,
    handleItemsPerPageChange,
  } = useStoreProducts(storeId, 10);

  if (loadingStore) {
    return <LoadingSpinner />;
  }

  if (notFound || !store) {
    return (
      <NotFoundMessage
        title="Tienda no encontrada"
        message="La tienda que estás buscando no existe o ha sido eliminada."
        backUrl="/stores"
        backLabel="Volver a Tiendas"
      />
    );
  }

  return (
    <div className="w-full">
      <DetailPageHeader
        title={store.name}
        editUrl={`/stores/${store.id}/edit`}
        editLabel="Editar Tienda"
      />

      {storeError && <ErrorAlert message={storeError} className="mb-6" />}

      <InfoCard
        title="Información de la Tienda"
        fields={[
          { label: 'Nombre', value: store.name },
          {
            label: 'Estado',
            value: (
              <span
                className={`badge ${
                  store.isActive ? 'badge-success' : 'badge-error'
                }`}
              >
                {store.isActive ? 'Activa' : 'Inactiva'}
              </span>
            ),
          },
          { label: 'Dirección', value: store.address },
          { label: 'Teléfono', value: store.phone },
          { label: 'Email', value: store.email },
          ...(store.description
            ? [
                {
                  label: 'Descripción',
                  value: store.description,
                  span: 2 as const,
                },
              ]
            : []),
        ]}
      />

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="card-title text-2xl">Productos de la Tienda</h2>
          </div>

          <div className="mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <SearchInput
                  value={searchTerm}
                  onChange={setSearchTerm}
                  onClear={clearSearch}
                  placeholder="Buscar productos..."
                  disabled={productsLoading}
                  loading={productsLoading}
                  resultsCount={pagination.total}
                  resultsLabel={`Se encontraron ${pagination.total} producto${
                    pagination.total !== 1 ? 's' : ''
                  }`}
                />
              </div>
              <div className="w-full sm:w-auto">
                <select
                  className="select select-bordered w-full"
                  value={
                    inStockFilter === true
                      ? 'true'
                      : inStockFilter === false
                      ? 'false'
                      : 'all'
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    setInStockFilter(
                      value === 'true' ? true : value === 'false' ? false : null
                    );
                  }}
                  disabled={productsLoading}
                >
                  <option value="all">Todos los productos</option>
                  <option value="true">Solo en stock</option>
                  <option value="false">Sin stock</option>
                </select>
              </div>
            </div>
          </div>

          {productsError && (
            <ErrorAlert message={productsError} className="mb-6" />
          )}

          {productsLoading && storeProducts.length === 0 ? (
            <LoadingSpinner />
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="table table-zebra">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Precio</th>
                      <th>Stock</th>
                      <th>Categoría</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {storeProducts.length > 0 ? (
                      storeProducts.map((storeProduct) => (
                        <tr key={storeProduct.id}>
                          <td>
                            <div>
                              <div className="font-medium">
                                {storeProduct.product.name}
                              </div>
                              {storeProduct.product.description && (
                                <div className="text-sm text-base-content/60 truncate max-w-md">
                                  {storeProduct.product.description}
                                </div>
                              )}
                            </div>
                          </td>
                          <td>
                            <PriceDisplay price={storeProduct.storePrice} />
                          </td>
                          <td>
                            <span
                              className={`badge ${
                                storeProduct.stock > 0
                                  ? 'badge-success'
                                  : 'badge-error'
                              }`}
                            >
                              {storeProduct.stock}
                            </span>
                          </td>
                          <td>
                            {storeProduct.product.category ? (
                              <span className="badge badge-outline">
                                {storeProduct.product.category}
                              </span>
                            ) : (
                              <span className="text-base-content/50">
                                Sin categoría
                              </span>
                            )}
                          </td>
                          <td>
                            <Link
                              href={`/products/${storeProduct.product.id}`}
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
                              Ver
                            </Link>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="text-center py-8">
                          <p className="text-base-content/60">
                            {searchTerm || inStockFilter !== null
                              ? 'No se encontraron productos que coincidan con los filtros'
                              : 'No hay productos en esta tienda'}
                          </p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {pagination.totalPages > 0 && (
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  totalItems={pagination.total}
                  itemsPerPage={itemsPerPage}
                  onPageChange={handlePageChange}
                  loading={productsLoading}
                  showItemsPerPage={true}
                  onItemsPerPageChange={handleItemsPerPageChange}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
