import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, LessThanOrEqual } from 'typeorm';
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
import { OutOfStockProductResponseDto } from './dto/out-of-stock-product-response.dto';

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

    if (q) {
      queryBuilder.where(
        `(product.name ILIKE :search OR product.description ILIKE :search)`,
        { search: `%${q}%` },
      );
    }

    const total = await queryBuilder.getCount();

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

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    return product;
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto);
    return await this.productRepository.save(product);
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.findOne(id);

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

  async addProductToStore(
    storeId: string,
    createStoreProductDto: CreateStoreProductDto,
  ): Promise<StoreProduct> {
    const store = await this.storeRepository.findOne({
      where: { id: storeId },
    });

    if (!store) {
      throw new NotFoundException(`Tienda con ID ${storeId} no encontrada`);
    }

    const product = await this.productRepository.findOne({
      where: { id: createStoreProductDto.productId },
    });

    if (!product) {
      throw new NotFoundException(
        `Producto con ID ${createStoreProductDto.productId} no encontrado`,
      );
    }

    const existingStoreProduct = await this.storeProductRepository.findOne({
      where: {
        storeId,
        productId: createStoreProductDto.productId,
      },
    });

    if (existingStoreProduct) {
      throw new ConflictException('El producto ya está asociado a esta tienda');
    }

    const storeProduct = this.storeProductRepository.create({
      storeId,
      productId: createStoreProductDto.productId,
      stock: createStoreProductDto.stock,
      storePrice: createStoreProductDto.storePrice ?? null,
      store,
      product,
    });

    const savedStoreProduct =
      await this.storeProductRepository.save(storeProduct);

    savedStoreProduct.store = store;
    savedStoreProduct.product = product;

    return savedStoreProduct;
  }

  async getStoreProducts(
    storeId: string,
    queryDto: GetStoreProductsQueryDto,
  ): Promise<PaginatedStoreProductResponseDto> {
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

    if (q) {
      queryBuilder.andWhere(
        `(product.name ILIKE :search OR product.description ILIKE :search)`,
        { search: `%${q}%` },
      );
    }

    if (inStock === true) {
      queryBuilder.andWhere('storeProduct.stock > 0');
    }

    const total = await queryBuilder.getCount();

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

  async getProductsWithoutInventory(
    limit: number = 5,
  ): Promise<OutOfStockProductResponseDto[]> {
    const normalizedLimit = this.normalizeLimit(limit, 20, 5);

    const storeProducts = await this.storeProductRepository.find({
      where: { stock: LessThanOrEqual(0) },
      relations: ['store', 'product'],
      order: { updatedAt: 'DESC' },
      take: normalizedLimit,
    });

    return storeProducts.map((storeProduct) => ({
      id: storeProduct.id,
      stock: storeProduct.stock,
      updatedAt: storeProduct.updatedAt,
      product: {
        id: storeProduct.product?.id ?? storeProduct.productId,
        name: storeProduct.product?.name ?? 'Producto sin nombre',
        category: storeProduct.product?.category ?? null,
      },
      store: {
        id: storeProduct.store?.id ?? storeProduct.storeId,
        name: storeProduct.store?.name ?? 'Tienda desconocida',
      },
    }));
  }

  async updateStoreProduct(
    storeId: string,
    storeProductId: string,
    updateStoreProductDto: UpdateStoreProductDto,
  ): Promise<StoreProduct> {
    const store = await this.storeRepository.findOne({
      where: { id: storeId },
    });

    if (!store) {
      throw new NotFoundException(`Tienda con ID ${storeId} no encontrada`);
    }

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

    if (updateStoreProductDto.stock !== undefined) {
      storeProduct.stock = updateStoreProductDto.stock;
    }

    if (updateStoreProductDto.storePrice !== undefined) {
      storeProduct.storePrice = updateStoreProductDto.storePrice;
    }

    return await this.storeProductRepository.save(storeProduct);
  }

  async removeProductFromStore(
    storeId: string,
    storeProductId: string,
  ): Promise<void> {
    const store = await this.storeRepository.findOne({
      where: { id: storeId },
    });

    if (!store) {
      throw new NotFoundException(`Tienda con ID ${storeId} no encontrada`);
    }

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

  async remove(id: string): Promise<void> {
    const product = await this.findOne(id);

    await this.storeProductRepository.delete({
      productId: id,
    });

    await this.productRepository.remove(product);
  }

  async getProductStores(productId: string): Promise<
    Array<{
      id: string;
      storeId: string;
      storeName: string;
      storeAddress: string;
      storeEmail: string;
      stock: number;
      storePrice: number | null;
      createdAt: Date;
      updatedAt: Date;
    }>
  > {
    const product = await this.findOne(productId);

    const storeProducts = await this.storeProductRepository.find({
      where: { productId },
      relations: ['store'],
      order: { createdAt: 'DESC' },
    });

    return storeProducts.map((sp) => ({
      id: sp.id,
      storeId: sp.storeId,
      storeName: sp.store?.name || 'Tienda desconocida',
      storeAddress: sp.store?.address || '',
      storeEmail: sp.store?.email || '',
      stock: sp.stock,
      storePrice: sp.storePrice,
      createdAt: sp.createdAt,
      updatedAt: sp.updatedAt,
    }));
  }

  private normalizeLimit(value: number, max: number, fallback: number): number {
    if (Number.isNaN(value) || value <= 0) {
      return fallback;
    }

    return Math.min(value, max);
  }
}
