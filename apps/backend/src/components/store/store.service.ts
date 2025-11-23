import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, ILike } from 'typeorm';
import { Store } from './store.entity';
import { GetStoresQueryDto } from './dto/get-stores-query.dto';
import { PaginatedStoreResponseDto } from './dto/paginated-store-response.dto';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';

@Injectable()
export class StoreService {
  constructor(
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
    await this.storeRepository.remove(store);
  }
}
