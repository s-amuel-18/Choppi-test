interface MetricCardProps {
  label: string;
  value: string;
}

export default function MetricCard({ label, value }: MetricCardProps) {
  return (
    <article className="card bg-base-100 shadow-md border border-base-200">
      <div className="card-body p-5">
        <p className="text-sm uppercase tracking-wide text-base-content/60">
          {label}
        </p>
        <span className="text-3xl font-semibold">{value}</span>
      </div>
    </article>
  );
}
