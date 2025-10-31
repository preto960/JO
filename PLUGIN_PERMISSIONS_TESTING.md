# Plugin Permissions System - Testing Guide

## Overview
This document outlines the testing procedures for the plugin permissions system implementation.

## System Architecture

### Backend Components
1. **Permission Model** (`backend/src/models/Permission.ts`)
   - Extended with plugin support
   - Fields: `pluginId`, `isDynamic`, `resourceLabel`, `resourceDescription`

2. **Plugin Permission Service** (`backend/src/services/pluginPermissionService.ts`)
   - Handles plugin permission registration/unregistration
   - Provides CRUD operations for plugin permissions

3. **Permission Controller** (`backend/src/controllers/permissionController.ts`)
   - New endpoints for plugin permissions
   - `/api/permissions/base` - Base system permissions
   - `/api/permissions/plugins` - All plugin permissions
   - `/api/permissions/plugin/:pluginId` - Specific plugin permissions
   - `/api/permissions/plugins/grouped` - Grouped by plugin
   - `/api/permissions/plugin` (PUT) - Update plugin permission

4. **Plugin Installation Service** (`backend/src/services/pluginInstallationService.ts`)
   - Integrated permission registration on install
   - Integrated permission cleanup on uninstall

### Frontend Components
1. **Permissions Store** (`frontend/src/stores/permissions.ts`)
   - New methods for plugin permissions
   - `fetchBasePermissions()`, `fetchPluginPermissions()`, `fetchPermissionsByPlugin()`
   - `updatePluginPermission()`

2. **Permissions Matrix Component** (`frontend/src/components/PermissionsMatrix.vue`)
   - Tabs for "Base System" and "Plugin Permissions"
   - Only shows plugin tab if plugins are installed

3. **Plugin Permissions Matrix Component** (`frontend/src/components/PluginPermissionsMatrix.vue`)
   - Plugin selector dropdown
   - Permissions table for selected plugin
   - Auto-disable dependent permissions when View is unchecked

### Publisher Components
1. **Manifest Type** (`publisher/backend/src/types/manifest.ts`)
   - TypeScript interface for plugin manifest
   - Structured permission definitions

2. **Plugin Permissions Composable** (`publisher/src/composables/usePluginPermissions.ts`)
   - Validation and management of plugin permissions
   - Export/import functionality

## Testing Checklist

### 1. Database Schema
- [ ] Verify `permissions` table has new columns:
  - `pluginId` (varchar, nullable)
  - `isDynamic` (boolean, default false)
  - `resourceLabel` (varchar, nullable)
  - `resourceDescription` (varchar, nullable)
- [ ] Verify `resource` column is `varchar` (not enum)
- [ ] Verify indexes exist on `pluginId`

### 2. Backend API Endpoints
Test all new endpoints:

#### Get Base Permissions
```bash
GET http://localhost:3001/api/permissions/base
Authorization: Bearer <admin_token>
```
Expected: Returns only base system permissions (pluginId = null)

#### Get All Plugin Permissions
```bash
GET http://localhost:3001/api/permissions/plugins
Authorization: Bearer <admin_token>
```
Expected: Returns all plugin permissions (pluginId != null)

#### Get Permissions by Plugin
```bash
GET http://localhost:3001/api/permissions/plugin/:pluginId
Authorization: Bearer <admin_token>
```
Expected: Returns permissions for specific plugin

#### Get Grouped Permissions
```bash
GET http://localhost:3001/api/permissions/plugins/grouped
Authorization: Bearer <admin_token>
```
Expected: Returns permissions grouped by plugin

#### Update Plugin Permission
```bash
PUT http://localhost:3001/api/permissions/plugin
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "pluginId": "uuid",
  "role": "USER",
  "resource": "tasks",
  "canView": true,
  "canCreate": true,
  "canEdit": false,
  "canDelete": false
}
```
Expected: Updates permission and returns updated record

### 3. Plugin Installation Flow

#### Install Plugin with Permissions
1. Navigate to Plugin Market
2. Install "Task Manager" plugin
3. Verify in database:
   ```sql
   SELECT * FROM permissions WHERE "pluginId" = '<task-manager-plugin-id>';
   ```
4. Expected: 6 permissions created (2 resources × 3 roles)
   - `tasks` for USER, DEVELOPER, ADMIN
   - `task-categories` for USER, DEVELOPER, ADMIN

#### Check Permission Registration
- [ ] Permissions have correct `pluginId`
- [ ] `isDynamic` is set to `true`
- [ ] `resourceLabel` and `resourceDescription` are populated
- [ ] Default role permissions match manifest

