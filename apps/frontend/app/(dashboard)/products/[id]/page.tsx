'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useUpdateProduct } from '@/src/hooks/useUpdateProduct';
import { useProductStores } from '@/src/hooks/useProductStores';
import {
  LoadingSpinner,
  NotFoundMessage,
  DetailPageHeader,
  ErrorAlert,
  InfoCard,
  PriceDisplay,
} from '@/src/components';
import { formatPrice } from '@/src/lib/formatters';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = (params.id as string) || null;

  const {
    product,
    loadingProduct,
    error: productError,
    notFound,
  } = useUpdateProduct(productId);

  const { productStores, loading: loadingStores, error: storesError } =
    useProductStores(productId);

  if (loadingProduct) {
    return <LoadingSpinner />;
  }

  if (notFound || !product) {
    return (
      <NotFoundMessage
        title="Producto no encontrado"
        message="El producto que estás buscando no existe o ha sido eliminado."
        backUrl="/products"
        backLabel="Volver a Productos"
      />
    );
  }

  return (
    <div className="w-full">
      <DetailPageHeader
        title={product.name}
        editUrl={`/products/${product.id}/edit`}
        editLabel="Editar Producto"
      />

      {productError && <ErrorAlert message={productError} className="mb-6" />}

      <InfoCard
        title="Información del Producto"
        fields={[
          { label: 'Nombre', value: product.name },
          {
            label: 'Precio Original',
            value: (
              <span className="text-lg font-semibold">
                {formatPrice(product.originalPrice)}
              </span>
            ),
          },
          ...(product.category
            ? [
                {
                  label: 'Categoría',
                  value: (
                    <span className="badge badge-outline badge-lg">
                      {product.category}
                    </span>
                  ),
                },
              ]
            : []),
          ...(product.description
            ? [
                {
                  label: 'Descripción',
                  value: (
                    <p className="whitespace-pre-wrap">
                      {product.description}
                    </p>
                  ),
                  span: 2 as const,
                },
              ]
            : []),
        ]}
      />

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4">
            Tiendas donde está disponible
          </h2>

          {storesError && (
            <ErrorAlert message={storesError} className="mb-6" />
          )}

          {loadingStores && productStores.length === 0 ? (
            <LoadingSpinner />
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Tienda</th>
                    <th>Dirección</th>
                    <th>Email</th>
                    <th>Precio en Tienda</th>
                    <th>Stock</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productStores.length > 0 ? (
                    productStores.map((productStore) => (
                      <tr key={productStore.id}>
                        <td className="font-medium">
                          {productStore.storeName}
                        </td>
                        <td>{productStore.storeAddress}</td>
                        <td>{productStore.storeEmail}</td>
                        <td>
                          <PriceDisplay price={productStore.storePrice} />
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              productStore.stock > 0
                                ? 'badge-success'
                                : 'badge-error'
                            }`}
                          >
                            {productStore.stock}
                          </span>
                        </td>
                        <td>
                          <Link
                            href={`/stores/${productStore.storeId}`}
                            className="btn btn-sm btn-ghost"
                            title="Ver detalle de la tienda"
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
                            Ver Tienda
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center py-8">
                        <p className="text-base-content/60">
                          {loadingStores
                            ? 'Cargando tiendas...'
                            : 'Este producto no está disponible en ninguna tienda'}
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
