import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { DataSource } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  createTestApp,
  cleanDatabase,
  closeDatabase,
  getDataSource,
} from './helpers/test-setup';
import { StoreFixtures } from './helpers/fixtures/store.fixtures';
import { ProductFixtures } from './helpers/fixtures/product.fixtures';
import { AuthFixtures } from './helpers/fixtures/auth.fixtures';
import { Store } from '../src/components/store/store.entity';
import { Product } from '../src/components/products/product.entity';
import { StoreProduct } from '../src/components/products/store-product.entity';
import { User } from '../src/components/user/user.entity';
import {
  expectApiResponse,
  expectErrorResponse,
  getResponseData,
} from './helpers/test-utils';

describe('Products (e2e)', () => {
  let app: INestApplication<App>;
  let dataSource: DataSource;
  let productRepository: Repository<Product>;
  let storeProductRepository: Repository<StoreProduct>;
  let storeRepository: Repository<Store>;
  let userRepository: Repository<User>;

  /**
   * Helper para obtener un token JWT válido
   */
  async function getAuthToken(): Promise<string> {
    const { user, plainPassword } =
      await AuthFixtures.createUserWithPlainPassword(
        userRepository,
        'Test1234!',
        {
          email: `test-${Date.now()}@example.com`,
          name: 'Test User',
        },
      );

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: user.email,
        password: plainPassword,
      })
      .expect(200);

    return response.body.data.accessToken;
  }

  beforeAll(async () => {
    app = await createTestApp();
    dataSource = getDataSource(app);
    productRepository = app.get(getRepositoryToken(Product));
    storeProductRepository = app.get(getRepositoryToken(StoreProduct));
    storeRepository = app.get(getRepositoryToken(Store));
    userRepository = app.get(getRepositoryToken(User));
  });

  afterEach(async () => {
    await cleanDatabase(dataSource);
  });

  afterAll(async () => {
    await closeDatabase(dataSource);
    await app.close();
  });

  describe('GET /products/:id', () => {
    it('debería obtener un producto por ID', async () => {
      const product = await ProductFixtures.createProduct(productRepository, {
        name: 'Laptop Dell XPS 15',
        description: 'Laptop de alto rendimiento',
        originalPrice: 1299.99,
        category: 'Electrónica',
      });

      const response = await request(app.getHttpServer())
        .get(`/products/${product.id}`)
        .expect(200);

      expectApiResponse(response, true);
      const productData = getResponseData<Product>(response);

      expect(productData).toHaveProperty('id', product.id);
      expect(productData).toHaveProperty('name', product.name);
      expect(productData).toHaveProperty('description', product.description);
      expect(productData).toHaveProperty(
        'originalPrice',
        product.originalPrice,
      );
      expect(productData).toHaveProperty('category', product.category);
    });

    it('debería retornar 404 cuando el producto no existe', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';

      const response = await request(app.getHttpServer())
        .get(`/products/${nonExistentId}`)
        .expect(404);

      expectErrorResponse(response, 404);
    });

    it('debería retornar 400 cuando el ID tiene formato inválido', async () => {
      const invalidId = 'invalid-id-format';

      const response = await request(app.getHttpServer())
        .get(`/products/${invalidId}`)
        .expect(400);

      expectErrorResponse(response, 400);
    });
  });

  describe('POST /products', () => {
    it('debería crear un nuevo producto con autenticación', async () => {
      const token = await getAuthToken();

      const createProductDto = {
        name: 'Nuevo Producto',
        description: 'Descripción del nuevo producto',
        originalPrice: 999.99,
        category: 'Electrónica',
      };

      const response = await request(app.getHttpServer())
        .post('/products')
        .set('Authorization', `Bearer ${token}`)
        .send(createProductDto)
        .expect(201);

      expectApiResponse(response, true);
      const productData = getResponseData<Product>(response);

      expect(productData).toHaveProperty('id');
      expect(productData).toHaveProperty('name', createProductDto.name);
      expect(productData).toHaveProperty(
        'description',
        createProductDto.description,
      );
      expect(productData).toHaveProperty(
        'originalPrice',
        createProductDto.originalPrice,
      );
      expect(productData).toHaveProperty('category', createProductDto.category);
    });

    it('debería retornar 401 sin token de autenticación', async () => {
      const createProductDto = {
        name: 'Producto Sin Auth',
        originalPrice: 499.99,
      };

      await request(app.getHttpServer())
        .post('/products')
        .send(createProductDto)
        .expect(401);
    });

    it('debería validar campos requeridos', async () => {
      const token = await getAuthToken();

      const response = await request(app.getHttpServer())
        .post('/products')
        .set('Authorization', `Bearer ${token}`)
        .send({})
        .expect(400);

      expectErrorResponse(response, 400);
    });

    it('debería validar que el precio sea positivo', async () => {
      const token = await getAuthToken();

      const response = await request(app.getHttpServer())
        .post('/products')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Producto',
          originalPrice: -100,
        })
        .expect(400);

      expectErrorResponse(response, 400);
    });
  });

  describe('POST /stores/:id/products', () => {
    it('debería agregar un producto a una tienda', async () => {
      const token = await getAuthToken();
      const store = await StoreFixtures.createStore(storeRepository);
      const product = await ProductFixtures.createProduct(productRepository);

      const createStoreProductDto = {
        productId: product.id,
        stock: 50,
        storePrice: 1199.99,
      };

      const response = await request(app.getHttpServer())
        .post(`/stores/${store.id}/products`)
        .set('Authorization', `Bearer ${token}`)
        .send(createStoreProductDto)
        .expect(201);

      expectApiResponse(response, true);
      const storeProductData = getResponseData<StoreProduct>(response);

      expect(storeProductData).toHaveProperty('id');
      expect(storeProductData).toHaveProperty('storeId', store.id);
      expect(storeProductData).toHaveProperty('productId', product.id);
      expect(storeProductData).toHaveProperty('stock', 50);
      expect(storeProductData).toHaveProperty('storePrice', 1199.99);
      expect(storeProductData).toHaveProperty('product');
    });

    it('debería retornar 404 cuando la tienda no existe', async () => {
      const token = await getAuthToken();
      const product = await ProductFixtures.createProduct(productRepository);

      const response = await request(app.getHttpServer())
        .post(`/stores/00000000-0000-0000-0000-000000000000/products`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          productId: product.id,
          stock: 50,
        })
        .expect(404);

      expectErrorResponse(response, 404);
    });

    it('debería retornar 409 cuando el producto ya está en la tienda', async () => {
      const token = await getAuthToken();
      const store = await StoreFixtures.createStore(storeRepository);
      const product = await ProductFixtures.createProduct(productRepository);

      const createStoreProductDto = {
        productId: product.id,
        stock: 50,
      };

      // Agregar producto por primera vez
      await request(app.getHttpServer())
        .post(`/stores/${store.id}/products`)
        .set('Authorization', `Bearer ${token}`)
        .send(createStoreProductDto)
        .expect(201);

      // Intentar agregar el mismo producto de nuevo
      const response = await request(app.getHttpServer())
        .post(`/stores/${store.id}/products`)
        .set('Authorization', `Bearer ${token}`)
        .send(createStoreProductDto)
        .expect(409);

      expectErrorResponse(response, 409);
    });
  });

  describe('GET /stores/:id/products', () => {
    it('debería obtener productos de una tienda con paginación', async () => {
      const store = await StoreFixtures.createStore(storeRepository);
      const products = await ProductFixtures.createManyProducts(
        productRepository,
        5,
      );

      const token = await getAuthToken();

      // Agregar productos a la tienda
      for (const product of products) {
        await request(app.getHttpServer())
          .post(`/stores/${store.id}/products`)
          .set('Authorization', `Bearer ${token}`)
          .send({
            productId: product.id,
            stock: 10,
          })
          .expect(201);
      }

      const response = await request(app.getHttpServer())
        .get(`/stores/${store.id}/products`)
        .query({ page: 1, limit: 10 })
        .expect(200);

      expectApiResponse(response, true);
      const data = getResponseData<{
        data: StoreProduct[];
        meta: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
        };
      }>(response);

      expect(data).toHaveProperty('data');
      expect(data).toHaveProperty('meta');
      expect(data.meta).toHaveProperty('page', 1);
      expect(data.meta).toHaveProperty('limit', 10);
      expect(data.meta).toHaveProperty('total', 5);
      expect(data.meta).toHaveProperty('totalPages', 1);
      expect(data.data).toHaveLength(5);
    });

    it('debería filtrar productos por búsqueda', async () => {
      const store = await StoreFixtures.createStore(storeRepository);
      const product1 = await ProductFixtures.createProduct(productRepository, {
        name: 'Laptop Dell XPS',
        description: 'Laptop de alto rendimiento',
      });
      const product2 = await ProductFixtures.createProduct(productRepository, {
        name: 'Mouse Logitech MX',
        description: 'Mouse inalámbrico',
      });

      const token = await getAuthToken();

      await request(app.getHttpServer())
        .post(`/stores/${store.id}/products`)
        .set('Authorization', `Bearer ${token}`)
        .send({ productId: product1.id, stock: 10 })
        .expect(201);

      await request(app.getHttpServer())
        .post(`/stores/${store.id}/products`)
        .set('Authorization', `Bearer ${token}`)
        .send({ productId: product2.id, stock: 10 })
        .expect(201);

      // Primero verificar que sin búsqueda hay 2 productos
      const allResponse = await request(app.getHttpServer())
        .get(`/stores/${store.id}/products`)
        .expect(200);
      const allData = getResponseData<{
        data: StoreProduct[];
        meta: { total: number };
      }>(allResponse);
      expect(allData.meta.total).toBe(2);

      // Luego verificar que con búsqueda hay solo 1
      const response = await request(app.getHttpServer())
        .get(`/stores/${store.id}/products`)
        .query({ q: 'laptop' })
        .expect(200);

      const data = getResponseData<{
        data: StoreProduct[];
        meta: { total: number };
      }>(response);

      expect(data.meta.total).toBe(1);
      expect(data.data[0].product.name.toLowerCase()).toContain('laptop');
    });

    it('debería filtrar productos en stock', async () => {
      const store = await StoreFixtures.createStore(storeRepository);
      const product1 = await ProductFixtures.createProduct(productRepository);
      const product2 = await ProductFixtures.createProduct(productRepository);

      const token = await getAuthToken();

      await request(app.getHttpServer())
        .post(`/stores/${store.id}/products`)
        .set('Authorization', `Bearer ${token}`)
        .send({ productId: product1.id, stock: 10 })
        .expect(201);

      await request(app.getHttpServer())
        .post(`/stores/${store.id}/products`)
        .set('Authorization', `Bearer ${token}`)
        .send({ productId: product2.id, stock: 0 })
        .expect(201);

      const response = await request(app.getHttpServer())
        .get(`/stores/${store.id}/products`)
        .query({ inStock: true })
        .expect(200);

      const data = getResponseData<{
        data: StoreProduct[];
        meta: { total: number };
      }>(response);

      expect(data.meta.total).toBe(1);
      expect(data.data[0].stock).toBeGreaterThan(0);
    });
  });

  describe('PUT /stores/:id/products/:storeProductId', () => {
    it('debería actualizar un producto de tienda', async () => {
      const token = await getAuthToken();
      const store = await StoreFixtures.createStore(storeRepository);
      const product = await ProductFixtures.createProduct(productRepository);

      // Agregar producto a la tienda
      const addResponse = await request(app.getHttpServer())
        .post(`/stores/${store.id}/products`)
        .set('Authorization', `Bearer ${token}`)
        .send({ productId: product.id, stock: 50 })
        .expect(201);

      const storeProduct = getResponseData<StoreProduct>(addResponse);

      const updateDto = {
        stock: 75,
        storePrice: 1099.99,
      };

      const response = await request(app.getHttpServer())
        .put(`/stores/${store.id}/products/${storeProduct.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateDto)
        .expect(200);

      expectApiResponse(response, true);
      const updatedData = getResponseData<StoreProduct>(response);

      expect(updatedData).toHaveProperty('stock', 75);
      expect(updatedData).toHaveProperty('storePrice', 1099.99);
    });

    it('debería retornar 404 cuando el producto de tienda no existe', async () => {
      const token = await getAuthToken();
      const store = await StoreFixtures.createStore(storeRepository);

      const response = await request(app.getHttpServer())
        .put(
          `/stores/${store.id}/products/00000000-0000-0000-0000-000000000000`,
        )
        .set('Authorization', `Bearer ${token}`)
        .send({ stock: 100 })
        .expect(404);

      expectErrorResponse(response, 404);
    });
  });

  describe('DELETE /stores/:id/products/:storeProductId', () => {
    it('debería eliminar un producto de una tienda', async () => {
      const token = await getAuthToken();
      const store = await StoreFixtures.createStore(storeRepository);
      const product = await ProductFixtures.createProduct(productRepository);

      // Agregar producto a la tienda
      const addResponse = await request(app.getHttpServer())
        .post(`/stores/${store.id}/products`)
        .set('Authorization', `Bearer ${token}`)
        .send({ productId: product.id, stock: 50 })
        .expect(201);

      const storeProduct = getResponseData<StoreProduct>(addResponse);

      const response = await request(app.getHttpServer())
        .delete(`/stores/${store.id}/products/${storeProduct.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expectApiResponse(response, true);
      const data = getResponseData<{ message: string }>(response);
      // El interceptor envuelve la respuesta, así que data contiene { message }
      expect(data.message).toBe('Producto eliminado de la tienda exitosamente');

      // Verificar que el producto fue eliminado
      await request(app.getHttpServer())
        .get(`/stores/${store.id}/products`)
        .expect(200)
        .then((res) => {
          const listData = getResponseData<{
            data: StoreProduct[];
            meta: { total: number };
          }>(res);
          expect(listData.meta.total).toBe(0);
        });
    });

    it('debería retornar 404 cuando el producto de tienda no existe', async () => {
      const token = await getAuthToken();
      const store = await StoreFixtures.createStore(storeRepository);

      const response = await request(app.getHttpServer())
        .delete(
          `/stores/${store.id}/products/00000000-0000-0000-0000-000000000000`,
        )
        .set('Authorization', `Bearer ${token}`)
        .expect(404);

      expectErrorResponse(response, 404);
    });
  });

  describe('DELETE /products/:id', () => {
    it('debería eliminar un producto existente con autenticación válida', async () => {
      const token = await getAuthToken();
      const product = await ProductFixtures.createProduct(productRepository, {
        name: 'Producto a Eliminar',
        description: 'Este producto será eliminado',
        originalPrice: 99.99,
        category: 'Test',
      });

      const response = await request(app.getHttpServer())
        .delete(`/products/${product.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty(
        'message',
        'Producto eliminado exitosamente',
      );

      // Verificar que el producto ya no existe
      await request(app.getHttpServer())
        .get(`/products/${product.id}`)
        .expect(404);
    });

    it('debería eliminar todas las relaciones con tiendas al eliminar un producto', async () => {
      const token = await getAuthToken();
      const store = await StoreFixtures.createStore(storeRepository);
      const product = await ProductFixtures.createProduct(productRepository);

      // Agregar producto a la tienda
      await request(app.getHttpServer())
        .post(`/stores/${store.id}/products`)
        .set('Authorization', `Bearer ${token}`)
        .send({ productId: product.id, stock: 50 })
        .expect(201);

      // Verificar que el producto está en la tienda
      const listBefore = await request(app.getHttpServer())
        .get(`/stores/${store.id}/products`)
        .expect(200);

      const listDataBefore = getResponseData<{
        data: StoreProduct[];
        meta: { total: number };
      }>(listBefore);
      expect(listDataBefore.meta.total).toBe(1);

      // Eliminar el producto
      await request(app.getHttpServer())
        .delete(`/products/${product.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      // Verificar que las relaciones fueron eliminadas
      const listAfter = await request(app.getHttpServer())
        .get(`/stores/${store.id}/products`)
        .expect(200);

      const listDataAfter = getResponseData<{
        data: StoreProduct[];
        meta: { total: number };
      }>(listAfter);
      expect(listDataAfter.meta.total).toBe(0);
    });

    it('debería rechazar la eliminación sin token JWT', async () => {
      const product = await ProductFixtures.createProduct(productRepository);

      const response = await request(app.getHttpServer())
        .delete(`/products/${product.id}`)
        .expect(401);

      expectErrorResponse(response, 401);

      // Verificar que el producto aún existe
      await request(app.getHttpServer())
        .get(`/products/${product.id}`)
        .expect(200);
    });

    it('debería rechazar la eliminación con token inválido', async () => {
      const product = await ProductFixtures.createProduct(productRepository);

      const response = await request(app.getHttpServer())
        .delete(`/products/${product.id}`)
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expectErrorResponse(response, 401);
    });

    it('debería retornar 404 cuando el producto no existe', async () => {
      const token = await getAuthToken();

      const response = await request(app.getHttpServer())
        .delete('/products/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);

      expectErrorResponse(response, 404);
    });

    it('debería rechazar IDs inválidos', async () => {
      const token = await getAuthToken();

      const response = await request(app.getHttpServer())
        .delete('/products/invalid-id')
        .set('Authorization', `Bearer ${token}`)
        .expect(400);

      expectErrorResponse(response, 400);
    });
  });
});
