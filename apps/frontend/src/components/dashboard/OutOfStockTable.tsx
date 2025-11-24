import { DashboardOutOfStockProduct } from '@/src/types/dashboard';
import { formatDate } from '@/src/lib/formatters';

interface OutOfStockTableProps {
  products: DashboardOutOfStockProduct[];
}

export default function OutOfStockTable({ products }: OutOfStockTableProps) {
  return (
    <article className="card bg-base-100 shadow-md border border-base-200">
      <div className="card-body p-0">
        <div className="flex items-center justify-between px-6 py-4 border-b border-base-200">
          <div>
            <h2 className="card-title text-base-content">
              Productos sin inventario
            </h2>
            <p className="text-sm text-base-content/60">
              Registros recientes de stock agotado por tienda
            </p>
          </div>
          <span className="badge badge-error badge-outline">
            {products.length} detectados
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Producto</th>
                <th className="hidden md:table-cell">Categoría</th>
                <th className="hidden lg:table-cell">Tienda</th>
                <th>Actualizado</th>
                <th>Stock</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center text-sm py-6">
                    No se encontraron productos sin inventario.
                  </td>
                </tr>
              )}
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="font-medium">{product.product.name}</td>
                  <td className="hidden md:table-cell">
                    {product.product.category ?? 'Sin categoría'}
                  </td>
                  <td className="hidden lg:table-cell">{product.store.name}</td>
                  <td>{formatDate(product.updatedAt)}</td>
                  <td>
                    <span className="badge badge-outline">{product.stock}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </article>
  );
}
