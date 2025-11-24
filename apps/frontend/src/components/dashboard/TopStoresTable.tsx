import { DashboardTopStore } from '@/src/types/dashboard';
import { formatNumber } from '@/src/lib/formatters';

interface TopStoresTableProps {
  stores: DashboardTopStore[];
}

export default function TopStoresTable({ stores }: TopStoresTableProps) {
  return (
    <article className="card bg-base-100 shadow-md border border-base-200">
      <div className="card-body p-0">
        <div className="flex items-center justify-between px-6 py-4 border-b border-base-200">
          <div>
            <h2 className="card-title text-base-content">Últimas tiendas</h2>
            <p className="text-sm text-base-content/60">
              Se muestran las últimas 4 tiendas registradas con su inventario
              asociado
            </p>
          </div>
          <span className="badge badge-secondary badge-outline">
            {stores.length} resultados
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>Nombre</th>
                <th className="hidden sm:table-cell">Estado</th>
                <th>Productos</th>
                <th>Inventario</th>
              </tr>
            </thead>
            <tbody>
              {stores.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center text-sm py-6">
                    No hay tiendas registradas aún.
                  </td>
                </tr>
              )}
              {stores.map((store) => (
                <tr key={store.id}>
                  <td className="font-medium">{store.name}</td>
                  <td className="hidden sm:table-cell">
                    <span
                      className={`badge ${
                        store.isActive
                          ? 'badge-success badge-outline'
                          : 'badge-error badge-outline'
                      }`}
                    >
                      {store.isActive ? 'Activa' : 'Inactiva'}
                    </span>
                  </td>
                  <td>{store.totalProducts}</td>
                  <td>{formatNumber(store.totalInventory)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </article>
  );
}
