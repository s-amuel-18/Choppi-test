import { ApiProperty } from '@nestjs/swagger';

export class StoreResponseDto {
  @ApiProperty({
    description: 'ID único de la tienda',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Nombre de la tienda',
    example: 'Tienda Central',
  })
  name: string;

  @ApiProperty({
    description: 'Descripción de la tienda',
    example: 'Tienda principal ubicada en el centro de la ciudad',
    nullable: true,
  })
  description: string | null;

  @ApiProperty({
    description: 'Dirección de la tienda',
    example: 'Av. Principal 123, Ciudad',
  })
  address: string;

  @ApiProperty({
    description: 'Teléfono de contacto',
    example: '+1234567890',
  })
  phone: string;

  @ApiProperty({
    description: 'Correo electrónico de contacto',
    example: 'contacto@tienda.com',
  })
  email: string;

  @ApiProperty({
    description: 'Indica si la tienda está activa',
    example: true,
  })
  isActive: boolean;

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

