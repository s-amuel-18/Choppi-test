import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StoreService } from './store.service';
import { Store } from './store.entity';
import { CreateStoreDto } from './dto/create-store.dto';
import { StoreProduct } from '../products/store-product.entity';

describe('StoreService', () => {
  let service: StoreService;
  let storeRepository: jest.Mocked<Repository<Store>>;
  let storeProductRepository: jest.Mocked<Repository<StoreProduct>>;

  const mockStore: Store = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Tienda Test',
    description: 'Descripción de prueba',
    address: 'Calle Test 123',
    phone: '+1234567890',
    email: 'tienda@example.com',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    storeProducts: [],
  };

  beforeEach(async () => {
    const mockStoreRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      createQueryBuilder: jest.fn(),
      remove: jest.fn(),
    };

    const mockStoreProductRepo = {
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StoreService,
        {
          provide: getRepositoryToken(Store),
          useValue: mockStoreRepository,
        },
        {
          provide: getRepositoryToken(StoreProduct),
          useValue: mockStoreProductRepo,
        },
      ],
    }).compile();

    service = module.get<StoreService>(StoreService);
    storeRepository = module.get(getRepositoryToken(Store));
    storeProductRepository = module.get(getRepositoryToken(StoreProduct));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findOne', () => {
    it('debería retornar una tienda cuando existe', async () => {
      const storeId = '123e4567-e89b-12d3-a456-426614174000';
      storeRepository.findOne.mockResolvedValue(mockStore);

      const result = await service.findOne(storeId);

      expect(storeRepository.findOne).toHaveBeenCalledWith({
        where: { id: storeId },
      });
      expect(result).toEqual(mockStore);
    });

    it('debería lanzar NotFoundException cuando la tienda no existe', async () => {
      const storeId = '00000000-0000-0000-0000-000000000000';
      storeRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(storeId)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(storeId)).rejects.toThrow(
        `Tienda con ID ${storeId} no encontrada`,
      );
      expect(storeRepository.findOne).toHaveBeenCalledWith({
        where: { id: storeId },
      });
    });

    it('debería buscar la tienda con el ID correcto', async () => {
      const storeId = '123e4567-e89b-12d3-a456-426614174000';
      storeRepository.findOne.mockResolvedValue(mockStore);

      await service.findOne(storeId);

      expect(storeRepository.findOne).toHaveBeenCalledTimes(1);
      expect(storeRepository.findOne).toHaveBeenCalledWith({
        where: { id: storeId },
      });
    });
  });

  describe('create', () => {
    const createStoreDto: CreateStoreDto = {
      name: 'Nueva Tienda',
      description: 'Descripción de la nueva tienda',
      address: 'Calle Nueva 456',
      phone: '+9876543210',
      email: 'nueva@tienda.com',
    };

    it('debería crear una nueva tienda exitosamente', async () => {
      const newStore: Store = {
        ...mockStore,
        ...createStoreDto,
        id: 'new-store-id',
      };

      storeRepository.create.mockReturnValue(newStore as Store);
      storeRepository.save.mockResolvedValue(newStore);

      const result = await service.create(createStoreDto);

      expect(storeRepository.create).toHaveBeenCalledWith({
        ...createStoreDto,
        isActive: true,
      });
      expect(storeRepository.save).toHaveBeenCalledWith(newStore);
      expect(result).toEqual(newStore);
      expect(result.isActive).toBe(true);
    });

    it('debería crear una tienda con descripción null si no se proporciona', async () => {
      const createDtoWithoutDescription: CreateStoreDto = {
        name: 'Tienda Sin Descripción',
        address: 'Calle Test 789',
        phone: '+1111111111',
        email: 'sin-desc@tienda.com',
      };

      const newStore: Store = {
        ...mockStore,
        ...createDtoWithoutDescription,
        description: null,
        id: 'new-store-id',
      };

      storeRepository.create.mockReturnValue(newStore as Store);
      storeRepository.save.mockResolvedValue(newStore);

      const result = await service.create(createDtoWithoutDescription);

      expect(storeRepository.create).toHaveBeenCalledWith({
        ...createDtoWithoutDescription,
        isActive: true,
      });
      expect(result).toEqual(newStore);
    });

    it('debería establecer isActive en true por defecto', async () => {
      const newStore: Store = {
        ...mockStore,
        ...createStoreDto,
        isActive: true,
        id: 'new-store-id',
      };

      storeRepository.create.mockReturnValue(newStore as Store);
      storeRepository.save.mockResolvedValue(newStore);

      const result = await service.create(createStoreDto);

      expect(storeRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          isActive: true,
        }),
      );
      expect(result.isActive).toBe(true);
    });

    describe('remove', () => {
      it('debería eliminar relaciones store_products antes de borrar la tienda', async () => {
        const storeId = mockStore.id;
        storeRepository.findOne.mockResolvedValue(mockStore);

        await service.remove(storeId);

        expect(storeProductRepository.delete).toHaveBeenCalledWith({
          storeId,
        });
        expect(storeRepository.remove).toHaveBeenCalledWith(mockStore);
      });
    });
  });
});
