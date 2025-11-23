import { ApiProperty } from '@nestjs/swagger';
import { StoreResponseDto } from './store-response.dto';

export class PaginatedStoreResponseDto {
  @ApiProperty({
    description: 'Lista de tiendas',
    type: [StoreResponseDto],
  })
  data: StoreResponseDto[];

  @ApiProperty({
    description: 'Total de registros encontrados',
    example: 50,
  })
  total: number;

  @ApiProperty({
    description: 'Página actual',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Límite de resultados por página',
    example: 10,
  })
  limit: number;

  @ApiProperty({
    description: 'Total de páginas',
    example: 5,
  })
  totalPages: number;
}

