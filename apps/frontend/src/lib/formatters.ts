


export function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return '0';
  }

  return new Intl.NumberFormat('es-PE').format(value);
}

export function formatPrice(price: number | null | undefined): string {
  if (price === null || price === undefined) {
    return '';
  }
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(price);
}

export function formatDate(value: string | Date): string {
  const date = typeof value === 'string' ? new Date(value) : value;

  return new Intl.DateTimeFormat('es-PE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}
