import { ApiProperty } from '@nestjs/swagger';
import { StoreProductResponseDto } from './store-product-response.dto';

class PaginationMeta {
  @ApiProperty({
    description: 'Número de página actual',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Cantidad de elementos por página',
    example: 10,
  })
  limit: number;

  @ApiProperty({
    description: 'Total de elementos',
    example: 100,
  })
  total: number;

  @ApiProperty({
    description: 'Total de páginas',
    example: 10,
  })
  totalPages: number;
}

export class PaginatedStoreProductResponseDto {
  @ApiProperty({
    description: 'Lista de productos de la tienda',
    type: [StoreProductResponseDto],
  })
  data: StoreProductResponseDto[];

  @ApiProperty({
    description: 'Información de paginación',
    type: PaginationMeta,
  })
  meta: PaginationMeta;
}

