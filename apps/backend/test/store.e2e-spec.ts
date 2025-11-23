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

  describe('PUT /stores/:id', () => {
    it('debería actualizar una tienda existente con autenticación válida', async () => {
      const token = await getAuthToken();
      const store = await StoreFixtures.createStore(storeRepository, {
        name: 'Tienda Original',
        description: 'Descripción original',
        address: 'Dirección Original 123',
        phone: '+1234567890',
        email: 'original@tienda.com',
        isActive: true,
      });

      const updateData = {
        name: 'Tienda Actualizada',
        description: 'Descripción actualizada',
        address: 'Nueva Dirección 456',
        phone: '+9876543210',
        email: 'actualizada@tienda.com',
      };

      const response = await request(app.getHttpServer())
        .put(`/stores/${store.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect(200);

      expectApiResponse(response, true);
      const updatedStore = getResponseData<Store>(response);

      expect(updatedStore).toHaveProperty('id', store.id);
      expect(updatedStore).toHaveProperty('name', updateData.name);
      expect(updatedStore).toHaveProperty(
        'description',
        updateData.description,
      );
      expect(updatedStore).toHaveProperty('address', updateData.address);
      expect(updatedStore).toHaveProperty('phone', updateData.phone);
      expect(updatedStore).toHaveProperty('email', updateData.email);
      expect(updatedStore).toHaveProperty('isActive', true);
      expect(updatedStore).toHaveProperty('createdAt');
      expect(updatedStore).toHaveProperty('updatedAt');
    });

    it('debería actualizar solo los campos proporcionados', async () => {
      const token = await getAuthToken();
      const store = await StoreFixtures.createStore(storeRepository, {
        name: 'Tienda Parcial',
        description: 'Descripción original',
        address: 'Dirección Original 789',
        phone: '+1111111111',
        email: 'parcial@tienda.com',
        isActive: true,
      });

      const updateData = {
        name: 'Solo Nombre Actualizado',
      };

      const response = await request(app.getHttpServer())
        .put(`/stores/${store.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect(200);

      const updatedStore = getResponseData<Store>(response);

      expect(updatedStore.name).toBe(updateData.name);
      expect(updatedStore.description).toBe(store.description);
      expect(updatedStore.address).toBe(store.address);
      expect(updatedStore.phone).toBe(store.phone);
      expect(updatedStore.email).toBe(store.email);
    });

    it('debería rechazar la actualización sin token JWT', async () => {
      const store = await StoreFixtures.createStore(storeRepository, {
        name: 'Tienda Sin Auth',
      });

      const updateData = {
        name: 'Intento de Actualización',
      };

      const response = await request(app.getHttpServer())
        .put(`/stores/${store.id}`)
        .send(updateData)
        .expect(401);

      expectErrorResponse(response, 401);
    });

    it('debería rechazar la actualización con token inválido', async () => {
      const store = await StoreFixtures.createStore(storeRepository, {
        name: 'Tienda Token Inválido',
      });

      const updateData = {
        name: 'Intento de Actualización',
      };

      const response = await request(app.getHttpServer())
        .put(`/stores/${store.id}`)
        .set('Authorization', 'Bearer invalid-token')
        .send(updateData)
        .expect(401);

      expectErrorResponse(response, 401);
    });

    it('debería retornar 404 cuando la tienda no existe', async () => {
      const token = await getAuthToken();
      const nonExistentId = '00000000-0000-0000-0000-000000000000';

      const updateData = {
        name: 'Tienda Inexistente',
      };

      const response = await request(app.getHttpServer())
        .put(`/stores/${nonExistentId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect(404);

      expectErrorResponse(response, 404);
    });

    it('debería retornar 400 cuando el ID tiene formato inválido', async () => {
      const token = await getAuthToken();
      const invalidId = 'invalid-id-format';

      const updateData = {
        name: 'Tienda ID Inválido',
      };

      const response = await request(app.getHttpServer())
        .put(`/stores/${invalidId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect(400);

      expectErrorResponse(response, 400);
    });

    it('debería validar que el nombre tenga longitud mínima si se proporciona', async () => {
      const token = await getAuthToken();
      const store = await StoreFixtures.createStore(storeRepository, {
        name: 'Tienda Válida',
      });

      const updateData = {
        name: 'A', // Menos de 2 caracteres
      };

      const response = await request(app.getHttpServer())
        .put(`/stores/${store.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect(400);

      expect(response.body).toHaveProperty('statusCode', 400);
    });

    it('debería validar que el email tenga formato válido si se proporciona', async () => {
      const token = await getAuthToken();
      const store = await StoreFixtures.createStore(storeRepository, {
        name: 'Tienda Email',
      });

      const updateData = {
        email: 'email-invalido',
      };

      const response = await request(app.getHttpServer())
        .put(`/stores/${store.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect(400);

      expect(response.body).toHaveProperty('statusCode', 400);
    });

    it('debería validar la longitud mínima de la dirección si se proporciona', async () => {
      const token = await getAuthToken();
      const store = await StoreFixtures.createStore(storeRepository, {
        name: 'Tienda Dirección',
      });

      const updateData = {
        address: 'Call', // Menos de 5 caracteres
      };

      const response = await request(app.getHttpServer())
        .put(`/stores/${store.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect(400);

      expect(response.body).toHaveProperty('statusCode', 400);
    });

    it('debería validar la longitud mínima del teléfono si se proporciona', async () => {
      const token = await getAuthToken();
      const store = await StoreFixtures.createStore(storeRepository, {
        name: 'Tienda Teléfono',
      });

      const updateData = {
        phone: '123', // Menos de 10 caracteres
      };

      const response = await request(app.getHttpServer())
        .put(`/stores/${store.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect(400);

      expect(response.body).toHaveProperty('statusCode', 400);
    });

    it('debería permitir actualizar el estado isActive', async () => {
      const token = await getAuthToken();
      const store = await StoreFixtures.createStore(storeRepository, {
        name: 'Tienda Activa',
        isActive: true,
      });

      const updateData = {
        isActive: false,
      };

      const response = await request(app.getHttpServer())
        .put(`/stores/${store.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect(200);

      const updatedStore = getResponseData<Store>(response);
      expect(updatedStore.isActive).toBe(false);
    });

    it('debería permitir actualizar la descripción a null', async () => {
      const token = await getAuthToken();
      const store = await StoreFixtures.createStore(storeRepository, {
        name: 'Tienda Con Descripción',
        description: 'Descripción original',
      });

      const updateData = {
        description: null,
      };

      const response = await request(app.getHttpServer())
        .put(`/stores/${store.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect(200);

      const updatedStore = getResponseData<Store>(response);
      expect(updatedStore.description).toBeNull();
    });

    it('debería actualizar múltiples campos simultáneamente', async () => {
      const token = await getAuthToken();
      const store = await StoreFixtures.createStore(storeRepository, {
        name: 'Tienda Múltiple',
        description: 'Original',
        address: 'Original 123',
        phone: '+1111111111',
        email: 'original@tienda.com',
        isActive: true,
      });

      const updateData = {
        name: 'Tienda Múltiple Actualizada',
        description: 'Nueva descripción',
        address: 'Nueva Dirección 999',
        phone: '+9999999999',
        email: 'nuevo@tienda.com',
        isActive: false,
      };

      const response = await request(app.getHttpServer())
        .put(`/stores/${store.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect(200);

      const updatedStore = getResponseData<Store>(response);
      expect(updatedStore.name).toBe(updateData.name);
      expect(updatedStore.description).toBe(updateData.description);
      expect(updatedStore.address).toBe(updateData.address);
      expect(updatedStore.phone).toBe(updateData.phone);
      expect(updatedStore.email).toBe(updateData.email);
      expect(updatedStore.isActive).toBe(updateData.isActive);
    });

    it('debería mantener los valores originales si se envía un objeto vacío', async () => {
      const token = await getAuthToken();
      const store = await StoreFixtures.createStore(storeRepository, {
        name: 'Tienda Sin Cambios',
        description: 'Descripción original',
        address: 'Dirección original',
        phone: '+1234567890',
        email: 'original@tienda.com',
        isActive: true,
      });

      const updateData = {};

      const response = await request(app.getHttpServer())
        .put(`/stores/${store.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect(200);

      const updatedStore = getResponseData<Store>(response);
      expect(updatedStore.name).toBe(store.name);
      expect(updatedStore.description).toBe(store.description);
      expect(updatedStore.address).toBe(store.address);
      expect(updatedStore.phone).toBe(store.phone);
      expect(updatedStore.email).toBe(store.email);
      expect(updatedStore.isActive).toBe(store.isActive);
    });
  });

  describe('DELETE /stores/:id', () => {
    it('debería eliminar una tienda existente con autenticación válida', async () => {
      const token = await getAuthToken();
      const store = await StoreFixtures.createStore(storeRepository, {
        name: 'Tienda a Eliminar',
        description: 'Esta tienda será eliminada',
        address: 'Dirección de Eliminación 123',
        phone: '+1234567890',
        email: 'eliminar@tienda.com',
        isActive: true,
      });

      const response = await request(app.getHttpServer())
        .delete(`/stores/${store.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty(
        'message',
        'Tienda eliminada exitosamente',
      );

      // Verificar que la tienda ya no existe
      const getResponse = await request(app.getHttpServer())
        .get(`/stores/${store.id}`)
        .expect(404);

      expectErrorResponse(getResponse, 404);
    });

    it('debería rechazar la eliminación sin token JWT', async () => {
      const store = await StoreFixtures.createStore(storeRepository, {
        name: 'Tienda Sin Auth',
      });

      const response = await request(app.getHttpServer())
        .delete(`/stores/${store.id}`)
        .expect(401);

      expectErrorResponse(response, 401);

      // Verificar que la tienda aún existe
      const getResponse = await request(app.getHttpServer())
        .get(`/stores/${store.id}`)
        .expect(200);

      expect(getResponse.body.success).toBe(true);
    });

    it('debería rechazar la eliminación con token inválido', async () => {
      const store = await StoreFixtures.createStore(storeRepository, {
        name: 'Tienda Token Inválido',
      });

      const response = await request(app.getHttpServer())
        .delete(`/stores/${store.id}`)
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expectErrorResponse(response, 401);

      // Verificar que la tienda aún existe
      const getResponse = await request(app.getHttpServer())
        .get(`/stores/${store.id}`)
        .expect(200);

      expect(getResponse.body.success).toBe(true);
    });

    it('debería retornar 404 cuando la tienda no existe', async () => {
      const token = await getAuthToken();
      const nonExistentId = '00000000-0000-0000-0000-000000000000';

      const response = await request(app.getHttpServer())
        .delete(`/stores/${nonExistentId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);

      expectErrorResponse(response, 404);
    });

    it('debería retornar 400 cuando el ID tiene formato inválido', async () => {
      const token = await getAuthToken();
      const invalidId = 'invalid-id-format';

      const response = await request(app.getHttpServer())
        .delete(`/stores/${invalidId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(400);

      expectErrorResponse(response, 400);
    });

    it('debería eliminar una tienda inactiva', async () => {
      const token = await getAuthToken();
      const store = await StoreFixtures.createStore(storeRepository, {
        name: 'Tienda Inactiva a Eliminar',
        isActive: false,
      });

      const response = await request(app.getHttpServer())
        .delete(`/stores/${store.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);

      // Verificar que la tienda ya no existe
      const getResponse = await request(app.getHttpServer())
        .get(`/stores/${store.id}`)
        .expect(404);

      expectErrorResponse(getResponse, 404);
    });

    it('debería eliminar una tienda con todos sus campos', async () => {
      const token = await getAuthToken();
      const store = await StoreFixtures.createStore(storeRepository, {
        name: 'Tienda Completa',
        description: 'Descripción completa',
        address: 'Dirección Completa 456',
        phone: '+9876543210',
        email: 'completa@tienda.com',
        isActive: true,
      });

      const response = await request(app.getHttpServer())
        .delete(`/stores/${store.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);

      // Verificar que la tienda ya no existe
      const getResponse = await request(app.getHttpServer())
        .get(`/stores/${store.id}`)
        .expect(404);

      expectErrorResponse(getResponse, 404);
    });

    it('debería permitir eliminar múltiples tiendas secuencialmente', async () => {
      const token = await getAuthToken();
      const store1 = await StoreFixtures.createStore(storeRepository, {
        name: 'Tienda 1',
      });
      const store2 = await StoreFixtures.createStore(storeRepository, {
        name: 'Tienda 2',
      });
      const store3 = await StoreFixtures.createStore(storeRepository, {
        name: 'Tienda 3',
      });

      // Eliminar primera tienda
      await request(app.getHttpServer())
        .delete(`/stores/${store1.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      // Eliminar segunda tienda
      await request(app.getHttpServer())
        .delete(`/stores/${store2.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      // Eliminar tercera tienda
      await request(app.getHttpServer())
        .delete(`/stores/${store3.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      // Verificar que todas las tiendas fueron eliminadas
      await request(app.getHttpServer())
        .get(`/stores/${store1.id}`)
        .expect(404);

      await request(app.getHttpServer())
        .get(`/stores/${store2.id}`)
        .expect(404);

      await request(app.getHttpServer())
        .get(`/stores/${store3.id}`)
        .expect(404);
    });

    it('debería retornar mensaje de éxito después de eliminar', async () => {
      const token = await getAuthToken();
      const store = await StoreFixtures.createStore(storeRepository, {
        name: 'Tienda Mensaje',
      });

      const response = await request(app.getHttpServer())
        .delete(`/stores/${store.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Tienda eliminada exitosamente');
    });
  });
});
