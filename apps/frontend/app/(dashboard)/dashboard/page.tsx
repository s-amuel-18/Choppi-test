const metricCards = [
  {
    label: 'Total de productos',
    value: '1,245',
    helper: 'Catálogo activo',
    trend: '+12% vs. mes anterior',
  },
  {
    label: 'Productos sin inventario',
    value: '38',
    helper: 'Pendientes de reposición',
    trend: '-4% vs. mes anterior',
  },
  {
    label: 'Total de tiendas',
    value: '24',
    helper: 'Operando actualmente',
    trend: '+2 nuevas esta semana',
  },
  {
    label: 'Tiendas inactivas',
    value: '3',
    helper: 'En proceso de verificación',
    trend: 'Sin cambios',
  },
];

const topStores = [
  {
    name: 'Choppi Centro',
    status: 'Activa',
    products: 320,
    inventory: 1540,
  },
  {
    name: 'Choppi Norte',
    status: 'Activa',
    products: 287,
    inventory: 1210,
  },
  {
    name: 'Choppi Express',
    status: 'Inactiva',
    products: 105,
    inventory: 0,
  },
  {
    name: 'Choppi Premium',
    status: 'Activa',
    products: 198,
    inventory: 890,
  },
];

const productsWithoutInventory = [
  {
    name: 'Audífonos inalámbricos Wave',
    sku: 'SKU-92831',
    category: 'Electrónica',
    store: 'Choppi Express',
    daysWithoutStock: 5,
  },
  {
    name: 'Cafetera Barista Pro',
    sku: 'SKU-62410',
    category: 'Electrodomésticos',
    store: 'Choppi Centro',
    daysWithoutStock: 2,
  },
  {
    name: 'Licuadora FitMix',
    sku: 'SKU-51077',
    category: 'Hogar',
    store: 'Choppi Norte',
    daysWithoutStock: 7,
  },
  {
    name: 'Monitor 27" QHD',
    sku: 'SKU-78142',
    category: 'Electrónica',
    store: 'Choppi Premium',
    daysWithoutStock: 1,
  },
  {
    name: 'Silla ergonómica Air',
    sku: 'SKU-33421',
    category: 'Muebles',
    store: 'Choppi Express',
    daysWithoutStock: 9,
  },
];

export default async function DashboardPage() {
  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm text-base-content/60">Resumen general</p>
        <h1 className="text-3xl font-semibold text-base-content">Dashboard</h1>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metricCards.map((metric) => (
          <article
            key={metric.label}
            className="card bg-base-100 shadow-md border border-base-200"
          >
            <div className="card-body p-5">
              <p className="text-sm uppercase tracking-wide text-base-content/60">
                {metric.label}
              </p>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-semibold">{metric.value}</span>
                <span className="badge badge-primary badge-outline text-xs">
                  {metric.helper}
                </span>
              </div>
              <p className="text-xs text-base-content/70">{metric.trend}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="card bg-base-100 shadow-md border border-base-200">
          <div className="card-body p-0">
            <div className="flex items-center justify-between px-6 py-4 border-b border-base-200">
              <div>
                <h2 className="card-title text-base-content">
                  Tiendas destacadas
                </h2>
                <p className="text-sm text-base-content/60">
                  Primeras 4 tiendas registradas recientemente
                </p>
              </div>
              <span className="badge badge-secondary badge-outline">Top 4</span>
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
                  {topStores.map((store) => (
                    <tr key={store.name}>
                      <td className="font-medium">{store.name}</td>
                      <td className="hidden sm:table-cell">
                        <span
                          className={`badge ${
                            store.status === 'Activa'
                              ? 'badge-success badge-outline'
                              : 'badge-error badge-outline'
                          }`}
                        >
                          {store.status}
                        </span>
                      </td>
                      <td>{store.products}</td>
                      <td>{store.inventory.toLocaleString('es-PE')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </article>

        <article className="card bg-base-100 shadow-md border border-base-200">
          <div className="card-body p-0">
            <div className="flex items-center justify-between px-6 py-4 border-b border-base-200">
              <div>
                <h2 className="card-title text-base-content">
                  Productos sin inventario
                </h2>
                <p className="text-sm text-base-content/60">
                  Últimos avisos de stock agotado en tiendas
                </p>
              </div>
              <span className="badge badge-error badge-outline">
                Atención
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th className="hidden md:table-cell">Categoría</th>
                    <th className="hidden lg:table-cell">Tienda</th>
                    <th>Días sin stock</th>
                  </tr>
                </thead>
                <tbody>
                  {productsWithoutInventory.map((product) => (
                    <tr key={product.sku}>
                      <td>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-xs text-base-content/60">
                            {product.sku}
                          </p>
                        </div>
                      </td>
                      <td className="hidden md:table-cell">{product.category}</td>
                      <td className="hidden lg:table-cell">{product.store}</td>
                      <td>
                        <span className="badge badge-outline">
                          {product.daysWithoutStock} días
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
