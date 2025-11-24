import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from './store.entity';
import { GetStoresQueryDto } from './dto/get-stores-query.dto';
import { PaginatedStoreResponseDto } from './dto/paginated-store-response.dto';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { StoreProduct } from '../products/store-product.entity';
import { Product } from '../products/product.entity';
import { StoreDashboardSummaryDto } from './dto/store-dashboard-summary.dto';
import { TopStoreResponseDto } from './dto/top-store-response.dto';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
    @InjectRepository(StoreProduct)
    private readonly storeProductRepository: Repository<StoreProduct>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
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
   * Busca tiendas con paginación y filtro de búsqueda
   */
  async findAll(
    queryDto: GetStoresQueryDto,
  ): Promise<PaginatedStoreResponseDto> {
    const { page = 1, limit = 10, q } = queryDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.storeRepository.createQueryBuilder('store');

    // Aplicar filtro de búsqueda si existe
    if (q) {
      const normalizedQuery = this.normalizeText(q);

      // Usar una función SQL que normalice el texto removiendo acentos y signos de puntuación
      // Esto funciona con PostgreSQL usando translate() y regexp_replace()
      queryBuilder.where(
        `LOWER(REGEXP_REPLACE(TRANSLATE(store.name, 'áàäâéèëêíìïîóòöôúùüûñÁÀÄÂÉÈËÊÍÌÏÎÓÒÖÔÚÙÜÛÑ', 'aaaaeeeeiiiioooouuuunAAAAEEEEIIIIOOOOUUUUN'), '[^a-zA-Z0-9 ]', '', 'g')) LIKE :search`,
        { search: `%${normalizedQuery}%` },
      );
    }

    // Obtener total de registros
    const total = await queryBuilder.getCount();

    // Aplicar paginación y ordenar por fecha de creación (más recientes primero)
    const stores = await queryBuilder
      .orderBy('store.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getMany();

    const totalPages = Math.ceil(total / limit);

    return {
      data: stores,
      total,
      page,
      limit,
      totalPages,
    };
  }

  /**
   * Busca una tienda por su ID
   */
  async findOne(id: string): Promise<Store> {
    const store = await this.storeRepository.findOne({
      where: { id },
    });

    if (!store) {
      throw new NotFoundException(`Tienda con ID ${id} no encontrada`);
    }

    return store;
  }

  /**
   * Crea una nueva tienda
   */
  async create(createStoreDto: CreateStoreDto): Promise<Store> {
    const store = this.storeRepository.create({
      ...createStoreDto,
      isActive: true,
    });

    return await this.storeRepository.save(store);
  }

  /**
   * Actualiza una tienda existente
   */
  async update(id: string, updateStoreDto: UpdateStoreDto): Promise<Store> {
    const store = await this.findOne(id);

    // Actualizar solo los campos proporcionados
    Object.assign(store, updateStoreDto);

    await this.storeRepository.save(store);
    return await this.findOne(id);
  }

  /**
   * Elimina una tienda existente
   */
  async remove(id: string): Promise<void> {
    const store = await this.findOne(id);
    await this.storeProductRepository.delete({ storeId: id });
    await this.storeRepository.remove(store);
  }

  /**
   * Obtiene métricas agregadas para el dashboard de tiendas/productos
   */
  async getDashboardSummary(): Promise<StoreDashboardSummaryDto> {
    const [totalProducts, totalStores, inactiveStores, outOfStockProducts] =
      await Promise.all([
        this.productRepository.count(),
        this.storeRepository.count(),
        this.storeRepository.count({ where: { isActive: false } }),
        this.storeProductRepository.count({ where: { stock: 0 } }),
      ]);

    return {
      totalProducts,
      totalStores,
      inactiveStores,
      outOfStockProducts,
    };
  }

  /**
   * Obtiene las últimas tiendas con métricas de inventario
   */
  async getTopStores(limit: number = 4): Promise<TopStoreResponseDto[]> {
    const normalizedLimit = this.normalizeLimit(limit, 10, 4);

    const stores = await this.storeRepository.find({
      order: { createdAt: 'DESC' },
      take: normalizedLimit,
      relations: ['storeProducts'],
    });

    return stores.map((store) => {
      const storeProducts = store.storeProducts ?? [];
      const totalInventory = storeProducts.reduce(
        (sum, storeProduct) => sum + (storeProduct.stock ?? 0),
        0,
      );

      return {
        id: store.id,
        name: store.name,
        isActive: store.isActive,
        totalProducts: storeProducts.length,
        totalInventory,
        createdAt: store.createdAt,
      };
    });
  }

  private normalizeLimit(
    value: number,
    max: number,
    fallback: number,
  ): number {
    if (Number.isNaN(value) || value <= 0) {
      return fallback;
    }

    return Math.min(value, max);
  }
}
