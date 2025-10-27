import 'dotenv/config';
import { AppDataSource } from '../config/database';
import { User, UserRole } from '../models/User';
import { Plugin, PluginStatus, PluginCategory } from '../models/Plugin';
import { Review } from '../models/Review';
import bcrypt from 'bcryptjs';

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log('✅ Database connected');

    const userRepository = AppDataSource.getRepository(User);
    const pluginRepository = AppDataSource.getRepository(Plugin);
    const reviewRepository = AppDataSource.getRepository(Review);

    // Clear existing data (if any)
    const reviewCount = await reviewRepository.count();
    const pluginCount = await pluginRepository.count();
    const userCount = await userRepository.count();
    
    if (reviewCount > 0) await reviewRepository.clear();
    if (pluginCount > 0) await pluginRepository.clear();
    if (userCount > 0) await userRepository.clear();
    
    console.log('🗑️  Cleared existing data');

    // Create users
    const hashedPassword = await bcrypt.hash('password123', 12);

    const admin = userRepository.create({
      email: 'admin@njo.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
      bio: 'Platform administrator',
      isActive: true,
    });

    const developer1 = userRepository.create({
      email: 'john@developer.com',
      password: hashedPassword,
      firstName: 'John',
      lastName: 'Developer',
      role: UserRole.DEVELOPER,
      bio: 'Full-stack developer passionate about creating amazing plugins',
      website: 'https://johndeveloper.com',
      github: 'johndeveloper',
      isActive: true,
    });

    const developer2 = userRepository.create({
      email: 'jane@developer.com',
      password: hashedPassword,
      firstName: 'Jane',
      lastName: 'Smith',
      role: UserRole.DEVELOPER,
      bio: 'UI/UX designer and frontend developer',
      website: 'https://janesmith.com',
      twitter: 'janesmith',
      isActive: true,
    });

    const user1 = userRepository.create({
      email: 'user@example.com',
      password: hashedPassword,
      firstName: 'Regular',
      lastName: 'User',
      role: UserRole.USER,
      isActive: true,
    });

    await userRepository.save([admin, developer1, developer2, user1]);
    console.log('👥 Created users');

    // Create plugins
    const plugin1 = pluginRepository.create({
      name: 'AI Assistant Pro',
      slug: 'ai-assistant-pro',
      description: 'Advanced AI-powered assistant that helps you with daily tasks and boosts productivity.',
      longDescription: 'AI Assistant Pro is a comprehensive productivity tool that leverages cutting-edge artificial intelligence to help you manage your daily tasks, schedule meetings, draft emails, and much more. With natural language processing and machine learning capabilities, it adapts to your workflow and becomes more helpful over time.',
      version: '2.1.0',
      price: 9.99,
      downloadCount: 12543,
      rating: 4.8,
      reviewCount: 0,
      category: PluginCategory.PRODUCTIVITY,
      status: PluginStatus.APPROVED,
      tags: ['ai', 'productivity', 'assistant', 'automation'],
      isPublic: true,
      developer: developer1,
    });

    const plugin2 = pluginRepository.create({
      name: 'Code Optimizer',
      slug: 'code-optimizer',
      description: 'Automatically optimize your code for better performance and readability.',
      longDescription: 'Code Optimizer analyzes your codebase and suggests improvements for performance, readability, and maintainability. It supports multiple programming languages and integrates seamlessly with your development workflow.',
      version: '1.5.2',
      price: 14.99,
      downloadCount: 8932,
      rating: 4.6,
      reviewCount: 0,
      category: PluginCategory.DEVELOPMENT,
      status: PluginStatus.APPROVED,
      tags: ['code', 'optimization', 'performance', 'development'],
      isPublic: true,
      developer: developer1,
    });

    const plugin3 = pluginRepository.create({
      name: 'Design System Kit',
      slug: 'design-system-kit',
      description: 'Complete design system with reusable components and style guides.',
      longDescription: 'A comprehensive design system that includes a library of reusable components, color palettes, typography guidelines, and design patterns. Perfect for maintaining consistency across your projects.',
      version: '3.0.0',
      price: 0,
      downloadCount: 15678,
      rating: 4.9,
      reviewCount: 0,
      category: PluginCategory.DESIGN,
      status: PluginStatus.APPROVED,
      tags: ['design', 'ui', 'components', 'free'],
      isPublic: true,
      developer: developer2,
    });

    const plugin4 = pluginRepository.create({
      name: 'Analytics Dashboard',
      slug: 'analytics-dashboard',
      description: 'Real-time analytics and insights for your applications and websites.',
      longDescription: 'Get detailed insights into your application usage with real-time analytics, custom dashboards, and comprehensive reporting tools. Track user behavior, performance metrics, and business KPIs all in one place.',
      version: '2.3.1',
      price: 19.99,
      downloadCount: 9876,
      rating: 4.7,
      reviewCount: 0,
      category: PluginCategory.ANALYTICS,
      status: PluginStatus.APPROVED,
      tags: ['analytics', 'dashboard', 'metrics', 'reporting'],
      isPublic: true,
      developer: developer2,
    });

    const plugin5 = pluginRepository.create({
      name: 'Social Media Manager',
      slug: 'social-media-manager',
      description: 'Manage all your social media accounts from one unified dashboard.',
      longDescription: 'Streamline your social media management with this all-in-one tool. Schedule posts, track engagement, analyze performance, and manage multiple accounts across different platforms from a single interface.',
      version: '1.8.0',
      price: 12.99,
      downloadCount: 7234,
      rating: 4.5,
      reviewCount: 0,
      category: PluginCategory.MARKETING,
      status: PluginStatus.APPROVED,
      tags: ['social-media', 'marketing', 'scheduling', 'analytics'],
      isPublic: true,
      developer: developer1,
    });

    const plugin6 = pluginRepository.create({
      name: 'Task Automation',
      slug: 'task-automation',
      description: 'Automate repetitive tasks and workflows to save time and increase efficiency.',
      longDescription: 'Task Automation helps you create custom workflows to automate repetitive tasks. With an intuitive visual editor and powerful automation engine, you can streamline your processes and focus on what matters most.',
      version: '1.2.5',
      price: 7.99,
      downloadCount: 11234,
      rating: 4.8,
      reviewCount: 0,
      category: PluginCategory.PRODUCTIVITY,
      status: PluginStatus.APPROVED,
      tags: ['automation', 'workflow', 'productivity', 'efficiency'],
      isPublic: true,
      developer: developer2,
    });

    await pluginRepository.save([plugin1, plugin2, plugin3, plugin4, plugin5, plugin6]);
    console.log('🔌 Created plugins');

    // Create reviews
    const review1 = reviewRepository.create({
      title: 'Amazing productivity boost!',
      content: 'This plugin has completely transformed how I work. The AI suggestions are incredibly accurate and save me hours every week.',
      rating: 5,
      isPublic: true,
      isVerifiedPurchase: true,
      user: user1,
      plugin: plugin1,
    });

    const review2 = reviewRepository.create({
      title: 'Great tool for developers',
      content: 'Code Optimizer has helped me improve my code quality significantly. The suggestions are practical and easy to implement.',
      rating: 4,
      isPublic: true,
      isVerifiedPurchase: true,
      user: user1,
      plugin: plugin2,
    });

    const review3 = reviewRepository.create({
      title: 'Best free design system',
      content: 'Cannot believe this is free! The components are well-designed and the documentation is excellent.',
      rating: 5,
      isPublic: true,
      isVerifiedPurchase: false,
      user: user1,
      plugin: plugin3,
    });

    await reviewRepository.save([review1, review2, review3]);
    console.log('⭐ Created reviews');

    // Update review counts
    plugin1.reviewCount = 1;
    plugin2.reviewCount = 1;
    plugin3.reviewCount = 1;
    await pluginRepository.save([plugin1, plugin2, plugin3]);

    console.log('✅ Seed completed successfully!');
    console.log('\n📝 Test Credentials:');
    console.log('Admin: admin@njo.com / password123');
    console.log('Developer 1: john@developer.com / password123');
    console.log('Developer 2: jane@developer.com / password123');
    console.log('User: user@example.com / password123');

    await AppDataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seed();

