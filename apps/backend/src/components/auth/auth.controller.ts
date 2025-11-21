import { Controller, Post, Body, HttpStatus } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBadRequestResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { SignupResponseDto } from './dto/signup-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({
    summary: 'Registrar un nuevo usuario',
    description:
      'Crea una nueva cuenta de usuario. El email debe ser único y la contraseña debe cumplir con los requisitos de seguridad.',
  })
  @ApiBody({
    type: CreateUserDto,
    description: 'Datos del usuario a registrar',
    examples: {
      example1: {
        summary: 'Ejemplo de registro',
        value: {
          email: 'usuario@example.com',
          name: 'Juan Pérez',
          password: 'Password123',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Usuario creado exitosamente',
    type: SignupResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Datos de entrada inválidos',
    schema: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          example: false,
        },
        message: {
          type: 'string',
          example: 'Error de validación',
        },
        errors: {
          type: 'array',
          items: {
            type: 'string',
          },
          example: [
            'El email debe tener un formato válido',
            'El nombre debe tener al menos 2 caracteres',
          ],
        },
      },
    },
  })
  @ApiConflictResponse({
    description: 'El email ya está en uso',
    schema: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          example: false,
        },
        message: {
          type: 'string',
          example: 'El email ya está en uso',
        },
        statusCode: {
          type: 'number',
          example: 409,
        },
      },
    },
  })
  async signup(@Body() createUserDto: CreateUserDto) {
    return await this.authService.signup(createUserDto);
  }
}
