import { Repository } from 'typeorm';
import { Product } from '../../../src/components/products/product.entity';
import { ProductFactory } from '../factories/product.factory';

/**
 * Fixtures para tests de productos
 */
export class ProductFixtures {
  /**
   * Crea un producto y lo guarda en la base de datos
   */
  static async createProduct(
    productRepository: Repository<Product>,
    overrides?: Partial<Product>,
  ): Promise<Product> {
    const productData = ProductFactory.create(overrides);
    const product = productRepository.create(productData);
    return await productRepository.save(product);
  }

  /**
   * Crea múltiples productos y los guarda en la base de datos
   */
  static async createManyProducts(
    productRepository: Repository<Product>,
    count: number,
  ): Promise<Product[]> {
    const productsData = ProductFactory.createMany(count);
    const products = productsData.map((data) =>
      productRepository.create(data),
    );
    return await productRepository.save(products);
  }
}

