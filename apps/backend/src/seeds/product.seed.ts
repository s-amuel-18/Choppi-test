import { DataSource } from 'typeorm';
import { Product } from '../components/products/product.entity';




const productsData: Partial<Product>[] = [
  
  {
    name: 'Laptop Dell XPS 15',
    description:
      'Laptop de alto rendimiento con pantalla 4K, procesador Intel i7 de 11ª generación, 16GB RAM y SSD de 512GB. Perfecta para trabajo y entretenimiento.',
    originalPrice: 1299.99,
    category: 'Electrónica',
  },
  {
    name: 'iPhone 15 Pro',
    description:
      'Smartphone de última generación con pantalla Super Retina XDR, chip A17 Pro, cámara triple de 48MP y batería de larga duración.',
    originalPrice: 999.99,
    category: 'Electrónica',
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    description:
      'Smartphone premium con pantalla AMOLED de 6.8", procesador Snapdragon 8 Gen 3, cámara de 200MP y S Pen incluido.',
    originalPrice: 1199.99,
    category: 'Electrónica',
  },
  {
    name: 'MacBook Air M3',
    description:
      'Laptop ultradelgada con chip Apple M3, pantalla Retina de 13.6", 8GB RAM unificada y SSD de 256GB. Diseño elegante y potente.',
    originalPrice: 1099.99,
    category: 'Electrónica',
  },
  {
    name: 'iPad Pro 12.9"',
    description:
      'Tablet profesional con pantalla Liquid Retina XDR, chip M2, compatibilidad con Apple Pencil y Magic Keyboard.',
    originalPrice: 1099.99,
    category: 'Electrónica',
  },
  {
    name: 'AirPods Pro 2',
    description:
      'Auriculares inalámbricos con cancelación activa de ruido, sonido espacial y resistencia al agua IPX4.',
    originalPrice: 249.99,
    category: 'Electrónica',
  },
  {
    name: 'Sony WH-1000XM5',
    description:
      'Auriculares over-ear con cancelación de ruido líder, sonido Hi-Res Audio y batería de hasta 30 horas.',
    originalPrice: 399.99,
    category: 'Electrónica',
  },
  {
    name: 'Monitor LG UltraWide 34"',
    description:
      'Monitor curvo ultrawide QHD con tecnología IPS, 144Hz de refresco y HDR10. Ideal para gaming y productividad.',
    originalPrice: 549.99,
    category: 'Electrónica',
  },
  {
    name: 'Teclado Mecánico Logitech MX',
    description:
      'Teclado mecánico inalámbrico con switches táctiles, retroiluminación RGB y diseño ergonómico.',
    originalPrice: 149.99,
    category: 'Electrónica',
  },
  {
    name: 'Mouse Logitech MX Master 3S',
    description:
      'Mouse inalámbrico ergonómico con sensor de alta precisión, batería de larga duración y múltiples botones programables.',
    originalPrice: 99.99,
    category: 'Electrónica',
  },

  
  {
    name: 'Camiseta Básica Algodón',
    description:
      'Camiseta de algodón 100% orgánico, corte clásico, disponible en múltiples colores. Cómoda y versátil.',
    originalPrice: 19.99,
    category: 'Ropa',
  },
  {
    name: 'Jeans Slim Fit',
    description:
      'Pantalón vaquero de corte slim, mezclilla premium, elástico para mayor comodidad. Disponible en varios tonos.',
    originalPrice: 79.99,
    category: 'Ropa',
  },
  {
    name: 'Chaqueta Denim',
    description:
      'Chaqueta vaquera clásica, corte regular, bolsillos frontales. Estilo atemporal y versátil.',
    originalPrice: 89.99,
    category: 'Ropa',
  },
  {
    name: 'Zapatillas Deportivas',
    description:
      'Zapatillas para running con tecnología de amortiguación, suela antideslizante y diseño transpirable.',
    originalPrice: 119.99,
    category: 'Ropa',
  },
  {
    name: 'Abrigo Invierno',
    description:
      'Abrigo de invierno con relleno sintético, capucha desmontable y múltiples bolsillos. Impermeable y cálido.',
    originalPrice: 199.99,
    category: 'Ropa',
  },

  
  {
    name: 'Lámpara de Mesa LED',
    description:
      'Lámpara de escritorio con luz LED regulable, diseño moderno y base estable. Perfecta para estudio o trabajo.',
    originalPrice: 49.99,
    category: 'Hogar',
  },
  {
    name: 'Almohada Memory Foam',
    description:
      'Almohada ergonómica con espuma viscoelástica, soporte cervical y funda lavable. Mejora la calidad del sueño.',
    originalPrice: 39.99,
    category: 'Hogar',
  },
  {
    name: 'Set de Sábanas Algodón',
    description:
      'Juego de sábanas de algodón egipcio, incluye sábana bajera, sábana encimera y fundas de almohada. Suave y transpirable.',
    originalPrice: 69.99,
    category: 'Hogar',
  },
  {
    name: 'Cafetera Expresso',
    description:
      'Cafetera espresso automática con sistema de vapor, capacidad para 2 tazas y diseño compacto.',
    originalPrice: 299.99,
    category: 'Hogar',
  },
  {
    name: 'Robot Aspirador',
    description:
      'Aspirador robot inteligente con navegación láser, control por app y batería de larga duración.',
    originalPrice: 399.99,
    category: 'Hogar',
  },

  
  {
    name: 'Bicicleta de Montaña',
    description:
      'Bicicleta todo terreno con suspensión delantera, 21 velocidades y frenos de disco. Ideal para senderos.',
    originalPrice: 599.99,
    category: 'Deportes',
  },
  {
    name: 'Pesas Ajustables',
    description:
      'Set de mancuernas ajustables de 5-25kg cada una, agarre ergonómico y sistema de cambio rápido de peso.',
    originalPrice: 199.99,
    category: 'Deportes',
  },
  {
    name: 'Colchoneta Yoga',
    description:
      'Colchoneta antideslizante de alta densidad, superficie texturizada y fácil de limpiar. Incluye correa de transporte.',
    originalPrice: 29.99,
    category: 'Deportes',
  },
  {
    name: 'Smartwatch Fitness',
    description:
      'Reloj inteligente con monitor de frecuencia cardíaca, GPS integrado, resistencia al agua y batería de 7 días.',
    originalPrice: 249.99,
    category: 'Deportes',
  },
  {
    name: 'Pelota de Fútbol',
    description:
      'Balón oficial de fútbol, tamaño 5, superficie texturizada para mejor control y durabilidad.',
    originalPrice: 24.99,
    category: 'Deportes',
  },

  
  {
    name: 'Kindle Paperwhite',
    description:
      'E-reader con pantalla de 6.8" iluminada, resistencia al agua IPX8 y batería de semanas de duración.',
    originalPrice: 139.99,
    category: 'Libros',
  },
  {
    name: 'Libro: "El Código Limpio"',
    description:
      'Guía esencial para escribir código mantenible y profesional. Edición actualizada con ejemplos prácticos.',
    originalPrice: 34.99,
    category: 'Libros',
  },
  {
    name: 'Auriculares Gaming',
    description:
      'Auriculares para gaming con sonido surround 7.1, micrófono retráctil con cancelación de ruido y RGB.',
    originalPrice: 79.99,
    category: 'Gaming',
  },
  {
    name: 'Teclado Gaming RGB',
    description:
      'Teclado mecánico para gaming con switches rápidos, retroiluminación RGB personalizable y reposamuñecas.',
    originalPrice: 129.99,
    category: 'Gaming',
  },

  
  {
    name: 'Aceite de Oliva Extra Virgen',
    description:
      'Aceite de oliva premium de primera prensada en frío, botella de 500ml. Sabor intenso y auténtico.',
    originalPrice: 18.99,
    category: 'Alimentación',
  },
  {
    name: 'Café en Grano Premium',
    description:
      'Café 100% arábica tostado, paquete de 1kg. Notas de chocolate y caramelo. Origen único.',
    originalPrice: 24.99,
    category: 'Alimentación',
  },
  {
    name: 'Miel Natural de Eucalipto',
    description:
      'Miel pura de eucalipto, frasco de 500g. Sin procesar, rica en antioxidantes y enzimas naturales.',
    originalPrice: 12.99,
    category: 'Alimentación',
  },
  {
    name: 'Chocolate Artesanal 70% Cacao',
    description:
      'Tableta de chocolate negro artesanal, 200g. Ingredientes orgánicos y comercio justo.',
    originalPrice: 8.99,
    category: 'Alimentación',
  },

  
  {
    name: 'Taladro Inalámbrico',
    description:
      'Taladro percutor inalámbrico con batería de litio, velocidad variable y kit de accesorios incluido.',
    originalPrice: 89.99,
    category: 'Herramientas',
  },
  {
    name: 'Juego de Destornilladores',
    description:
      'Set completo de destornilladores profesionales con puntas intercambiables y mango ergonómico.',
    originalPrice: 34.99,
    category: 'Herramientas',
  },
  {
    name: 'Multímetro Digital',
    description:
      'Multímetro profesional con pantalla LCD, medición de voltaje, corriente y resistencia. Incluye cables de prueba.',
    originalPrice: 49.99,
    category: 'Herramientas',
  },
];




export async function seedProducts(dataSource: DataSource): Promise<void> {
  const productRepository = dataSource.getRepository(Product);

  console.log('🌱 Iniciando seed de productos...');

  
  const existingCount = await productRepository.count();
  if (existingCount > 0) {
    console.log(`⚠️  Ya existen ${existingCount} productos en la base de datos.`);
    console.log(
      '💡 Si deseas recrear los datos, elimina los productos existentes primero.',
    );
    return;
  }

  
  const products = productRepository.create(productsData);
  await productRepository.save(products);

  console.log(`✅ Se crearon ${products.length} productos exitosamente.`);
  console.log('📦 Productos creados por categoría:');
  
  
  const byCategory = products.reduce((acc, product) => {
    const category = product.category || 'Sin categoría';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  Object.entries(byCategory).forEach(([category, count]) => {
    console.log(`   ${category}: ${count} productos`);
  });

  console.log('\n📋 Primeros 5 productos:');
  products.slice(0, 5).forEach((product, index) => {
    console.log(`   ${index + 1}. ${product.name} - ${product.originalPrice}€`);
  });
}

