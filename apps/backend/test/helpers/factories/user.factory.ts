import { User } from '../../../src/components/user/user.entity';
import * as bcrypt from 'bcrypt';

/**
 * Factory para crear usuarios de prueba
 */
export class UserFactory {
  /**
   * Crea un usuario de prueba con datos por defecto
   */
  static async create(overrides?: Partial<User>): Promise<Partial<User>> {
    const defaultUser = {
      email: `test-${Date.now()}@example.com`,
      name: 'Test User',
      password: await bcrypt.hash('Test1234!', 10),
      ...overrides,
    };

    return defaultUser;
  }

  /**
   * Crea múltiples usuarios de prueba
   */
  static async createMany(count: number): Promise<Partial<User>[]> {
    const users: Partial<User>[] = [];
    for (let i = 0; i < count; i++) {
      users.push(
        await this.create({ email: `test-${i}-${Date.now()}@example.com` }),
      );
    }
    return users;
  }

  /**
   * Crea un usuario con contraseña sin hashear (útil para tests de login)
   */
  static createPlainPassword(password: string = 'Test1234!'): {
    email: string;
    name: string;
    password: string;
  } {
    return {
      email: `test-${Date.now()}@example.com`,
      name: 'Test User',
      password,
    };
  }
}
