import { DataSource } from 'typeorm';
import { seedStores } from './store.seed';
import { seedProducts } from './product.seed';
import { seedStoreProducts } from './store-product.seed';
import { seedUsers } from './user.seed';

export async function runSeeds(dataSource: DataSource): Promise<void> {
  console.log('🚀 Iniciando proceso de seeds...\n');

  try {
    await seedUsers(dataSource);
    console.log('');

    // Ejecutar seed de tiendas
    await seedStores(dataSource);
    console.log('');

    // Ejecutar seed de productos
    await seedProducts(dataSource);
    console.log('');

    // Ejecutar seed de productos de tiendas
    await seedStoreProducts(dataSource);

    console.log('\n✨ Proceso de seeds completado exitosamente.');
  } catch (error) {
    console.error('❌ Error al ejecutar seeds:', error);
    throw error;
  }
}
