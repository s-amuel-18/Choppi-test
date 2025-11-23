import { Test, TestingModule } from '@nestjs/testing';
import {
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductsService } from './products.service';
import { Product } from './product.entity';
import { StoreProduct } from './store-product.entity';
import { Store } from '../store/store.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { CreateStoreProductDto } from './dto/create-store-product.dto';
import { UpdateStoreProductDto } from './dto/update-store-product.dto';

describe('ProductsService', () => {
  let service: ProductsService;
  let productRepository: jest.Mocked<Repository<Product>>;
  let storeProductRepository: jest.Mocked<Repository<StoreProduct>>;
  let storeRepository: jest.Mocked<Repository<Store>>;

  const mockProduct: Product = {
    id: 'product-id-1',
    name: 'Laptop Dell XPS 15',
    description: 'Laptop de alto rendimiento',
    originalPrice: 1299.99,
    category: 'Electrónica',
    createdAt: new Date(),
    updatedAt: new Date(),
    storeProducts: [],
  };

  const mockStore: Store = {
    id: 'store-id-1',
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

  const mockStoreProduct: StoreProduct = {
    id: 'store-product-id-1',
    storeId: 'store-id-1',
    productId: 'product-id-1',
    stock: 50,
    storePrice: 1199.99,
    createdAt: new Date(),
    updatedAt: new Date(),
    store: mockStore,
    product: mockProduct,
  };

  beforeEach(async () => {
    const mockProductRepo = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
    };

    const mockStoreProductRepo = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
      delete: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    const mockStoreRepo = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepo,
        },
        {
          provide: getRepositoryToken(StoreProduct),
          useValue: mockStoreProductRepo,
        },
        {
          provide: getRepositoryToken(Store),
          useValue: mockStoreRepo,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    productRepository = module.get(getRepositoryToken(Product));
    storeProductRepository = module.get(getRepositoryToken(StoreProduct));
    storeRepository = module.get(getRepositoryToken(Store));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findOne', () => {
    it('debería retornar un producto cuando existe', async () => {
      productRepository.findOne.mockResolvedValue(mockProduct);

      const result = await service.findOne('product-id-1');

      expect(productRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'product-id-1' },
      });
      expect(result).toEqual(mockProduct);
    });

    it('debería lanzar NotFoundException cuando el producto no existe', async () => {
      productRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        'Producto con ID non-existent-id no encontrado',
      );
    });
  });

  describe('create', () => {
    const createProductDto: CreateProductDto = {
      name: 'Nuevo Producto',
      description: 'Descripción del nuevo producto',
      originalPrice: 999.99,
      category: 'Electrónica',
    };

    it('debería crear un nuevo producto exitosamente', async () => {
      const newProduct: Product = {
        ...mockProduct,
        ...createProductDto,
        id: 'new-product-id',
      };

      productRepository.create.mockReturnValue(newProduct as Product);
      productRepository.save.mockResolvedValue(newProduct);

      const result = await service.create(createProductDto);

      expect(productRepository.create).toHaveBeenCalledWith(createProductDto);
      expect(productRepository.save).toHaveBeenCalledWith(newProduct);
      expect(result).toEqual(newProduct);
    });

    it('debería crear un producto con campos opcionales null', async () => {
      const createDtoWithoutOptional: CreateProductDto = {
        name: 'Producto Sin Opcionales',
        originalPrice: 499.99,
      };

      const newProduct: Product = {
        ...mockProduct,
        ...createDtoWithoutOptional,
        description: null,
        category: null,
        id: 'new-product-id',
      };

      productRepository.create.mockReturnValue(newProduct as Product);
      productRepository.save.mockResolvedValue(newProduct);

      const result = await service.create(createDtoWithoutOptional);

      expect(result).toEqual(newProduct);
    });
  });

  describe('addProductToStore', () => {
    const createStoreProductDto: CreateStoreProductDto = {
      productId: 'product-id-1',
      stock: 50,
      storePrice: 1199.99,
    };

    it('debería agregar un producto a una tienda exitosamente', async () => {
      storeRepository.findOne.mockResolvedValue(mockStore);
      productRepository.findOne.mockResolvedValue(mockProduct);
      storeProductRepository.findOne.mockResolvedValue(null);
      storeProductRepository.create.mockReturnValue(
        mockStoreProduct as StoreProduct,
      );
      storeProductRepository.save.mockResolvedValue(mockStoreProduct);

      const result = await service.addProductToStore(
        'store-id-1',
        createStoreProductDto,
      );

      expect(storeRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'store-id-1' },
      });
      expect(productRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'product-id-1' },
      });
      expect(storeProductRepository.findOne).toHaveBeenCalledWith({
        where: {
          storeId: 'store-id-1',
          productId: 'product-id-1',
        },
      });
      expect(result).toEqual(mockStoreProduct);
    });

    it('debería lanzar NotFoundException cuando la tienda no existe', async () => {
      storeRepository.findOne.mockResolvedValue(null);

      await expect(
        service.addProductToStore('non-existent-store', createStoreProductDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('debería lanzar NotFoundException cuando el producto no existe', async () => {
      storeRepository.findOne.mockResolvedValue(mockStore);
      productRepository.findOne.mockResolvedValue(null);

      await expect(
        service.addProductToStore('store-id-1', createStoreProductDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('debería lanzar ConflictException cuando el producto ya está en la tienda', async () => {
      storeRepository.findOne.mockResolvedValue(mockStore);
      productRepository.findOne.mockResolvedValue(mockProduct);
      storeProductRepository.findOne.mockResolvedValue(mockStoreProduct);

      await expect(
        service.addProductToStore('store-id-1', createStoreProductDto),
      ).rejects.toThrow(ConflictException);
      await expect(
        service.addProductToStore('store-id-1', createStoreProductDto),
      ).rejects.toThrow('El producto ya está asociado a esta tienda');
    });

    it('debería permitir agregar producto sin precio de tienda', async () => {
      const createDtoWithoutPrice: CreateStoreProductDto = {
        productId: 'product-id-1',
        stock: 25,
      };

      storeRepository.findOne.mockResolvedValue(mockStore);
      productRepository.findOne.mockResolvedValue(mockProduct);
      storeProductRepository.findOne.mockResolvedValue(null);

      const storeProductWithoutPrice: StoreProduct = {
        ...mockStoreProduct,
        storePrice: null,
      };

      storeProductRepository.create.mockReturnValue(
        storeProductWithoutPrice as StoreProduct,
      );
      storeProductRepository.save.mockResolvedValue(storeProductWithoutPrice);

      const result = await service.addProductToStore(
        'store-id-1',
        createDtoWithoutPrice,
      );

      expect(result.storePrice).toBeNull();
    });
  });

  describe('getStoreProducts', () => {
    it('debería retornar productos paginados de una tienda', async () => {
      const queryDto: any = {
        page: 1,
        limit: 10,
      };

      storeRepository.findOne.mockResolvedValue(mockStore);

      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockResolvedValue(1),
        getMany: jest.fn().mockResolvedValue([mockStoreProduct]),
      };

      storeProductRepository.createQueryBuilder.mockReturnValue(
        mockQueryBuilder as any,
      );

      const result = await service.getStoreProducts('store-id-1', queryDto);

      expect(storeRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'store-id-1' },
      });
      expect(result.data).toEqual([mockStoreProduct]);
      expect(result.meta.page).toBe(1);
      expect(result.meta.limit).toBe(10);
      expect(result.meta.total).toBe(1);
      expect(result.meta.totalPages).toBe(1);
    });

    it('debería lanzar NotFoundException cuando la tienda no existe', async () => {
      storeRepository.findOne.mockResolvedValue(null);

      await expect(
        service.getStoreProducts('non-existent-store', {}),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateStoreProduct', () => {
    const updateDto: UpdateStoreProductDto = {
      stock: 75,
      storePrice: 1099.99,
    };

    it('debería actualizar un producto de tienda exitosamente', async () => {
      storeRepository.findOne.mockResolvedValue(mockStore);
      storeProductRepository.findOne.mockResolvedValue(mockStoreProduct);
      storeProductRepository.save.mockResolvedValue({
        ...mockStoreProduct,
        ...updateDto,
      });

      const result = await service.updateStoreProduct(
        'store-id-1',
        'store-product-id-1',
        updateDto,
      );

      expect(storeProductRepository.save).toHaveBeenCalled();
      expect(result.stock).toBe(75);
      expect(result.storePrice).toBe(1099.99);
    });

    it('debería lanzar NotFoundException cuando la tienda no existe', async () => {
      storeRepository.findOne.mockResolvedValue(null);

      await expect(
        service.updateStoreProduct(
          'non-existent-store',
          'store-product-id-1',
          updateDto,
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('debería lanzar NotFoundException cuando el producto de tienda no existe', async () => {
      storeRepository.findOne.mockResolvedValue(mockStore);
      storeProductRepository.findOne.mockResolvedValue(null);

      await expect(
        service.updateStoreProduct(
          'store-id-1',
          'non-existent-product',
          updateDto,
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeProductFromStore', () => {
    it('debería eliminar un producto de una tienda exitosamente', async () => {
      storeRepository.findOne.mockResolvedValue(mockStore);
      storeProductRepository.findOne.mockResolvedValue(mockStoreProduct);
      storeProductRepository.remove.mockResolvedValue(mockStoreProduct);

      await service.removeProductFromStore('store-id-1', 'store-product-id-1');

      expect(storeProductRepository.remove).toHaveBeenCalledWith(
        mockStoreProduct,
      );
    });

    it('debería lanzar NotFoundException cuando la tienda no existe', async () => {
      storeRepository.findOne.mockResolvedValue(null);

      await expect(
        service.removeProductFromStore('non-existent-store', 'store-product-id-1'),
      ).rejects.toThrow(NotFoundException);
    });

    it('debería lanzar NotFoundException cuando el producto de tienda no existe', async () => {
      storeRepository.findOne.mockResolvedValue(mockStore);
      storeProductRepository.findOne.mockResolvedValue(null);

      await expect(
        service.removeProductFromStore('store-id-1', 'non-existent-product'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('debería eliminar un producto exitosamente', async () => {
      productRepository.findOne.mockResolvedValue(mockProduct);
      storeProductRepository.delete.mockResolvedValue({ affected: 1, raw: [] });
      productRepository.remove.mockResolvedValue(mockProduct);

      await service.remove('product-id-1');

      expect(productRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'product-id-1' },
      });
      expect(storeProductRepository.delete).toHaveBeenCalledWith({
        productId: 'product-id-1',
      });
      expect(productRepository.remove).toHaveBeenCalledWith(mockProduct);
    });

    it('debería lanzar NotFoundException cuando el producto no existe', async () => {
      productRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('non-existent-product')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('debería eliminar todas las relaciones con tiendas antes de eliminar el producto', async () => {
      productRepository.findOne.mockResolvedValue(mockProduct);
      storeProductRepository.delete.mockResolvedValue({ affected: 2, raw: [] });
      productRepository.remove.mockResolvedValue(mockProduct);

      await service.remove('product-id-1');

      expect(storeProductRepository.delete).toHaveBeenCalledWith({
        productId: 'product-id-1',
      });
      expect(productRepository.remove).toHaveBeenCalledWith(mockProduct);
    });
  });
});

