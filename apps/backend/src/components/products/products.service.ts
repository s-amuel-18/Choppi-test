import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Product } from './product.entity';
import { StoreProduct } from './store-product.entity';
import { Store } from '../store/store.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateStoreProductDto } from './dto/create-store-product.dto';
import { UpdateStoreProductDto } from './dto/update-store-product.dto';
import { GetStoreProductsQueryDto } from './dto/get-store-products-query.dto';
import { GetProductsQueryDto } from './dto/get-products-query.dto';
import { PaginatedStoreProductResponseDto } from './dto/paginated-store-product-response.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(StoreProduct)
    private readonly storeProductRepository: Repository<StoreProduct>,
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
  ) {}

  /**
   * Normaliza un texto removiendo acentos y convirtiéndolo a minúsculas
   */
  private normalizeText(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remueve diacríticos (acentos)
      .replace(/[^\w\s]/g, ''); // Remueve signos de puntuación
  }

  /**
   * Obtiene todos los productos con paginación y búsqueda
   */
  async findAll(queryDto: GetProductsQueryDto): Promise<{
    data: Product[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { page = 1, limit = 10, q } = queryDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.productRepository.createQueryBuilder('product');

    // Aplicar filtro de búsqueda si existe
    if (q) {
      queryBuilder.where(
        `(product.name ILIKE :search OR product.description ILIKE :search)`,
        { search: `%${q}%` },
      );
    }

    // Obtener total de registros
    const total = await queryBuilder.getCount();

    // Aplicar paginación y ordenar por fecha de creación (más recientes primero)
    const products = await queryBuilder
      .orderBy('product.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getMany();

    const totalPages = Math.ceil(total / limit);

    return {
      data: products,
      total,
      page,
      limit,
      totalPages,
    };
  }

  /**
   * Obtiene un producto por su ID
   */
  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    return product;
  }

  /**
   * Crea un nuevo producto
   */
  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto);
    return await this.productRepository.save(product);
  }

  /**
   * Actualiza un producto existente
   */
  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.findOne(id);

    // Actualizar solo los campos proporcionados
    if (updateProductDto.name !== undefined) {
      product.name = updateProductDto.name;
    }

    if (updateProductDto.description !== undefined) {
      product.description = updateProductDto.description;
    }

    if (updateProductDto.originalPrice !== undefined) {
      product.originalPrice = updateProductDto.originalPrice;
    }

    if (updateProductDto.category !== undefined) {
      product.category = updateProductDto.category;
    }

    return await this.productRepository.save(product);
  }

  /**
   * Agrega un producto a una tienda
   */
  async addProductToStore(
    storeId: string,
    createStoreProductDto: CreateStoreProductDto,
  ): Promise<StoreProduct> {
    // Verificar que la tienda existe
    const store = await this.storeRepository.findOne({
      where: { id: storeId },
    });

    if (!store) {
      throw new NotFoundException(`Tienda con ID ${storeId} no encontrada`);
    }

    // Verificar que el producto existe
    const product = await this.productRepository.findOne({
      where: { id: createStoreProductDto.productId },
    });

    if (!product) {
      throw new NotFoundException(
        `Producto con ID ${createStoreProductDto.productId} no encontrado`,
      );
    }

    // Verificar que el producto no esté ya en la tienda
    const existingStoreProduct = await this.storeProductRepository.findOne({
      where: {
        storeId,
        productId: createStoreProductDto.productId,
      },
    });

    if (existingStoreProduct) {
      throw new ConflictException('El producto ya está asociado a esta tienda');
    }

    // Crear la asociación
    const storeProduct = this.storeProductRepository.create({
      storeId,
      productId: createStoreProductDto.productId,
      stock: createStoreProductDto.stock,
      storePrice: createStoreProductDto.storePrice ?? null,
    });

    const savedStoreProduct =
      await this.storeProductRepository.save(storeProduct);

    // Cargar la relación con el producto
    return await this.storeProductRepository.findOne({
      where: { id: savedStoreProduct.id },
      relations: ['product'],
    });
  }

  /**
   * Obtiene los productos de una tienda con paginación, búsqueda y filtros
   */
  async getStoreProducts(
    storeId: string,
    queryDto: GetStoreProductsQueryDto,
  ): Promise<PaginatedStoreProductResponseDto> {
    // Verificar que la tienda existe
    const store = await this.storeRepository.findOne({
      where: { id: storeId },
    });

    if (!store) {
      throw new NotFoundException(`Tienda con ID ${storeId} no encontrada`);
    }

    const { page = 1, limit = 10, q, inStock } = queryDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.storeProductRepository
      .createQueryBuilder('storeProduct')
      .leftJoinAndSelect('storeProduct.product', 'product')
      .where('storeProduct.storeId = :storeId', { storeId });

    // Aplicar filtro de búsqueda si existe
    if (q) {
      queryBuilder.andWhere(
        `(product.name ILIKE :search OR product.description ILIKE :search)`,
        { search: `%${q}%` },
      );
    }

    // Aplicar filtro de stock si existe
    if (inStock === true) {
      queryBuilder.andWhere('storeProduct.stock > 0');
    }

    // Obtener total de registros
    const total = await queryBuilder.getCount();

    // Aplicar paginación y ordenar por fecha de creación del producto (más recientes primero)
    const storeProducts = await queryBuilder
      .orderBy('product.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getMany();

    const totalPages = Math.ceil(total / limit);

    return {
      data: storeProducts,
      meta: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  /**
   * Actualiza un producto de tienda
   */
  async updateStoreProduct(
    storeId: string,
    storeProductId: string,
    updateStoreProductDto: UpdateStoreProductDto,
  ): Promise<StoreProduct> {
    // Verificar que la tienda existe
    const store = await this.storeRepository.findOne({
      where: { id: storeId },
    });

    if (!store) {
      throw new NotFoundException(`Tienda con ID ${storeId} no encontrada`);
    }

    // Buscar el producto de la tienda
    const storeProduct = await this.storeProductRepository.findOne({
      where: {
        id: storeProductId,
        storeId,
      },
      relations: ['product'],
    });

    if (!storeProduct) {
      throw new NotFoundException(
        `Producto de tienda con ID ${storeProductId} no encontrado en la tienda ${storeId}`,
      );
    }

    // Actualizar solo los campos proporcionados
    if (updateStoreProductDto.stock !== undefined) {
      storeProduct.stock = updateStoreProductDto.stock;
    }

    if (updateStoreProductDto.storePrice !== undefined) {
      storeProduct.storePrice = updateStoreProductDto.storePrice;
    }

    return await this.storeProductRepository.save(storeProduct);
  }

  /**
   * Elimina un producto de una tienda
   */
  async removeProductFromStore(
    storeId: string,
    storeProductId: string,
  ): Promise<void> {
    // Verificar que la tienda existe
    const store = await this.storeRepository.findOne({
      where: { id: storeId },
    });

    if (!store) {
      throw new NotFoundException(`Tienda con ID ${storeId} no encontrada`);
    }

    // Buscar el producto de la tienda
    const storeProduct = await this.storeProductRepository.findOne({
      where: {
        id: storeProductId,
        storeId,
      },
    });

    if (!storeProduct) {
      throw new NotFoundException(
        `Producto de tienda con ID ${storeProductId} no encontrado en la tienda ${storeId}`,
      );
    }

    await this.storeProductRepository.remove(storeProduct);
  }

  /**
   * Elimina un producto existente
   * También elimina todas las relaciones con tiendas (store_products)
   */
  async remove(id: string): Promise<void> {
    const product = await this.findOne(id);

    // Eliminar todas las relaciones con tiendas primero
    await this.storeProductRepository.delete({
      productId: id,
    });

    // Eliminar el producto
    await this.productRepository.remove(product);
  }
}
