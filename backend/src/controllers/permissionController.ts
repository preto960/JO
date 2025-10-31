import { Response } from 'express';
import { AppDataSource } from '../config/database';
import { Permission, ResourceType, PermissionAction } from '../models/Permission';
import { UserRole } from '../models/User';
import { AuthRequest } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';

export class PermissionController {
  private permissionRepository = AppDataSource.getRepository(Permission);

  // Get all permissions
  getAllPermissions = async (req: AuthRequest, res: Response) => {
    try {
      const permissions = await this.permissionRepository.find({
        order: {
          role: 'ASC',
          resource: 'ASC'
        }
      });

      res.json({ permissions });
    } catch (error) {
      console.error('Error fetching permissions:', error);
      res.status(500).json({ message: 'Failed to fetch permissions' });
    }
  };

  // Get permissions by role
  getPermissionsByRole = async (req: AuthRequest, res: Response) => {
    try {
      const { role } = req.params;

      if (!Object.values(UserRole).includes(role as UserRole)) {
        throw createError('Invalid role', 400);
      }

      const permissions = await this.permissionRepository.find({
        where: { role: role as UserRole },
        order: { resource: 'ASC' }
      });

      res.json({ permissions });
    } catch (error) {
      console.error('Error fetching permissions by role:', error);
      res.status(500).json({ message: 'Failed to fetch permissions' });
    }
  };

  // Get current user's permissions
  getMyPermissions = async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      const permissions = await this.permissionRepository.find({
        where: { role: req.user.role },
        order: { resource: 'ASC' }
      });

      res.json({ permissions });
    } catch (error) {
      console.error('Error fetching user permissions:', error);
      res.status(500).json({ message: 'Failed to fetch permissions' });
    }
  };

  // Check if user has permission
  checkPermission = async (req: AuthRequest, res: Response) => {
    try {
      const { role, resource, action } = req.query;

      if (!role || !resource || !action) {
        throw createError('Missing required parameters', 400);
      }

      const permission = await this.permissionRepository.findOne({
        where: {
          role: role as UserRole,
          resource: resource as ResourceType
        }
      });

      if (!permission) {
        return res.json({ hasPermission: false });
      }

      let hasPermission = false;
      switch (action) {
        case PermissionAction.VIEW:
          hasPermission = permission.canView;
          break;
        case PermissionAction.CREATE:
          hasPermission = permission.canCreate;
          break;
        case PermissionAction.EDIT:
          hasPermission = permission.canEdit;
          break;
        case PermissionAction.DELETE:
          hasPermission = permission.canDelete;
          break;
      }

      res.json({ hasPermission });
    } catch (error) {
      console.error('Error checking permission:', error);
      res.status(500).json({ message: 'Failed to check permission' });
    }
  };

  // Update permission
  updatePermission = async (req: AuthRequest, res: Response) => {
    try {
      const { role, resource, canView, canCreate, canEdit, canDelete } = req.body;

      if (!role || !resource) {
        throw createError('Role and resource are required', 400);
      }

      // Find existing permission
      let permission = await this.permissionRepository.findOne({
        where: {
          role: role as UserRole,
          resource: resource as ResourceType
        }
      });

      if (permission) {
        // Update existing
        permission.canView = canView ?? permission.canView;
        permission.canCreate = canCreate ?? permission.canCreate;
        permission.canEdit = canEdit ?? permission.canEdit;
        permission.canDelete = canDelete ?? permission.canDelete;
      } else {
        // Create new
        permission = this.permissionRepository.create({
          role: role as UserRole,
          resource: resource as ResourceType,
          canView: canView ?? false,
          canCreate: canCreate ?? false,
          canEdit: canEdit ?? false,
          canDelete: canDelete ?? false
        });
      }

      await this.permissionRepository.save(permission);

      res.json({
        message: 'Permission updated successfully',
        permission
      });
    } catch (error) {
      console.error('Error updating permission:', error);
      res.status(500).json({ message: 'Failed to update permission' });
    }
  };

  // Bulk update permissions
  bulkUpdatePermissions = async (req: AuthRequest, res: Response) => {
    try {
      const { permissions } = req.body;

      if (!Array.isArray(permissions)) {
        throw createError('Permissions must be an array', 400);
      }

      const results = [];

      for (const perm of permissions) {
        const { role, resource, canView, canCreate, canEdit, canDelete } = perm;

        let permission = await this.permissionRepository.findOne({
          where: {
            role: role as UserRole,
            resource: resource as ResourceType
          }
        });

        if (permission) {
          permission.canView = canView ?? permission.canView;
          permission.canCreate = canCreate ?? permission.canCreate;
          permission.canEdit = canEdit ?? permission.canEdit;
          permission.canDelete = canDelete ?? permission.canDelete;
        } else {
          permission = this.permissionRepository.create({
            role: role as UserRole,
            resource: resource as ResourceType,
            canView: canView ?? false,
            canCreate: canCreate ?? false,
            canEdit: canEdit ?? false,
            canDelete: canDelete ?? false
          });
        }

        await this.permissionRepository.save(permission);
        results.push(permission);
      }

      res.json({
        message: 'Permissions updated successfully',
        permissions: results
      });
    } catch (error) {
      console.error('Error bulk updating permissions:', error);
      res.status(500).json({ message: 'Failed to update permissions' });
    }
  };

  // Reset permissions to default
  resetPermissions = async (req: AuthRequest, res: Response) => {
    try {
      // Delete all existing permissions
      await this.permissionRepository.clear();

      // Create default permissions
      const defaultPermissions = this.getDefaultPermissions();
      await this.permissionRepository.save(defaultPermissions);

      const permissions = await this.permissionRepository.find({
        order: {
          role: 'ASC',
          resource: 'ASC'
        }
      });

      res.json({
        message: 'Permissions reset to default successfully',
        permissions
      });
    } catch (error) {
      console.error('Error resetting permissions:', error);
      res.status(500).json({ message: 'Failed to reset permissions' });
    }
  };

  // Helper method to get default permissions
  private getDefaultPermissions() {
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

    return permissions;
  }
}

