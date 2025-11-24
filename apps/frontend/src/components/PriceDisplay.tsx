import { formatPrice } from '@/src/lib/formatters';

interface PriceDisplayProps {
  price: number | null | undefined;
  className?: string;
  showEmpty?: boolean;
  emptyText?: string;
}

export default function PriceDisplay({
  price,
  className = '',
  showEmpty = true,
  emptyText = 'Sin precio',
}: PriceDisplayProps) {
  if (price === null || price === undefined) {
    if (!showEmpty) return null;
    return (
      <span className={`text-base-content/50 ${className}`}>{emptyText}</span>
    );
  }

  return <span className={className}>{formatPrice(price)}</span>;
}

