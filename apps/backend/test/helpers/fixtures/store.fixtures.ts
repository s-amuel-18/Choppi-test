import { Repository } from 'typeorm';
import { Store } from '../../../src/components/store/store.entity';
import { StoreFactory } from '../factories/store.factory';

/**
 * Fixtures para tests de tiendas
 */
export class StoreFixtures {
  /**
   * Crea una tienda y la guarda en la base de datos
   */
  static async createStore(
    storeRepository: Repository<Store>,
    overrides?: Partial<Store>,
  ): Promise<Store> {
    const storeData = StoreFactory.create(overrides);
    const store = storeRepository.create(storeData);
    return await storeRepository.save(store);
  }

  /**
   * Crea múltiples tiendas y las guarda en la base de datos
   */
  static async createManyStores(
    storeRepository: Repository<Store>,
    count: number,
  ): Promise<Store[]> {
    const storesData = StoreFactory.createMany(count);
    const stores = storesData.map((data) => storeRepository.create(data));
    return await storeRepository.save(stores);
  }
}

