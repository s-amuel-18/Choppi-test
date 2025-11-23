import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
  IsInt,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateStoreProductDto {
  @ApiProperty({
    description: 'ID del producto a agregar a la tienda',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @IsNotEmpty({ message: 'El ID del producto es requerido' })
  @IsUUID('4', { message: 'El ID del producto debe ser un UUID válido' })
  productId: string;

  @ApiProperty({
    description: 'Cantidad de stock disponible',
    example: 50,
    minimum: 0,
    type: Number,
  })
  @IsNotEmpty({ message: 'El stock es requerido' })
  @IsInt({ message: 'El stock debe ser un número entero' })
  @Min(0, { message: 'El stock debe ser mayor o igual a 0' })
  @Type(() => Number)
  stock: number;

  @ApiProperty({
    description: 'Precio del producto en esta tienda (opcional)',
    example: 1199.99,
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

