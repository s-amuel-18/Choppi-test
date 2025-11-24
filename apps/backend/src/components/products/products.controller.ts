import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Query,
  Param,
  HttpStatus,
  ParseUUIDPipe,
  UseGuards,
  DefaultValuePipe,
  ParseIntPipe,
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
  ApiNotFoundResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateStoreProductDto } from './dto/create-store-product.dto';
import { UpdateStoreProductDto } from './dto/update-store-product.dto';
import { GetStoreProductsQueryDto } from './dto/get-store-products-query.dto';
import { GetProductsQueryDto } from './dto/get-products-query.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { StoreProductResponseDto } from './dto/store-product-response.dto';
import { PaginatedProductResponseDto } from './dto/paginated-product-response.dto';
import { PaginatedStoreProductResponseDto } from './dto/paginated-store-product-response.dto';
import { OutOfStockProductResponseDto } from './dto/out-of-stock-product-response.dto';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar productos',
    description:
      'Obtiene una lista paginada de productos con opción de búsqueda por nombre y descripción.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número de página',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Cantidad de elementos por página',
    example: 10,
  })
  @ApiQuery({
    name: 'q',
    required: false,
    type: String,
    description: 'Término de búsqueda (busca en nombre y descripción)',
    example: 'laptop',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de productos obtenida exitosamente',
    type: PaginatedProductResponseDto,
  })
  async findAll(@Query() queryDto: GetProductsQueryDto) {
    return await this.productsService.findAll(queryDto);
  }

  @Get('out-of-stock')
  @ApiOperation({
    summary: 'Listar productos sin inventario',
    description:
      'Devuelve los registros de producto-tienda cuyo stock es cero, ordenados por actualización reciente.',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Número máximo de registros (máximo 20)',
    example: 5,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: OutOfStockProductResponseDto,
    isArray: true,
    description: 'Lista de productos sin inventario obtenida exitosamente',
  })
  async getProductsWithoutInventory(
    @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit: number,
  ) {
    return await this.productsService.getProductsWithoutInventory(limit);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener producto por ID',
    description:
      'Obtiene los detalles de un producto específico por su ID (UUID).',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del producto (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Producto obtenido exitosamente',
    type: ProductResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Producto no encontrado',
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          example: 404,
        },
        message: {
          type: 'string',
          example:
            'Producto con ID 123e4567-e89b-12d3-a456-426614174000 no encontrado',
        },
        error: {
          type: 'string',
          example: 'Not Found',
        },
      },
    },
  })
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.productsService.findOne(id);
  }

  @Get(':id/stores')
  @ApiOperation({
    summary: 'Obtener tiendas donde está disponible un producto',
    description:
      'Obtiene la lista de tiendas donde está disponible un producto, incluyendo stock y precio por tienda.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del producto (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de tiendas obtenida exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          example: true,
        },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                example: '123e4567-e89b-12d3-a456-426614174000',
              },
              storeId: {
                type: 'string',
                example: '123e4567-e89b-12d3-a456-426614174000',
              },
              storeName: {
                type: 'string',
                example: 'Tienda Central',
              },
              storeAddress: {
                type: 'string',
                example: 'Av. Principal 123',
              },
              storeEmail: {
                type: 'string',
                example: 'central@tienda.com',
              },
              stock: {
                type: 'number',
                example: 50,
              },
              storePrice: {
                type: 'number',
                nullable: true,
                example: 1199.99,
              },
              createdAt: {
                type: 'string',
                example: '2024-01-01T00:00:00.000Z',
              },
              updatedAt: {
                type: 'string',
                example: '2024-01-01T00:00:00.000Z',
              },
            },
          },
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Producto no encontrado',
  })
  async getProductStores(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.productsService.getProductStores(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Crear un nuevo producto',
    description: 'Crea un nuevo producto. Requiere autenticación JWT.',
  })
  @ApiBody({
    type: CreateProductDto,
    description: 'Datos del producto a crear',
    examples: {
      example1: {
        summary: 'Ejemplo de creación de producto',
        value: {
          name: 'Laptop Dell XPS 15',
          description:
            'Laptop de alto rendimiento con pantalla 4K y procesador Intel i7',
          originalPrice: 1299.99,
          category: 'Electrónica',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Producto creado exitosamente',
    type: ProductResponseDto,
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
  async create(@Body() createProductDto: CreateProductDto) {
    return await this.productsService.create(createProductDto);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Actualizar un producto',
    description:
      'Actualiza los datos de un producto existente. Requiere autenticación JWT. Solo se actualizan los campos proporcionados.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del producto (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @ApiBody({
    type: UpdateProductDto,
    description:
      'Datos del producto a actualizar (todos los campos son opcionales)',
    examples: {
      example1: {
        summary: 'Actualizar nombre y precio',
        value: {
          name: 'Laptop Dell XPS 15 Actualizada',
          originalPrice: 1199.99,
        },
      },
      example2: {
        summary: 'Actualizar solo la descripción',
        value: {
          description: 'Nueva descripción del producto',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Producto actualizado exitosamente',
    type: ProductResponseDto,
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
  @ApiNotFoundResponse({
    description: 'Producto no encontrado',
  })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return await this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Eliminar un producto',
    description:
      'Elimina un producto existente. Requiere autenticación JWT. Esta acción también eliminará todas las relaciones del producto con las tiendas. Esta acción no se puede deshacer.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del producto (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Producto eliminado exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          example: true,
        },
        message: {
          type: 'string',
          example: 'Producto eliminado exitosamente',
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
  @ApiNotFoundResponse({
    description: 'Producto no encontrado',
  })
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.productsService.remove(id);
    return {
      success: true,
      message: 'Producto eliminado exitosamente',
    };
  }
}

@ApiTags('stores')
@Controller('stores')
export class StoreProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post(':id/products')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Agregar producto a tienda',
    description:
      'Agrega un producto existente a una tienda con stock y precio opcional. Requiere autenticación JWT.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único de la tienda (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @ApiBody({
    type: CreateStoreProductDto,
    description: 'Datos del producto a agregar a la tienda',
    examples: {
      example1: {
        summary: 'Agregar producto con stock y precio',
        value: {
          productId: '123e4567-e89b-12d3-a456-426614174000',
          stock: 50,
          storePrice: 1199.99,
        },
      },
      example2: {
        summary: 'Agregar producto solo con stock',
        value: {
          productId: '123e4567-e89b-12d3-a456-426614174000',
          stock: 25,
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Producto agregado a la tienda exitosamente',
    type: StoreProductResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Datos de entrada inválidos',
  })
  @ApiUnauthorizedResponse({
    description: 'No autorizado - Se requiere token JWT válido',
  })
  @ApiNotFoundResponse({
    description: 'Tienda o producto no encontrado',
  })
  @ApiConflictResponse({
    description: 'El producto ya está asociado a esta tienda',
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          example: 409,
        },
        message: {
          type: 'string',
          example: 'El producto ya está asociado a esta tienda',
        },
        error: {
          type: 'string',
          example: 'Conflict',
        },
      },
    },
  })
  async addProductToStore(
    @Param('id', new ParseUUIDPipe()) storeId: string,
    @Body() createStoreProductDto: CreateStoreProductDto,
  ) {
    return await this.productsService.addProductToStore(
      storeId,
      createStoreProductDto,
    );
  }

  @Get(':id/products')
  @ApiOperation({
    summary: 'Listar productos de una tienda',
    description:
      'Obtiene una lista paginada de productos de una tienda con opción de búsqueda y filtros.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único de la tienda (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número de página',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Cantidad de elementos por página',
    example: 10,
  })
  @ApiQuery({
    name: 'q',
    required: false,
    type: String,
    description: 'Término de búsqueda (busca en nombre y descripción)',
    example: 'laptop',
  })
  @ApiQuery({
    name: 'inStock',
    required: false,
    type: Boolean,
    description: 'Filtrar solo productos en stock',
    example: true,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de productos obtenida exitosamente',
    type: PaginatedStoreProductResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Tienda no encontrada',
  })
  async getStoreProducts(
    @Param('id', new ParseUUIDPipe()) storeId: string,
    @Query() queryDto: GetStoreProductsQueryDto,
  ) {
    return await this.productsService.getStoreProducts(storeId, queryDto);
  }

  @Put(':id/products/:storeProductId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Actualizar producto de tienda',
    description:
      'Actualiza el stock y/o precio de un producto en una tienda. Requiere autenticación JWT.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único de la tienda (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @ApiParam({
    name: 'storeProductId',
    description: 'ID único del producto en la tienda (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @ApiBody({
    type: UpdateStoreProductDto,
    description: 'Datos a actualizar (todos los campos son opcionales)',
    examples: {
      example1: {
        summary: 'Actualizar stock y precio',
        value: {
          stock: 75,
          storePrice: 1099.99,
        },
      },
      example2: {
        summary: 'Actualizar solo stock',
        value: {
          stock: 100,
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Producto de tienda actualizado exitosamente',
    type: StoreProductResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Datos de entrada inválidos',
  })
  @ApiUnauthorizedResponse({
    description: 'No autorizado - Se requiere token JWT válido',
  })
  @ApiNotFoundResponse({
    description: 'Tienda o producto de tienda no encontrado',
  })
  async updateStoreProduct(
    @Param('id', new ParseUUIDPipe()) storeId: string,
    @Param('storeProductId', new ParseUUIDPipe()) storeProductId: string,
    @Body() updateStoreProductDto: UpdateStoreProductDto,
  ) {
    return await this.productsService.updateStoreProduct(
      storeId,
      storeProductId,
      updateStoreProductDto,
    );
  }

  @Delete(':id/products/:storeProductId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Eliminar producto de tienda',
    description:
      'Elimina un producto de una tienda. Requiere autenticación JWT. Esta acción no se puede deshacer.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único de la tienda (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @ApiParam({
    name: 'storeProductId',
    description: 'ID único del producto en la tienda (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Producto eliminado de la tienda exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          example: true,
        },
        message: {
          type: 'string',
          example: 'Producto eliminado de la tienda exitosamente',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'No autorizado - Se requiere token JWT válido',
  })
  @ApiNotFoundResponse({
    description: 'Tienda o producto de tienda no encontrado',
  })
  async removeProductFromStore(
    @Param('id', new ParseUUIDPipe()) storeId: string,
    @Param('storeProductId', new ParseUUIDPipe()) storeProductId: string,
  ) {
    await this.productsService.removeProductFromStore(storeId, storeProductId);
    return {
      message: 'Producto eliminado de la tienda exitosamente',
    };
  }
}
