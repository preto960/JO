import { AppDataSource } from '../config/database';
import { Permission } from '../models/Permission';
import { UserRole } from '../models/User';
import { IsNull } from 'typeorm';

interface PluginPermissionResource {
  resource: string;
  label: string;
  description?: string;
  actions: string[];
  defaultRoles: {
    [role: string]: {
      canView: boolean;
      canCreate: boolean;
      canEdit: boolean;
      canDelete: boolean;
    };
  };
}

export class PluginPermissionService {
  private permissionRepository = AppDataSource.getRepository(Permission);

  /**
   * Register permissions for a plugin when it's installed
   */
  async registerPluginPermissions(
    pluginId: string,
    manifest: { permissions?: PluginPermissionResource[] | any }
  ): Promise<void> {
    // Support both new and old format
    let permissionsArray: PluginPermissionResource[] = [];

    if (!manifest.permissions) {
      console.log(`📋 No permissions defined for plugin ${pluginId}`);
      return;
    }

    // New format: array of permission objects
    if (Array.isArray(manifest.permissions)) {
      permissionsArray = manifest.permissions;
    }
    // Old format: { resources: [...] }
    else if (manifest.permissions.resources) {
      // Convert old format to new format
      permissionsArray = manifest.permissions.resources.map((res: any) => ({
        resource: res.key,
        label: res.label,
        description: res.description,
        actions: ['view', 'create', 'edit', 'delete'],
        defaultRoles: {
          USER: {
            canView: res.actions.view?.default || false,
            canCreate: res.actions.create?.default || false,
            canEdit: res.actions.edit?.default || false,
            canDelete: res.actions.delete?.default || false
          },
          DEVELOPER: {
            canView: res.actions.view?.default || false,
            canCreate: res.actions.create?.default || false,
            canEdit: res.actions.edit?.default || false,
            canDelete: res.actions.delete?.default || false
          },
          ADMIN: {
            canView: true,
            canCreate: true,
            canEdit: true,
            canDelete: true
          }
        }
      }));
    }

    if (permissionsArray.length === 0) {
      console.log(`📋 No permissions defined for plugin ${pluginId}`);
      return;
    }

    console.log(`📋 Registering ${permissionsArray.length} permission resources for plugin ${pluginId}...`);

    for (const permissionDef of permissionsArray) {
      for (const [roleName, rolePermissions] of Object.entries(permissionDef.defaultRoles)) {
        // Check if permission already exists
        const existing = await this.permissionRepository.findOne({
          where: {
            role: roleName as UserRole,
            resource: permissionDef.resource,
            pluginId
          }
        });

        if (existing) {
          console.log(`⚠️  Permission already exists: ${roleName} - ${permissionDef.resource}`);
          continue;
        }

        // Create permission with default values from manifest
        const permission = this.permissionRepository.create({
          role: roleName as UserRole,
          resource: permissionDef.resource,
          pluginId,
          isDynamic: true,
          resourceLabel: permissionDef.label,
          resourceDescription: permissionDef.description || null,
          canView: rolePermissions.canView,
          canCreate: rolePermissions.canCreate,
          canEdit: rolePermissions.canEdit,
          canDelete: rolePermissions.canDelete
        });

        await this.permissionRepository.save(permission);
        console.log(`✅ Created permission: ${roleName} - ${permissionDef.resource}`);
      }
    }

    console.log(`✅ Permissions registered for plugin ${pluginId}`);
  }

  /**
   * Unregister all permissions for a plugin when it's uninstalled
   */
  async unregisterPluginPermissions(pluginId: string): Promise<void> {
    console.log(`📋 Unregistering permissions for plugin ${pluginId}...`);

    const result = await this.permissionRepository.delete({
      pluginId
    });

    console.log(`✅ Deleted ${result.affected || 0} permissions for plugin ${pluginId}`);
  }

  /**
   * Get all permissions for a specific plugin
   */
  async getPluginPermissions(pluginId: string): Promise<Permission[]> {
    return await this.permissionRepository.find({
      where: { pluginId },
      order: {
        role: 'ASC',
        resource: 'ASC'
      }
    });
  }

  /**
   * Get all plugin permissions (from all plugins)
   */
  async getAllPluginPermissions(): Promise<Permission[]> {
    return await this.permissionRepository
      .createQueryBuilder('permission')
      .where('permission.pluginId IS NOT NULL')
      .orderBy('permission.pluginId', 'ASC')
      .addOrderBy('permission.role', 'ASC')
      .addOrderBy('permission.resource', 'ASC')
      .getMany();
  }

  /**
   * Get all base system permissions (not from plugins)
   */
  async getBasePermissions(): Promise<Permission[]> {
    return await this.permissionRepository.find({
      where: { pluginId: IsNull() },
      order: {
        role: 'ASC',
        resource: 'ASC'
      }
    });
  }

  /**
   * Get permissions grouped by plugin
   */
  async getPermissionsGroupedByPlugin(): Promise<Record<string, Permission[]>> {
    const pluginPermissions = await this.getAllPluginPermissions();
    
    const grouped: Record<string, Permission[]> = {};
    
    for (const permission of pluginPermissions) {
      if (!permission.pluginId) continue;
      
      if (!grouped[permission.pluginId]) {
        grouped[permission.pluginId] = [];
      }
      
      grouped[permission.pluginId].push(permission);
    }
    
    return grouped;
  }

  /**
   * Update plugin permission
   */
  async updatePluginPermission(
    pluginId: string,
    role: UserRole,
    resource: string,
    updates: Partial<Pick<Permission, 'canView' | 'canCreate' | 'canEdit' | 'canDelete'>>
  ): Promise<Permission | null> {
    const permission = await this.permissionRepository.findOne({
      where: { pluginId, role, resource }
    });

    if (!permission) {
      return null;
    }

    Object.assign(permission, updates);
    return await this.permissionRepository.save(permission);
  }
}

export const pluginPermissionService = new PluginPermissionService();

