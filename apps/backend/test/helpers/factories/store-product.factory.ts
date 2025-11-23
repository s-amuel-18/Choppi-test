import { StoreProduct } from '../../../src/components/products/store-product.entity';

/**
 * Factory para crear instancias de StoreProduct para tests
 */
export class StoreProductFactory {
  /**
   * Crea una instancia de StoreProduct con datos por defecto
   */
  static create(overrides?: Partial<StoreProduct>): Partial<StoreProduct> {
    return {
      stock: 50,
      storePrice: 1199.99,
      ...overrides,
    };
  }
}

