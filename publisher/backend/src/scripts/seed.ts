import 'dotenv/config';
import { AppDataSource } from '../config/database';
import { Developer, DeveloperRole } from '../models/Developer';
import { PublishedPlugin, PluginStatus, PluginCategory } from '../models/PublishedPlugin';
import bcrypt from 'bcryptjs';

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log('✅ Publisher Database connected');

    const developerRepository = AppDataSource.getRepository(Developer);
    const pluginRepository = AppDataSource.getRepository(PublishedPlugin);

    // Clear existing data (delete plugins first due to foreign key)
    const pluginCount = await pluginRepository.count();
    const developerCount = await developerRepository.count();
    
    if (pluginCount > 0) {
      await AppDataSource.query('DELETE FROM published_plugins');
    }
    if (developerCount > 0) {
      await AppDataSource.query('DELETE FROM developers');
    }
    
    console.log('🗑️  Cleared existing data');

    // Create developers
    const hashedPassword = await bcrypt.hash('admin123', 12);

    const admin = developerRepository.create({
      email: 'admin@example.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'Publisher',
      role: DeveloperRole.ADMIN,
      bio: 'Publisher platform administrator',
      isActive: true,
    });

    const developer1 = developerRepository.create({
      email: 'dev1@publisher.com',
      password: hashedPassword,
      firstName: 'Alice',
      lastName: 'Developer',
      role: DeveloperRole.DEVELOPER,
      bio: 'Full-stack developer creating awesome plugins',
      website: 'https://alicedev.com',
      github: 'alicedev',
      isActive: true,
    });

    const developer2 = developerRepository.create({
      email: 'dev2@publisher.com',
      password: hashedPassword,
      firstName: 'Bob',
      lastName: 'Creator',
      role: DeveloperRole.DEVELOPER,
      bio: 'Plugin creator and UI/UX enthusiast',
      website: 'https://bobcreator.com',
      twitter: 'bobcreator',
      isActive: true,
    });

    await developerRepository.save([admin, developer1, developer2]);
    console.log('👥 Created developers');

    // Create sample plugins
    const plugin1 = pluginRepository.create({
      name: 'Advanced Analytics Plugin',
      slug: 'advanced-analytics-plugin',
      description: 'Comprehensive analytics dashboard with real-time insights',
      longDescription: 'This plugin provides advanced analytics capabilities including real-time data visualization, custom reports, and predictive analytics using machine learning.',
      version: '1.0.0',
      price: 29.99,
      category: PluginCategory.ANALYTICS,
      status: PluginStatus.PUBLISHED,
      tags: ['analytics', 'dashboard', 'reports', 'ml'],
      isPublic: true,
      publishedAt: new Date(),
      developer: developer1,
    });

    const plugin2 = pluginRepository.create({
      name: 'Email Marketing Suite',
      slug: 'email-marketing-suite',
      description: 'Complete email marketing solution with automation',
      longDescription: 'Powerful email marketing plugin with campaign management, automation workflows, A/B testing, and detailed analytics.',
      version: '2.1.0',
      price: 49.99,
      category: PluginCategory.MARKETING,
      status: PluginStatus.PUBLISHED,
      tags: ['email', 'marketing', 'automation', 'campaigns'],
      isPublic: true,
      publishedAt: new Date(),
      developer: developer1,
    });

    const plugin3 = pluginRepository.create({
      name: 'Task Manager Pro',
      slug: 'task-manager-pro',
      description: 'Professional task and project management tool',
      longDescription: 'Streamline your workflow with this comprehensive task management plugin featuring Kanban boards, Gantt charts, time tracking, and team collaboration.',
      version: '1.5.0',
      price: 19.99,
      category: PluginCategory.PRODUCTIVITY,
      status: PluginStatus.PUBLISHED,
      tags: ['tasks', 'project-management', 'productivity', 'collaboration'],
      isPublic: true,
      publishedAt: new Date(),
      developer: developer2,
    });

    const plugin4 = pluginRepository.create({
      name: 'Social Media Manager',
      slug: 'social-media-manager',
      description: 'Manage all your social media accounts in one place',
      longDescription: 'Schedule posts, track engagement, analyze performance across multiple social media platforms from a unified dashboard.',
      version: '1.0.0',
      price: 0,
      category: PluginCategory.SOCIAL,
      status: PluginStatus.DRAFT,
      tags: ['social-media', 'scheduling', 'analytics', 'free'],
      isPublic: false,
      developer: developer2,
    });

    await pluginRepository.save([plugin1, plugin2, plugin3, plugin4]);
    console.log('🔌 Created sample plugins');

    console.log('✅ Publisher seed completed successfully!');
    console.log('\n📝 Test Credentials:');
    console.log('Admin: admin@example.com / admin123');
    console.log('Developer 1: dev1@publisher.com / admin123');
    console.log('Developer 2: dev2@publisher.com / admin123');

    await AppDataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('❌ Publisher seed failed:', error);
    process.exit(1);
  }
}

seed();

