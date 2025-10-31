import dotenv from 'dotenv';
dotenv.config();

import { AppDataSource } from '../config/database';
import { Setting, SettingCategory } from '../models/Setting';

async function seedSettings() {
  try {
    console.log('🌱 Seeding settings...');

    await AppDataSource.initialize();
    const settingRepository = AppDataSource.getRepository(Setting);

    // Clear existing settings
    await settingRepository.clear();
    console.log('✅ Cleared existing settings');

    const settings: Partial<Setting>[] = [
      // General Settings
      { key: 'siteName', value: 'Admin Panel', category: SettingCategory.GENERAL, description: 'Site name displayed in the application', isPublic: true },
      { key: 'siteLogo', value: '', category: SettingCategory.GENERAL, description: 'Site logo URL', isPublic: true },
      { key: 'useLogoOnly', value: 'false', category: SettingCategory.GENERAL, description: 'Show only logo without name', isPublic: true },
      { key: 'language', value: 'en', category: SettingCategory.GENERAL, description: 'Default system language', isPublic: true },
      { key: 'timezone', value: 'UTC', category: SettingCategory.GENERAL, description: 'System timezone', isPublic: false },

      // Plugin Settings
      { key: 'autoUpdate', value: 'true', category: SettingCategory.PLUGINS, description: 'Automatically update plugins', isPublic: false },
      { key: 'hotReload', value: 'true', category: SettingCategory.PLUGINS, description: 'Enable hot reload for plugins', isPublic: false },
      { key: 'allowExternal', value: 'false', category: SettingCategory.PLUGINS, description: 'Allow external plugin sources', isPublic: false },

      // Security Settings
      { key: 'twoFactor', value: 'false', category: SettingCategory.SECURITY, description: 'Require two-factor authentication', isPublic: false },
      { key: 'sessionTimeout', value: '30', category: SettingCategory.SECURITY, description: 'Session timeout in minutes', isPublic: false },
      { key: 'passwordExpiration', value: 'false', category: SettingCategory.SECURITY, description: 'Force password change every 90 days', isPublic: false },

      // Notification Settings
      { key: 'emailNotifications', value: 'true', category: SettingCategory.NOTIFICATIONS, description: 'Enable email notifications', isPublic: false },
      { key: 'browserNotifications', value: 'true', category: SettingCategory.NOTIFICATIONS, description: 'Enable browser notifications', isPublic: false },
      { key: 'pluginUpdateNotifications', value: 'true', category: SettingCategory.NOTIFICATIONS, description: 'Notify on plugin updates', isPublic: false },

      // Advanced Settings
      { key: 'debugMode', value: 'false', category: SettingCategory.ADVANCED, description: 'Enable debug mode', isPublic: false },
      { key: 'cacheDuration', value: '3600', category: SettingCategory.ADVANCED, description: 'Cache duration in seconds', isPublic: false }
    ];

    await settingRepository.save(settings);

    console.log('✅ Settings seeded successfully');
    console.log(`   - GENERAL: ${settings.filter(s => s.category === SettingCategory.GENERAL).length} settings`);
    console.log(`   - PLUGINS: ${settings.filter(s => s.category === SettingCategory.PLUGINS).length} settings`);
    console.log(`   - SECURITY: ${settings.filter(s => s.category === SettingCategory.SECURITY).length} settings`);
    console.log(`   - NOTIFICATIONS: ${settings.filter(s => s.category === SettingCategory.NOTIFICATIONS).length} settings`);
    console.log(`   - ADVANCED: ${settings.filter(s => s.category === SettingCategory.ADVANCED).length} settings`);

    await AppDataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding settings:', error);
    process.exit(1);
  }
}

seedSettings();

