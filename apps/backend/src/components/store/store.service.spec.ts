import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StoreService } from './store.service';
import { Store } from './store.entity';
import { CreateStoreDto } from './dto/create-store.dto';

describe('StoreService', () => {
  let service: StoreService;
  let repository: jest.Mocked<Repository<Store>>;

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
    const mockRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StoreService,
        {
          provide: getRepositoryToken(Store),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<StoreService>(StoreService);
    repository = module.get(getRepositoryToken(Store));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findOne', () => {
    it('debería retornar una tienda cuando existe', async () => {
      const storeId = '123e4567-e89b-12d3-a456-426614174000';
      repository.findOne.mockResolvedValue(mockStore);

      const result = await service.findOne(storeId);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: storeId },
      });
      expect(result).toEqual(mockStore);
    });

    it('debería lanzar NotFoundException cuando la tienda no existe', async () => {
      const storeId = '00000000-0000-0000-0000-000000000000';
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOne(storeId)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(storeId)).rejects.toThrow(
        `Tienda con ID ${storeId} no encontrada`,
      );
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: storeId },
      });
    });

    it('debería buscar la tienda con el ID correcto', async () => {
      const storeId = '123e4567-e89b-12d3-a456-426614174000';
      repository.findOne.mockResolvedValue(mockStore);

      await service.findOne(storeId);

      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalledWith({
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

      repository.create.mockReturnValue(newStore as Store);
      repository.save.mockResolvedValue(newStore);

      const result = await service.create(createStoreDto);

      expect(repository.create).toHaveBeenCalledWith({
        ...createStoreDto,
        isActive: true,
      });
      expect(repository.save).toHaveBeenCalledWith(newStore);
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

      repository.create.mockReturnValue(newStore as Store);
      repository.save.mockResolvedValue(newStore);

      const result = await service.create(createDtoWithoutDescription);

      expect(repository.create).toHaveBeenCalledWith({
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

      repository.create.mockReturnValue(newStore as Store);
      repository.save.mockResolvedValue(newStore);

      const result = await service.create(createStoreDto);

      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          isActive: true,
        }),
      );
      expect(result.isActive).toBe(true);
    });
  });
});
