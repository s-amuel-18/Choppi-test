import {
  IsString,
  IsOptional,
  IsNumber,
  MinLength,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UpdateProductDto {
  @ApiProperty({
    description: 'Nombre del producto',
    example: 'Laptop Dell XPS 15',
    required: false,
    minLength: 2,
    maxLength: 255,
  })
  @IsOptional()
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(255, { message: 'El nombre no puede exceder 255 caracteres' })
  name?: string;

  @ApiProperty({
    description: 'Descripción del producto',
    example: 'Laptop de alto rendimiento con pantalla 4K',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  description?: string | null;

  @ApiProperty({
    description: 'Precio original del producto',
    example: 1299.99,
    required: false,
    minimum: 0,
    type: Number,
  })
  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'El precio original debe ser un número con máximo 2 decimales' },
  )
  @Min(0, { message: 'El precio original debe ser mayor o igual a 0' })
  @Type(() => Number)
  originalPrice?: number;

  @ApiProperty({
    description: 'Categoría del producto',
    example: 'Electrónica',
    required: false,
    nullable: true,
    maxLength: 100,
  })
  @IsOptional()
  @IsString({ message: 'La categoría debe ser una cadena de texto' })
  @MaxLength(100, { message: 'La categoría no puede exceder 100 caracteres' })
  category?: string | null;
}

