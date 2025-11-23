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
import { AuthFixtures } from './helpers/fixtures/auth.fixtures';
import { Store } from '../src/components/store/store.entity';
import { User } from '../src/components/user/user.entity';
import {
  expectApiResponse,
  expectErrorResponse,
  getResponseData,
} from './helpers/test-utils';

describe('Store (e2e)', () => {
  let app: INestApplication<App>;
  let dataSource: DataSource;
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
    storeRepository = app.get(getRepositoryToken(Store));
    userRepository = app.get(getRepositoryToken(User));
  });

  afterEach(async () => {
    // Limpiar la base de datos después de cada test
    await cleanDatabase(dataSource);
  });

  afterAll(async () => {
    await closeDatabase(dataSource);
    await app.close();
  });

  describe('GET /stores/:id', () => {
    it('debería obtener los detalles de una tienda existente', async () => {
      const store = await StoreFixtures.createStore(storeRepository, {
        name: 'Tienda Central',
        description: 'Tienda principal',
        address: 'Av. Principal 123',
        phone: '+1234567890',
        email: 'central@tienda.com',
        isActive: true,
      });

      const response = await request(app.getHttpServer())
        .get(`/stores/${store.id}`)
        .expect(200);

      expectApiResponse(response, true);
      const storeData = getResponseData<Store>(response);

      expect(storeData).toHaveProperty('id', store.id);
      expect(storeData).toHaveProperty('name', store.name);
      expect(storeData).toHaveProperty('description', store.description);
      expect(storeData).toHaveProperty('address', store.address);
      expect(storeData).toHaveProperty('phone', store.phone);
      expect(storeData).toHaveProperty('email', store.email);
      expect(storeData).toHaveProperty('isActive', store.isActive);
      expect(storeData).toHaveProperty('createdAt');
      expect(storeData).toHaveProperty('updatedAt');
    });

    it('debería retornar 400 cuando la tienda no existe', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';

      const response = await request(app.getHttpServer())
        .get(`/stores/${nonExistentId}`)
        .expect(404);

      expectErrorResponse(response, 404);
    });

    it('debería retornar 404 cuando el ID tiene formato inválido', async () => {
      const invalidId = 'invalid-id-format';

      const response = await request(app.getHttpServer())
        .get(`/stores/${invalidId}`)
        .expect(400);

      expectErrorResponse(response, 400);
    });

    it('debería retornar todos los campos de la tienda', async () => {
      const store = await StoreFixtures.createStore(storeRepository, {
        name: 'Tienda Completa',
        description: 'Descripción completa de la tienda',
        address: 'Calle Completa 456',
        phone: '+9876543210',
        email: 'completa@tienda.com',
        isActive: true,
      });

      const response = await request(app.getHttpServer())
        .get(`/stores/${store.id}`)
        .expect(200);

      const storeData = getResponseData<Store>(response);

      // Verificar que todos los campos estén presentes
      expect(storeData).toHaveProperty('id');
      expect(storeData).toHaveProperty('name');
      expect(storeData).toHaveProperty('description');
      expect(storeData).toHaveProperty('address');
      expect(storeData).toHaveProperty('phone');
      expect(storeData).toHaveProperty('email');
      expect(storeData).toHaveProperty('isActive');
      expect(storeData).toHaveProperty('createdAt');
      expect(storeData).toHaveProperty('updatedAt');

      // Verificar tiposA
      expect(typeof storeData.id).toBe('string');
      expect(typeof storeData.name).toBe('string');
      expect(typeof storeData.address).toBe('string');
      expect(typeof storeData.phone).toBe('string');
      expect(typeof storeData.email).toBe('string');
      expect(typeof storeData.isActive).toBe('boolean');
      expect(typeof storeData.createdAt).toBe('string');
      expect(typeof storeData.updatedAt).toBe('string');
    });

    it('debería retornar una tienda inactiva si existe', async () => {
      const store = await StoreFixtures.createStore(storeRepository, {
        name: 'Tienda Inactiva',
        isActive: false,
      });

      const response = await request(app.getHttpServer())
        .get(`/stores/${store.id}`)
        .expect(200);

      const storeData = getResponseData<Store>(response);
      expect(storeData).toHaveProperty('isActive', false);
    });

    it('debería retornar una tienda con descripción null si no tiene descripción', async () => {
      const store = await StoreFixtures.createStore(storeRepository, {
        name: 'Tienda Sin Descripción',
        description: null,
      });

      const response = await request(app.getHttpServer())
        .get(`/stores/${store.id}`)
        .expect(200);

      const storeData = getResponseData<Store>(response);
      expect(storeData.description).toBeNull();
    });
  });

  describe('POST /stores', () => {
    it('debería crear una nueva tienda con autenticación válida', async () => {
      const token = await getAuthToken();
      const storeData = {
        name: 'Tienda Nueva',
        description: 'Descripción de la nueva tienda',
        address: 'Av. Nueva 789',
        phone: '+5555555555',
        email: 'nueva@tienda.com',
      };

      const response = await request(app.getHttpServer())
        .post('/stores')
        .set('Authorization', `Bearer ${token}`)
        .send(storeData)
        .expect(201);

      expectApiResponse(response, true);
      const createdStore = getResponseData<Store>(response);

      expect(createdStore).toHaveProperty('id');
      expect(createdStore).toHaveProperty('name', storeData.name);
      expect(createdStore).toHaveProperty('description', storeData.description);
      expect(createdStore).toHaveProperty('address', storeData.address);
      expect(createdStore).toHaveProperty('phone', storeData.phone);
      expect(createdStore).toHaveProperty('email', storeData.email);
      expect(createdStore).toHaveProperty('isActive', true);
      expect(createdStore).toHaveProperty('createdAt');
      expect(createdStore).toHaveProperty('updatedAt');
    });

    it('debería rechazar la creación sin token JWT', async () => {
      const storeData = {
        name: 'Tienda Sin Auth',
        address: 'Calle Test 123',
        phone: '+1234567890',
        email: 'sin-auth@tienda.com',
      };

      const response = await request(app.getHttpServer())
        .post('/stores')
        .send(storeData)
        .expect(401);

      expectErrorResponse(response, 401);
    });

    it('debería rechazar la creación con token inválido', async () => {
      const storeData = {
        name: 'Tienda Token Inválido',
        address: 'Calle Test 456',
        phone: '+1234567890',
        email: 'token-invalido@tienda.com',
      };

      const response = await request(app.getHttpServer())
        .post('/stores')
        .set('Authorization', 'Bearer invalid-token')
        .send(storeData)
        .expect(401);

      expectErrorResponse(response, 401);
    });

    it('debería validar que el nombre sea requerido', async () => {
      const token = await getAuthToken();
      const storeData = {
        address: 'Calle Test 123',
        phone: '+1234567890',
        email: 'sin-nombre@tienda.com',
      };

      const response = await request(app.getHttpServer())
        .post('/stores')
        .set('Authorization', `Bearer ${token}`)
        .send(storeData)
        .expect(400);

      expect(response.body).toHaveProperty('statusCode', 400);
      expect(Array.isArray(response.body.message)).toBe(true);
    });

    it('debería validar que el email tenga formato válido', async () => {
      const token = await getAuthToken();
      const storeData = {
        name: 'Tienda Email Inválido',
        address: 'Calle Test 123',
        phone: '+1234567890',
        email: 'email-invalido',
      };

      const response = await request(app.getHttpServer())
        .post('/stores')
        .set('Authorization', `Bearer ${token}`)
        .send(storeData)
        .expect(400);

      expect(response.body).toHaveProperty('statusCode', 400);
    });

    it('debería crear una tienda sin descripción si no se proporciona', async () => {
      const token = await getAuthToken();
      const storeData = {
        name: 'Tienda Sin Descripción',
        address: 'Calle Test 789',
        phone: '+1234567890',
        email: 'sin-desc@tienda.com',
      };

      const response = await request(app.getHttpServer())
        .post('/stores')
        .set('Authorization', `Bearer ${token}`)
        .send(storeData)
        .expect(201);

      const createdStore = getResponseData<Store>(response);
      expect(createdStore.description).toBeNull();
    });

    it('debería validar la longitud mínima del nombre', async () => {
      const token = await getAuthToken();
      const storeData = {
        name: 'A', // Menos de 2 caracteres
        address: 'Calle Test 123',
        phone: '+1234567890',
        email: 'nombre-corto@tienda.com',
      };

      const response = await request(app.getHttpServer())
        .post('/stores')
        .set('Authorization', `Bearer ${token}`)
        .send(storeData)
        .expect(400);

      expect(response.body).toHaveProperty('statusCode', 400);
    });

    it('debería validar la longitud mínima de la dirección', async () => {
      const token = await getAuthToken();
      const storeData = {
        name: 'Tienda Dirección Corta',
        address: 'Call', // Menos de 5 caracteres
        phone: '+1234567890',
        email: 'direccion-corta@tienda.com',
      };

      const response = await request(app.getHttpServer())
        .post('/stores')
        .set('Authorization', `Bearer ${token}`)
        .send(storeData)
        .expect(400);

      expect(response.body).toHaveProperty('statusCode', 400);
    });

    it('debería validar la longitud mínima del teléfono', async () => {
      const token = await getAuthToken();
      const storeData = {
        name: 'Tienda Teléfono Corto',
        address: 'Calle Test 123',
        phone: '123', // Menos de 10 caracteres
        email: 'telefono-corto@tienda.com',
      };

      const response = await request(app.getHttpServer())
        .post('/stores')
        .set('Authorization', `Bearer ${token}`)
        .send(storeData)
        .expect(400);

      expect(response.body).toHaveProperty('statusCode', 400);
    });

    it('debería establecer isActive en true por defecto', async () => {
      const token = await getAuthToken();
      const storeData = {
        name: 'Tienda Activa',
        address: 'Calle Test 456',
        phone: '+1234567890',
        email: 'activa@tienda.com',
      };

      const response = await request(app.getHttpServer())
        .post('/stores')
        .set('Authorization', `Bearer ${token}`)
        .send(storeData)
        .expect(201);

      const createdStore = getResponseData<Store>(response);
      expect(createdStore.isActive).toBe(true);
    });
  });
});
