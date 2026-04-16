import { prisma } from '../src/lib/prisma'

async function main() {
  console.log('🌱 Iniciando Seed Demo V2 (Marketplace)...')

  await prisma.product.deleteMany();
  await prisma.order.deleteMany();
  await prisma.business.deleteMany();
  await prisma.user.deleteMany();

  const owner = await prisma.user.create({
    data: { email: 'admin@demobites.com', name: 'Admin General', role: 'SELLER' }
  });

  const b1 = await prisma.business.create({
    data: {
      slug: 'demo-bites',
      name: 'Demo Bites',
      description: 'Hamburguesas premium en la ciudad.',
      city: 'Buenos Aires',
      country: 'Argentina',
      ownerId: owner.id
    }
  });

  const b2 = await prisma.business.create({
    data: {
      slug: 'pizza-planeta',
      name: 'Pizza Planeta',
      description: 'Las mejores pizzas al horno de barro.',
      city: 'Lima',
      country: 'Peru',
      ownerId: owner.id
    }
  });

  const b3 = await prisma.business.create({
    data: {
      slug: 'sushi-zen',
      name: 'Sushi Zen',
      description: 'Rolls frescos y cortes tradicionales.',
      city: 'Buenos Aires',
      country: 'Argentina',
      ownerId: owner.id
    }
  });

  // Solo creamos productos demo-bites y pizza para pruebas
  await prisma.product.createMany({
    data: [
      { name: 'Hamburguesa Doble', price: 9000, category: 'Burgers', businessId: b1.id, isActive: true },
      { name: 'Papas Fritas XL', price: 4000, category: 'Guarniciones', businessId: b1.id, isActive: true },
      
      { name: 'Pizza Muzzarella', price: 12000, category: 'Pizzas', businessId: b2.id, isActive: true },
      { name: 'Empanada Carne', price: 1500, category: 'Entradas', businessId: b2.id, isActive: true }
    ]
  });

  console.log('✅ Seed finalizado con éxito: 3 Locales, 4 Productos creados distribuidos en Buenos Aires y Lima.')
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
