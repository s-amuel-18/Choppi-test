import { dashboardService } from '@/src/services/dashboard.service';
import { formatNumber } from '@/src/lib/formatters';
import MetricCard from '@/src/components/dashboard/MetricCard';
import TopStoresTable from '@/src/components/dashboard/TopStoresTable';
import OutOfStockTable from '@/src/components/dashboard/OutOfStockTable';

export default async function DashboardPage() {
  const { summary, topStores, outOfStockProducts } =
    await dashboardService.getAllDashboardData();

  const metricCards: Array<{ label: string; value: string }> = [
    {
      label: 'Total de productos',
      value: formatNumber(summary.totalProducts),
    },
    {
      label: 'Productos sin inventario',
      value: formatNumber(summary.outOfStockProducts),
    },
    {
      label: 'Total de tiendas',
      value: formatNumber(summary.totalStores),
    },
    {
      label: 'Tiendas inactivas',
      value: formatNumber(summary.inactiveStores),
    },
  ];

  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm text-base-content/60">Resumen general</p>
        <h1 className="text-3xl font-semibold text-base-content">Dashboard</h1>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metricCards.map((metric) => (
          <MetricCard
            key={metric.label}
            label={metric.label}
            value={metric.value}
          />
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <TopStoresTable stores={topStores} />
        <OutOfStockTable products={outOfStockProducts} />
      </section>
    </div>
  );
}
