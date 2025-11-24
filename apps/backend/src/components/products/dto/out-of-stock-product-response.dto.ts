import { ApiProperty } from '@nestjs/swagger';

class OutOfStockProductInfoDto {
  @ApiProperty({
    description: 'ID del producto',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Nombre del producto',
    example: 'Audífonos inalámbricos Wave',
  })
  name: string;

  @ApiProperty({
    description: 'Categoría del producto',
    example: 'Electrónica',
    nullable: true,
  })
  category: string | null;
}

class OutOfStockStoreInfoDto {
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
}

export class OutOfStockProductResponseDto {
  @ApiProperty({
    description: 'ID de la relación producto-tienda',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Stock actual del producto en la tienda',
    example: 0,
  })
  stock: number;

  @ApiProperty({
    description: 'Fecha de la última actualización de stock',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Información del producto',
    type: OutOfStockProductInfoDto,
  })
  product: OutOfStockProductInfoDto;

  @ApiProperty({
    description: 'Información de la tienda',
    type: OutOfStockStoreInfoDto,
  })
  store: OutOfStockStoreInfoDto;
}


