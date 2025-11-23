import { ApiProperty } from '@nestjs/swagger';

export class ProductResponseDto {
  @ApiProperty({
    description: 'ID único del producto',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Nombre del producto',
    example: 'Laptop Dell XPS 15',
  })
  name: string;

  @ApiProperty({
    description: 'Descripción del producto',
    example: 'Laptop de alto rendimiento con pantalla 4K',
    nullable: true,
  })
  description: string | null;

  @ApiProperty({
    description: 'Precio original del producto',
    example: 1299.99,
    type: Number,
  })
  originalPrice: number;

  @ApiProperty({
    description: 'Categoría del producto',
    example: 'Electrónica',
    nullable: true,
  })
  category: string | null;

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
}

