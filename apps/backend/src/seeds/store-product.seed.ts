import { DataSource } from 'typeorm';
import { StoreProduct } from '../components/products/store-product.entity';
import { Store } from '../components/store/store.entity';
import { Product } from '../components/products/product.entity';




export async function seedStoreProducts(dataSource: DataSource): Promise<void> {
  const storeProductRepository = dataSource.getRepository(StoreProduct);
  const storeRepository = dataSource.getRepository(Store);
  const productRepository = dataSource.getRepository(Product);

  console.log('🌱 Iniciando seed de productos de tiendas...');

  
  const existingCount = await storeProductRepository.count();
  if (existingCount > 0) {
    console.log(
      `⚠️  Ya existen ${existingCount} productos de tiendas en la base de datos.`,
    );
    console.log(
      '💡 Si deseas recrear los datos, elimina los productos de tiendas existentes primero.',
    );
    return;
  }

  
  const stores = await storeRepository.find();
  const products = await productRepository.find();

  if (stores.length === 0) {
    console.log('⚠️  No hay tiendas en la base de datos. Ejecuta primero el seed de tiendas.');
    return;
  }

  if (products.length === 0) {
    console.log(
      '⚠️  No hay productos en la base de datos. Ejecuta primero el seed de productos.',
    );
    return;
  }

  console.log(`📦 Encontradas ${stores.length} tiendas y ${products.length} productos.`);

  
  const storeProducts: Partial<StoreProduct>[] = [];

  
  stores.forEach((store, storeIndex) => {
    
    
    const productsPerStore = Math.ceil(products.length / stores.length);
    const startIndex = storeIndex * productsPerStore;
    const endIndex = Math.min(startIndex + productsPerStore, products.length);

    
    const storeProductsSubset = products.slice(startIndex, endIndex);

    
    const additionalProducts = products
      .filter((p) => !storeProductsSubset.includes(p))
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.floor(products.length * 0.2)); 

    const allProductsForStore = [
      ...storeProductsSubset,
      ...additionalProducts,
    ];

    allProductsForStore.forEach((product, productIndex) => {
      
      const stock = Math.floor(Math.random() * 101);

      
      
      const hasStorePrice = Math.random() > 0.3;
      let storePrice: number | null = null;

      if (hasStorePrice) {
        
        const variation = (Math.random() * 0.35 - 0.2) * product.originalPrice;
        storePrice = Math.round((product.originalPrice + variation) * 100) / 100;
        
        storePrice = Math.max(0.01, storePrice);
      }

      storeProducts.push({
        storeId: store.id,
        productId: product.id,
        stock,
        storePrice,
      });
    });
  });

  
  const createdStoreProducts = storeProductRepository.create(storeProducts);
  await storeProductRepository.save(createdStoreProducts);

  console.log(
    `✅ Se crearon ${createdStoreProducts.length} productos de tiendas exitosamente.`,
  );

  
  console.log('\n📊 Productos por tienda:');
  for (const store of stores) {
    const storeProductsCount = createdStoreProducts.filter(
      (sp) => sp.storeId === store.id,
    ).length;
    const withStock = createdStoreProducts.filter(
      (sp) => sp.storeId === store.id && sp.stock > 0,
    ).length;
    const withPrice = createdStoreProducts.filter(
      (sp) => sp.storeId === store.id && sp.storePrice !== null,
    ).length;

    console.log(
      `   ${store.name}: ${storeProductsCount} productos (${withStock} con stock, ${withPrice} con precio)`,
    );
  }

  
  const totalWithStock = createdStoreProducts.filter((sp) => sp.stock > 0).length;
  const totalWithPrice = createdStoreProducts.filter(
    (sp) => sp.storePrice !== null,
  ).length;

  console.log('\n📈 Estadísticas generales:');
  console.log(`   Total de asociaciones: ${createdStoreProducts.length}`);
  console.log(`   Productos con stock: ${totalWithStock}`);
  console.log(`   Productos con precio de tienda: ${totalWithPrice}`);
}

