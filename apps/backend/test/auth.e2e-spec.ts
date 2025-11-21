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
import { AuthFixtures } from './helpers/fixtures/auth.fixtures';
import { User } from '../src/components/user/user.entity';

describe('Auth (e2e)', () => {
  let app: INestApplication<App>;
  let dataSource: DataSource;
  let userRepository: Repository<User>;

  beforeAll(async () => {
    app = await createTestApp();
    dataSource = getDataSource(app);
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

  describe('POST /auth/signup', () => {
    it('debería registrar un nuevo usuario', async () => {
      const userData = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'Test1234!',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('email', userData.email);
      expect(response.body.data).toHaveProperty('name', userData.name);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).not.toHaveProperty('password');
    });

    it('debería rechazar registro con email duplicado', async () => {
      const userData = {
        email: 'duplicate@example.com',
        name: 'Test User',
        password: 'Test1234!',
      };

      // Crear primer usuario
      await AuthFixtures.createUser(userRepository, { email: userData.email });

      // Intentar crear segundo usuario con mismo email
      await request(app.getHttpServer())
        .post('/auth/signup')
        .send(userData)
        .expect(409);
    });

    it('debería validar que el email sea válido', async () => {
      const userData = {
        email: 'invalid-email',
        name: 'Test User',
        password: 'Test1234!',
      };

      await request(app.getHttpServer())
        .post('/auth/signup')
        .send(userData)
        .expect(400);
    });

    it('debería validar que la contraseña tenga mínimo de caracteres', async () => {
      const userData = {
        email: 'test@example.com',
        name: 'Test User',
        password: '123',
      };

      await request(app.getHttpServer())
        .post('/auth/signup')
        .send(userData)
        .expect(400);
    });
  });

  describe('POST /auth/login', () => {
    it('debería hacer login con credenciales válidas', async () => {
      const { user, plainPassword } =
        await AuthFixtures.createUserWithPlainPassword(
          userRepository,
          'Test1234!',
          {
            email: 'login@example.com',
            name: 'Login User',
          },
        );

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: user.email,
          password: plainPassword,
        })
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data.user.email).toBe(user.email);
    });

    it('debería rechazar login con contraseña incorrecta', async () => {
      const { user } = await AuthFixtures.createUserWithPlainPassword(
        userRepository,
        'CorrectPassword123!',
        {
          email: 'login@example.com',
        },
      );

      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: user.email,
          password: 'WrongPassword123!',
        })
        .expect(401);
    });

    it('debería rechazar login con email inexistente', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'Test1234!',
        })
        .expect(401);
    });
  });
});
