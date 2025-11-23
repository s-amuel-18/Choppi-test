import { Product } from '../../../src/components/products/product.entity';

/**
 * Factory para crear instancias de Product para tests
 */
export class ProductFactory {
  /**
   * Crea una instancia de Product con datos por defecto
   */
  static create(overrides?: Partial<Product>): Partial<Product> {
    return {
      name: 'Laptop Dell XPS 15',
      description: 'Laptop de alto rendimiento con pantalla 4K',
      originalPrice: 1299.99,
      category: 'Electrónica',
      ...overrides,
    };
  }

  /**
   * Crea múltiples instancias de Product
   */
  static createMany(count: number): Partial<Product>[] {
    const products: Partial<Product>[] = [];
    for (let i = 0; i < count; i++) {
      products.push({
        name: `Producto ${i + 1}`,
        description: `Descripción del producto ${i + 1}`,
        originalPrice: 100 + i * 10,
        category: 'Categoría Test',
      });
    }
    return products;
  }
}

