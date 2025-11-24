import { ApiProperty } from '@nestjs/swagger';

export class StoreDashboardSummaryDto {
  @ApiProperty({
    description: 'Cantidad total de productos registrados',
    example: 1245,
  })
  totalProducts: number;

  @ApiProperty({
    description: 'Cantidad total de tiendas registradas',
    example: 24,
  })
  totalStores: number;

  @ApiProperty({
    description: 'Cantidad de tiendas con estado inactivo',
    example: 3,
  })
  inactiveStores: number;

  @ApiProperty({
    description:
      'Cantidad de registros producto-tienda que actualmente no tienen stock',
    example: 12,
  })
  outOfStockProducts: number;
}


