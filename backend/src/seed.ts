import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create demo publisher
  const publisherPassword = await bcrypt.hash('publisher123', 10);
  const publisher = await prisma.publisher.upsert({
    where: { email: 'publisher@example.com' },
    update: {},
    create: {
      email: 'publisher@example.com',
      name: 'Demo Publisher',
      password: publisherPassword,
    },
  });

  // Create demo user
  const userPassword = await bcrypt.hash('user123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: 'Demo User',
      password: userPassword,
    },
  });

  // Create demo plugins
  const plugins = [
    {
      name: 'Advanced Analytics',
      description: 'Comprehensive analytics dashboard for tracking user behavior and performance metrics.',
      version: '1.2.0',
      category: 'Analytics',
      price: 29.99,
      status: 'approved' as const,
      publisherId: publisher.id,
    },
    {
      name: 'SEO Optimizer',
      description: 'Automated SEO optimization tool to improve your website search rankings.',
      version: '2.0.1',
      category: 'SEO',
      price: 19.99,
      status: 'approved' as const,
      publisherId: publisher.id,
    },
    {
      name: 'Social Media Manager',
      description: 'Manage all your social media accounts from one place with scheduling and analytics.',
      version: '1.5.3',
      category: 'Social Media',
      price: 39.99,
      status: 'approved' as const,
      publisherId: publisher.id,
    },
  ];

  for (const pluginData of plugins) {
    await prisma.plugin.create({
      data: pluginData,
    });
  }

  // Create some demo downloads
  const createdPlugins = await prisma.plugin.findMany({
    where: { publisherId: publisher.id },
  });

  for (const plugin of createdPlugins) {
    // Add random downloads
    const downloadCount = Math.floor(Math.random() * 50) + 10;
    for (let i = 0; i < downloadCount; i++) {
      await prisma.download.create({
        data: {
          pluginId: plugin.id,
          createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
        },
      });
    }
  }

  console.log('✅ Database seeded successfully!');
  console.log('📧 Demo publisher: publisher@example.com / publisher123');
  console.log('👤 Demo user: user@example.com / user123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });