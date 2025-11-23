import { Store } from '../../../src/components/store/store.entity';

/**
 * Factory para crear tiendas de prueba
 */
export class StoreFactory {
  /**
   * Crea una tienda de prueba con datos por defecto
   */
  static create(overrides?: Partial<Store>): Partial<Store> {
    const defaultStore: Partial<Store> = {
      name: `Tienda Test ${Date.now()}`,
      description: 'Descripción de prueba',
      address: 'Calle Test 123',
      phone: '+1234567890',
      email: `tienda-${Date.now()}@example.com`,
      isActive: true,
      ...overrides,
    };

    return defaultStore;
  }

  /**
   * Crea múltiples tiendas de prueba
   */
  static createMany(count: number): Partial<Store>[] {
    const stores: Partial<Store>[] = [];
    for (let i = 0; i < count; i++) {
      stores.push(
        this.create({
          name: `Tienda Test ${i} ${Date.now()}`,
          email: `tienda-${i}-${Date.now()}@example.com`,
        }),
      );
    }
    return stores;
  }
}

