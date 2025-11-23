import { ApiProperty } from '@nestjs/swagger';
import { ProductResponseDto } from './product-response.dto';

export class StoreProductResponseDto {
  @ApiProperty({
    description: 'ID único del producto en la tienda',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'ID de la tienda',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  storeId: string;

  @ApiProperty({
    description: 'ID del producto',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  productId: string;

  @ApiProperty({
    description: 'Cantidad de stock disponible',
    example: 50,
    type: Number,
  })
  stock: number;

  @ApiProperty({
    description: 'Precio del producto en esta tienda',
    example: 1199.99,
    nullable: true,
    type: Number,
  })
  storePrice: number | null;

  @ApiProperty({
    description: 'Fecha de creación',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Información del producto',
    type: ProductResponseDto,
  })
  product: ProductResponseDto;
}