#### Uninstall Plugin
1. Uninstall "Task Manager" plugin
2. Verify in database:
   ```sql
   SELECT * FROM permissions WHERE "pluginId" = '<task-manager-plugin-id>';
   ```
3. Expected: All plugin permissions are deleted

### 4. Frontend UI Testing

#### Settings → Permissions View
1. Login as ADMIN
2. Navigate to Settings → Permissions
3. Verify:
   - [ ] Two tabs visible: "Base System" and "Plugin Permissions" (if plugins installed)
   - [ ] Only "Base System" tab if no plugins installed
   - [ ] Info dropdown works correctly
   - [ ] Reset to Default button works
   - [ ] Save Changes button works

#### Base System Tab
1. Click "Base System" tab
2. Verify:
   - [ ] Shows all base system resources (Dashboard, Market, Plugins, Users, Settings, Profile)
   - [ ] Each resource shows 3 roles (USER, DEVELOPER, ADMIN)
   - [ ] Checkboxes work correctly
   - [ ] Unchecking "View" disables other permissions
   - [ ] Changes are saved correctly

#### Plugin Permissions Tab
1. Install a plugin (e.g., Task Manager)
2. Click "Plugin Permissions" tab
3. Verify:
   - [ ] Plugin selector dropdown shows installed plugins
   - [ ] Selecting a plugin loads its permissions
   - [ ] Permissions table shows correct resources
   - [ ] Resource labels and descriptions are displayed
   - [ ] Checkboxes work correctly
   - [ ] Unchecking "View" disables other permissions
   - [ ] Changes are saved correctly

### 5. Permission Enforcement

#### Test User Access
1. Create test users with different roles:
   - USER
   - DEVELOPER
   - ADMIN

2. Login as USER
3. Modify USER permissions for "tasks" resource:
   - Set `canView = false`
4. Verify:
   - [ ] User cannot access Tasks menu item
   - [ ] Navigating to `/tasks` redirects or shows 403

5. Modify USER permissions for "tasks" resource:
   - Set `canView = true`, `canCreate = false`
6. Verify:
   - [ ] User can view tasks
   - [ ] "Create Task" button is hidden or disabled

### 6. Manifest Validation

#### Check Task Manager Manifest
```json
{
  "permissions": [
    {
      "resource": "tasks",
      "label": "Tasks",
      "description": "Access and manage tasks",
      "actions": ["view", "create", "edit", "delete"],
      "defaultRoles": {
        "USER": {
          "canView": true,
          "canCreate": true,
          "canEdit": true,
          "canDelete": false
        },
        "DEVELOPER": {
          "canView": true,
          "canCreate": true,
          "canEdit": true,
          "canDelete": true
        },
        "ADMIN": {
          "canView": true,
          "canCreate": true,
          "canEdit": true,
          "canDelete": true
        }
      }
    }
  ]
}
```

Verify:
- [ ] Manifest structure is correct
- [ ] All required fields are present
- [ ] Default roles are properly defined

### 7. Edge Cases

#### Multiple Plugins
1. Install multiple plugins with permissions
2. Verify:
   - [ ] All plugins appear in dropdown
   - [ ] Switching between plugins loads correct permissions
   - [ ] No permission conflicts

#### Plugin Update
1. Update a plugin that has permissions
2. Verify:
   - [ ] Existing permissions are preserved
   - [ ] New permissions are added (if manifest changed)
   - [ ] Removed permissions are deleted (if manifest changed)

#### Permission Reset
1. Modify plugin permissions
2. Click "Reset to Default"
3. Verify:
   - [ ] Permissions revert to manifest defaults
   - [ ] Confirmation dialog appears

#### Concurrent Updates
1. Open Settings → Permissions in two browser tabs
2. Modify permissions in both tabs
3. Save in tab 1, then tab 2
4. Verify:
   - [ ] No data loss
   - [ ] Latest changes are applied

## Known Issues & Limitations

1. **Performance**: Loading permissions for plugins with many resources may be slow
2. **Caching**: Permission changes require page refresh to take effect in sidebar
3. **Validation**: Client-side validation only; server-side validation is minimal

## Success Criteria

✅ All backend endpoints work correctly
✅ Plugin installation registers permissions
✅ Plugin uninstallation removes permissions
✅ Frontend UI displays permissions correctly
✅ Permission changes are saved and enforced
✅ Tabs show/hide based on plugin installation
✅ Dependent permissions are auto-disabled
✅ Manifest structure is validated

## Next Steps

1. Implement permission enforcement in plugin routes
2. Add real-time permission updates via WebSocket
3. Create permission templates for common use cases
4. Add audit logging for permission changes
5. Implement permission inheritance/groups

