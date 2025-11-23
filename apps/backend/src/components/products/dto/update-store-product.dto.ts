import {
  IsNumber,
  IsOptional,
  Min,
  IsInt,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UpdateStoreProductDto {
  @ApiProperty({
    description: 'Cantidad de stock disponible',
    example: 75,
    required: false,
    minimum: 0,
    type: Number,
  })
  @IsOptional()
  @IsInt({ message: 'El stock debe ser un número entero' })
  @Min(0, { message: 'El stock debe ser mayor o igual a 0' })
  @Type(() => Number)
  stock?: number;

  @ApiProperty({
    description: 'Precio del producto en esta tienda',
    example: 1099.99,
    required: false,
    nullable: true,
    minimum: 0,
    type: Number,
  })
  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'El precio de tienda debe ser un número con máximo 2 decimales' },
  )
  @Min(0, { message: 'El precio de tienda debe ser mayor o igual a 0' })
  @Type(() => Number)
  storePrice?: number | null;
}

