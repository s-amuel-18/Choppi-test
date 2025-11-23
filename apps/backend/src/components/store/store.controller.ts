import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  HttpStatus,
  ParseUUIDPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { StoreService } from './store.service';
import { GetStoresQueryDto } from './dto/get-stores-query.dto';
import { PaginatedStoreResponseDto } from './dto/paginated-store-response.dto';
import { StoreResponseDto } from './dto/store-response.dto';
import { CreateStoreDto } from './dto/create-store.dto';

@ApiTags('stores')
@Controller('stores')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar tiendas',
    description:
      'Obtiene una lista paginada de tiendas con opción de búsqueda por nombre. La búsqueda es case-insensitive y no distingue acentos ni signos de puntuación.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de tiendas obtenida exitosamente',
    type: PaginatedStoreResponseDto,
  })
  async findAll(@Query() queryDto: GetStoresQueryDto) {
    return await this.storeService.findAll(queryDto);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Crear una nueva tienda',
    description:
      'Crea una nueva tienda. Requiere autenticación JWT. El usuario autenticado será el propietario de la tienda.',
  })
  @ApiBody({
    type: CreateStoreDto,
    description: 'Datos de la tienda a crear',
    examples: {
      example1: {
        summary: 'Ejemplo de creación de tienda',
        value: {
          name: 'Tienda Central',
          description: 'Tienda principal ubicada en el centro',
          address: 'Av. Principal 123, Ciudad',
          phone: '+1234567890',
          email: 'contacto@tienda.com',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Tienda creada exitosamente',
    type: StoreResponseDto,
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
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'No autorizado - Se requiere token JWT válido',
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          example: 401,
        },
        message: {
          type: 'string',
          example: 'Unauthorized',
        },
      },
    },
  })
  async create(@Body() createStoreDto: CreateStoreDto, @Request() req: any) {
    return await this.storeService.create(createStoreDto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener detalles de una tienda',
    description:
      'Obtiene los detalles de una tienda específica por su ID (UUID).',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único de la tienda (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Detalles de la tienda obtenidos exitosamente',
    type: StoreResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Tienda no encontrada',
  })
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.storeService.findOne(id);
  }
}
