import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../../src/components/user/user.entity';
import { UserFactory } from '../factories/user.factory';

/**
 * Fixtures para tests de autenticación
 */
export class AuthFixtures {
  /**
   * Crea un usuario y lo guarda en la base de datos
   */
  static async createUser(
    userRepository: Repository<User>,
    overrides?: Partial<User>,
  ): Promise<User> {
    const userData = await UserFactory.create(overrides);
    const user = userRepository.create(userData);
    return await userRepository.save(user);
  }

  /**
   * Crea un usuario con contraseña sin hashear y lo guarda
   * Útil para tests de login donde necesitas conocer la contraseña
   */
  static async createUserWithPlainPassword(
    userRepository: Repository<User>,
    password: string = 'Test1234!',
    overrides?: Partial<User>,
  ): Promise<{ user: User; plainPassword: string }> {
    const userData = UserFactory.createPlainPassword(password);
    // Hashear la contraseña antes de guardar
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = userRepository.create({
      ...userData,
      password: hashedPassword,
      ...overrides,
    });
    const savedUser = await userRepository.save(user);
    return { user: savedUser, plainPassword: password };
  }
}
