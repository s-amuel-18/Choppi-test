import {
  IsString,
  IsEmail,
  IsOptional,
  MinLength,
  MaxLength,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateStoreDto {
  @ApiProperty({
    description: 'Nombre de la tienda',
    example: 'Tienda Central Actualizada',
    minLength: 2,
    maxLength: 100,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(100, { message: 'El nombre no puede exceder 100 caracteres' })
  name?: string;

  @ApiProperty({
    description: 'Descripción de la tienda',
    example: 'Descripción actualizada de la tienda',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  description?: string | null;

  @ApiProperty({
    description: 'Dirección de la tienda',
    example: 'Av. Principal 456, Ciudad Actualizada',
    minLength: 5,
    maxLength: 200,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'La dirección debe ser una cadena de texto' })
  @MinLength(5, { message: 'La dirección debe tener al menos 5 caracteres' })
  @MaxLength(200, { message: 'La dirección no puede exceder 200 caracteres' })
  address?: string;

  @ApiProperty({
    description: 'Teléfono de contacto',
    example: '+9876543210',
    minLength: 10,
    maxLength: 20,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El teléfono debe ser una cadena de texto' })
  @MinLength(10, { message: 'El teléfono debe tener al menos 10 caracteres' })
  @MaxLength(20, { message: 'El teléfono no puede exceder 20 caracteres' })
  phone?: string;

  @ApiProperty({
    description: 'Correo electrónico de contacto',
    example: 'nuevo-contacto@tienda.com',
    format: 'email',
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: 'El email debe tener un formato válido' })
  email?: string;

  @ApiProperty({
    description: 'Indica si la tienda está activa',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'isActive debe ser un valor booleano' })
  isActive?: boolean;
}

