import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'

export enum ResourceType {
  DASHBOARD = 'dashboard',
  MARKET = 'market',
  PLUGINS = 'plugins',
  USERS = 'users',
  SETTINGS = 'settings',
  PROFILE = 'profile'
}

export enum PermissionAction {
  VIEW = 'view',
  CREATE = 'create',
  EDIT = 'edit',
  DELETE = 'delete'
}

export interface Permission {
  id: string
  role: string
  resource: ResourceType
  canView: boolean
  canCreate: boolean
  canEdit: boolean
  canDelete: boolean
  createdAt: string
  updatedAt: string
}

export const usePermissionsStore = defineStore('permissions', () => {
  const permissions = ref<Permission[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Fetch all permissions (admin only)
  const fetchPermissions = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get('/permissions')
      permissions.value = response.data.permissions
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch permissions'
      console.error('Error fetching permissions:', err)
    } finally {
      loading.value = false
    }
  }

  // Fetch current user's permissions
  const fetchMyPermissions = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get('/permissions/my-permissions')
      permissions.value = response.data.permissions
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch permissions'
      console.error('Error fetching permissions:', err)
    } finally {
      loading.value = false
    }
  }

  // Get permissions by role
  const getPermissionsByRole = (role: string): Permission[] => {
    return permissions.value.filter(p => p.role === role)
  }

  // Get permission for specific role and resource
  const getPermission = (role: string, resource: ResourceType): Permission | undefined => {
    return permissions.value.find(p => p.role === role && p.resource === resource)
  }

  // Check if role has permission for action on resource
  const hasPermission = (role: string, resource: ResourceType, action: PermissionAction): boolean => {
    const permission = getPermission(role, resource)
    if (!permission) return false

    switch (action) {
      case PermissionAction.VIEW:
        return permission.canView
      case PermissionAction.CREATE:
        return permission.canCreate
      case PermissionAction.EDIT:
        return permission.canEdit
      case PermissionAction.DELETE:
        return permission.canDelete
      default:
        return false
    }
  }

  // Update single permission
  const updatePermission = async (permissionData: Partial<Permission>) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.put('/permissions', permissionData)
      
      // Update local state
      const index = permissions.value.findIndex(
        p => p.role === permissionData.role && p.resource === permissionData.resource
      )
      
      if (index !== -1) {
        permissions.value[index] = response.data.permission
      } else {
        permissions.value.push(response.data.permission)
      }
      
      return { success: true }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update permission'
      console.error('Error updating permission:', err)
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  // Bulk update permissions
  const bulkUpdatePermissions = async (permissionsData: Partial<Permission>[]) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.put('/permissions/bulk', { permissions: permissionsData })
      
      // Refresh all permissions
      await fetchPermissions()
      
      return { success: true }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update permissions'
      console.error('Error bulk updating permissions:', err)
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  // Reset permissions to default
  const resetPermissions = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await api.post('/permissions/reset')
      permissions.value = response.data.permissions
      return { success: true }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to reset permissions'
      console.error('Error resetting permissions:', err)
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  // Computed: Get all unique roles
  const roles = computed(() => {
    const uniqueRoles = new Set(permissions.value.map(p => p.role))
    return Array.from(uniqueRoles)
  })

  // Computed: Get all unique resources
  const resources = computed(() => {
    const uniqueResources = new Set(permissions.value.map(p => p.resource))
    return Array.from(uniqueResources)
  })

  return {
    permissions,
    loading,
    error,
    roles,
    resources,
    fetchPermissions,
    fetchMyPermissions,
    getPermissionsByRole,
    getPermission,
    hasPermission,
    updatePermission,
    bulkUpdatePermissions,
    resetPermissions
  }
})

