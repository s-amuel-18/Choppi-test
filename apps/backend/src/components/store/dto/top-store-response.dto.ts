import { ApiProperty } from '@nestjs/swagger';

export class TopStoreResponseDto {
  @ApiProperty({
    description: 'ID de la tienda',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Nombre de la tienda',
    example: 'Choppi Centro',
  })
  name: string;

  @ApiProperty({
    description: 'Indica si la tienda está activa',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Cantidad de productos asociados a la tienda',
    example: 120,
  })
  totalProducts: number;

  @ApiProperty({
    description: 'Inventario total (suma de stock) de la tienda',
    example: 1540,
  })
  totalInventory: number;

  @ApiProperty({
    description: 'Fecha de creación de la tienda',
  })
  createdAt: Date;
}


