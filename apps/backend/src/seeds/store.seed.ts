import { DataSource } from 'typeorm';
import { Store } from '../components/store/store.entity';

/**
 * Datos de prueba para tiendas
 */
const storesData: Partial<Store>[] = [
  {
    name: 'Tienda Central',
    description:
      'Tienda principal ubicada en el corazón de la ciudad. Ofrecemos una amplia variedad de productos frescos y de calidad.',
    address: 'Av. Principal 123, Centro, Ciudad',
    phone: '+1234567890',
    email: 'central@tienda.com',
    isActive: true,
  },
  {
    name: 'Tienda Norte',
    description:
      'Ubicada en la zona norte, especializada en productos locales y artesanales.',
    address: 'Calle Norte 456, Zona Norte',
    phone: '+1234567891',
    email: 'norte@tienda.com',
    isActive: true,
  },
  {
    name: 'Tienda Sur',
    description: 'Tienda moderna con las últimas tendencias en productos.',
    address: 'Av. Sur 789, Zona Sur',
    phone: '+1234567892',
    email: 'sur@tienda.com',
    isActive: true,
  },
  {
    name: 'Tienda Este',
    description: 'Pequeña tienda familiar con atención personalizada.',
    address: 'Calle Este 321, Barrio Este',
    phone: '+1234567893',
    email: 'este@tienda.com',
    isActive: true,
  },
  {
    name: 'Tienda Oeste',
    description: 'Tienda especializada en productos orgánicos y naturales.',
    address: 'Av. Oeste 654, Zona Oeste',
    phone: '+1234567894',
    email: 'oeste@tienda.com',
    isActive: true,
  },
  {
    name: 'Tienda Express',
    description:
      'Tienda de conveniencia abierta 24/7 para tus necesidades urgentes.',
    address: 'Calle Express 987, Centro',
    phone: '+1234567895',
    email: 'express@tienda.com',
    isActive: true,
  },
  {
    name: 'Tienda Premium',
    description:
      'Productos de alta gama y servicio exclusivo para clientes exigentes.',
    address: 'Av. Premium 147, Zona Premium',
    phone: '+1234567896',
    email: 'premium@tienda.com',
    isActive: true,
  },
  {
    name: 'Tienda Barrio',
    description: 'Tienda de barrio con productos básicos y precios accesibles.',
    address: 'Calle Barrio 258, Barrio Popular',
    phone: '+1234567897',
    email: 'barrio@tienda.com',
    isActive: true,
  },
  {
    name: 'Tienda Plaza',
    description: 'Ubicada en el centro comercial más grande de la ciudad.',
    address: 'Plaza Central, Local 42, Centro Comercial',
    phone: '+1234567898',
    email: 'plaza@tienda.com',
    isActive: true,
  },
  {
    name: 'Tienda Campus',
    description:
      'Tienda estudiantil con descuentos especiales para estudiantes.',
    address: 'Campus Universitario, Edificio B, Local 12',
    phone: '+1234567899',
    email: 'campus@tienda.com',
    isActive: true,
  },
  {
    name: 'Tienda Temporada',
    description: 'Tienda estacional con productos según la temporada del año.',
    address: 'Av. Temporada 369, Zona Turística',
    phone: '+1234567900',
    email: 'temporada@tienda.com',
    isActive: false,
  },
  {
    name: 'Tienda Digital',
    description: 'Tienda online con punto de recogida físico.',
    address: 'Calle Digital 741, Zona Tecnológica',
    phone: '+1234567901',
    email: 'digital@tienda.com',
    isActive: true,
  },
  {
    name: 'Tienda Artesanal',
    description: 'Productos hechos a mano por artesanos locales.',
    address: 'Mercado Artesanal, Stand 15',
    phone: '+1234567902',
    email: 'artesanal@tienda.com',
    isActive: true,
  },
  {
    name: 'Tienda Gourmet',
    description: 'Especializada en productos gourmet y delicatessen.',
    address: 'Av. Gourmet 852, Zona Gastronómica',
    phone: '+1234567903',
    email: 'gourmet@tienda.com',
    isActive: true,
  },
  {
    name: 'Tienda Vintage',
    description: 'Productos vintage y retro con estilo único.',
    address: 'Calle Vintage 963, Barrio Antiguo',
    phone: '+1234567904',
    email: 'vintage@tienda.com',
    isActive: true,
  },
];

/**
 * Seed para poblar la base de datos con tiendas de prueba
 */
export async function seedStores(dataSource: DataSource): Promise<void> {
  const storeRepository = dataSource.getRepository(Store);

  console.log('🌱 Iniciando seed de tiendas...');

  // Verificar si ya existen tiendas
  const existingCount = await storeRepository.count();
  if (existingCount > 0) {
    console.log(`⚠️  Ya existen ${existingCount} tiendas en la base de datos.`);
    console.log(
      '💡 Si deseas recrear los datos, elimina las tiendas existentes primero.',
    );
    return;
  }

  // Crear las tiendas
  const stores = storeRepository.create(storesData);
  await storeRepository.save(stores);

  console.log(`✅ Se crearon ${stores.length} tiendas exitosamente.`);
  console.log('📦 Tiendas creadas:');
  stores.forEach((store, index) => {
    console.log(`   ${index + 1}. ${store.name} - ${store.email}`);
  });
}
