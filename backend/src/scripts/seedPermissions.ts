import dotenv from 'dotenv';
dotenv.config();

import { AppDataSource } from '../config/database';
import { Permission, ResourceType } from '../models/Permission';
import { UserRole } from '../models/User';

async function seedPermissions() {
  try {
    console.log('🌱 Seeding permissions...');

    await AppDataSource.initialize();
    const permissionRepository = AppDataSource.getRepository(Permission);

    // Clear existing permissions
    await permissionRepository.clear();
    console.log('✅ Cleared existing permissions');

    const permissions: Partial<Permission>[] = [];

    // USER role - Limited access
    permissions.push(
      { role: UserRole.USER, resource: ResourceType.DASHBOARD, canView: true, canCreate: false, canEdit: false, canDelete: false },
      { role: UserRole.USER, resource: ResourceType.MARKET, canView: false, canCreate: false, canEdit: false, canDelete: false },
      { role: UserRole.USER, resource: ResourceType.PLUGINS, canView: false, canCreate: false, canEdit: false, canDelete: false },
      { role: UserRole.USER, resource: ResourceType.USERS, canView: false, canCreate: false, canEdit: false, canDelete: false },
      { role: UserRole.USER, resource: ResourceType.SETTINGS, canView: false, canCreate: false, canEdit: false, canDelete: false },
      { role: UserRole.USER, resource: ResourceType.PROFILE, canView: true, canCreate: false, canEdit: true, canDelete: false }
    );

    // DEVELOPER role - More access
    permissions.push(
      { role: UserRole.DEVELOPER, resource: ResourceType.DASHBOARD, canView: true, canCreate: false, canEdit: false, canDelete: false },
      { role: UserRole.DEVELOPER, resource: ResourceType.MARKET, canView: true, canCreate: true, canEdit: true, canDelete: false },
      { role: UserRole.DEVELOPER, resource: ResourceType.PLUGINS, canView: true, canCreate: true, canEdit: true, canDelete: true },
      { role: UserRole.DEVELOPER, resource: ResourceType.USERS, canView: false, canCreate: false, canEdit: false, canDelete: false },
      { role: UserRole.DEVELOPER, resource: ResourceType.SETTINGS, canView: false, canCreate: false, canEdit: false, canDelete: false },
      { role: UserRole.DEVELOPER, resource: ResourceType.PROFILE, canView: true, canCreate: false, canEdit: true, canDelete: false }
    );

    // ADMIN role - Full access
    permissions.push(
      { role: UserRole.ADMIN, resource: ResourceType.DASHBOARD, canView: true, canCreate: true, canEdit: true, canDelete: true },
      { role: UserRole.ADMIN, resource: ResourceType.MARKET, canView: true, canCreate: true, canEdit: true, canDelete: true },
      { role: UserRole.ADMIN, resource: ResourceType.PLUGINS, canView: true, canCreate: true, canEdit: true, canDelete: true },
      { role: UserRole.ADMIN, resource: ResourceType.USERS, canView: true, canCreate: true, canEdit: true, canDelete: true },
      { role: UserRole.ADMIN, resource: ResourceType.SETTINGS, canView: true, canCreate: true, canEdit: true, canDelete: true },
      { role: UserRole.ADMIN, resource: ResourceType.PROFILE, canView: true, canCreate: false, canEdit: true, canDelete: false }
    );

    await permissionRepository.save(permissions);

    console.log('✅ Permissions seeded successfully');
    console.log(`   - USER: ${permissions.filter(p => p.role === UserRole.USER).length} permissions`);
    console.log(`   - DEVELOPER: ${permissions.filter(p => p.role === UserRole.DEVELOPER).length} permissions`);
    console.log(`   - ADMIN: ${permissions.filter(p => p.role === UserRole.ADMIN).length} permissions`);

    await AppDataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding permissions:', error);
    process.exit(1);
  }
}

seedPermissions();

