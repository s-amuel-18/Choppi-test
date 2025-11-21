import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({
    description: 'Token de acceso JWT',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3OC05MGFiLWNkZWYtMTIzNC01Njc4OTBhYmNkZWYiLCJlbWFpbCI6InVzdWFyaW9AZXhhbXBsZS5jb20iLCJpYXQiOjE2MTYyMzkwMjIsImV4cCI6MTYxNjMyNTQyMn0.example',
  })
  accessToken: string;

  @ApiProperty({
    description: 'Información del usuario autenticado',
    type: 'object',
    properties: {
      id: {
        type: 'string',
        format: 'uuid',
        example: '123e4567-e89b-12d3-a456-426614174000',
      },
      email: {
        type: 'string',
        example: 'usuario@example.com',
      },
      name: {
        type: 'string',
        example: 'Juan Pérez',
      },
    },
  })
  user: {
    id: string;
    email: string;
    name: string;
  };
}
