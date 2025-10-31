import { ref, computed } from 'vue'
import { useToast } from 'vue-toastification'

export interface PluginPermission {
  resource: string
  label: string
  description: string
  actions: ('view' | 'create' | 'edit' | 'delete')[]
  defaultRoles: {
    USER?: PermissionFlags
    DEVELOPER?: PermissionFlags
    ADMIN?: PermissionFlags
  }
}

export interface PermissionFlags {
  canView: boolean
  canCreate: boolean
  canEdit: boolean
  canDelete: boolean
}

export function usePluginPermissions() {
  const toast = useToast()
  const permissions = ref<PluginPermission[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Validate permission structure
   */
  const validatePermission = (permission: PluginPermission): boolean => {
    if (!permission.resource || typeof permission.resource !== 'string') {
      error.value = 'Permission resource is required and must be a string'
      return false
    }

    if (!permission.label || typeof permission.label !== 'string') {
      error.value = 'Permission label is required and must be a string'
      return false
    }

    if (!permission.actions || !Array.isArray(permission.actions) || permission.actions.length === 0) {
      error.value = 'Permission actions are required and must be a non-empty array'
      return false
    }

    const validActions = ['view', 'create', 'edit', 'delete']
    for (const action of permission.actions) {
      if (!validActions.includes(action)) {
        error.value = `Invalid action: ${action}. Must be one of: ${validActions.join(', ')}`
        return false
      }
    }

    if (!permission.defaultRoles || typeof permission.defaultRoles !== 'object') {
      error.value = 'Permission defaultRoles is required and must be an object'
      return false
    }

    const validRoles = ['USER', 'DEVELOPER', 'ADMIN']
    for (const role of Object.keys(permission.defaultRoles)) {
      if (!validRoles.includes(role)) {
        error.value = `Invalid role: ${role}. Must be one of: ${validRoles.join(', ')}`
        return false
      }

      const flags = permission.defaultRoles[role as keyof typeof permission.defaultRoles]
      if (!flags || typeof flags !== 'object') {
        error.value = `Invalid permission flags for role ${role}`
        return false
      }

      if (
        typeof flags.canView !== 'boolean' ||
        typeof flags.canCreate !== 'boolean' ||
        typeof flags.canEdit !== 'boolean' ||
        typeof flags.canDelete !== 'boolean'
      ) {
        error.value = `Permission flags for role ${role} must be booleans`
        return false
      }
    }

    return true
  }

  /**
   * Load permissions from manifest
   */
  const loadPermissions = (manifestPermissions: PluginPermission[]) => {
    loading.value = true
    error.value = null

    try {
      if (!manifestPermissions || !Array.isArray(manifestPermissions)) {
        throw new Error('Manifest permissions must be an array')
      }

      const validPermissions: PluginPermission[] = []

      for (const permission of manifestPermissions) {
        if (validatePermission(permission)) {
          validPermissions.push(permission)
        } else {
          throw new Error(error.value || 'Invalid permission structure')
        }
      }

      permissions.value = validPermissions
      return true
    } catch (err: any) {
      error.value = err.message
      toast.error(`Failed to load permissions: ${err.message}`)
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * Add a new permission
   */
  const addPermission = (permission: PluginPermission) => {
    if (!validatePermission(permission)) {
      toast.error(error.value || 'Invalid permission')
      return false
    }

    // Check for duplicate resource
    const exists = permissions.value.some(p => p.resource === permission.resource)
    if (exists) {
      error.value = `Permission with resource "${permission.resource}" already exists`
      toast.error(error.value)
      return false
    }

    permissions.value.push(permission)
    toast.success(`Permission "${permission.label}" added`)
    return true
  }

  /**
   * Update an existing permission
   */
  const updatePermission = (resource: string, updates: Partial<PluginPermission>) => {
    const index = permissions.value.findIndex(p => p.resource === resource)
    if (index === -1) {
      error.value = `Permission with resource "${resource}" not found`
      toast.error(error.value)
      return false
    }

    const updated = { ...permissions.value[index], ...updates }

    if (!validatePermission(updated)) {
      toast.error(error.value || 'Invalid permission')
      return false
    }

    permissions.value[index] = updated
    toast.success(`Permission "${updated.label}" updated`)
    return true
  }

  /**
   * Remove a permission
   */
  const removePermission = (resource: string) => {
    const index = permissions.value.findIndex(p => p.resource === resource)
    if (index === -1) {
      error.value = `Permission with resource "${resource}" not found`
      toast.error(error.value)
      return false
    }

    const removed = permissions.value.splice(index, 1)[0]
    toast.success(`Permission "${removed.label}" removed`)
    return true
  }

  /**
   * Get permission by resource
   */
  const getPermission = (resource: string): PluginPermission | undefined => {
    return permissions.value.find(p => p.resource === resource)
  }

  /**
   * Export permissions for manifest
   */
  const exportPermissions = (): PluginPermission[] => {
    return JSON.parse(JSON.stringify(permissions.value))
  }

  /**
   * Clear all permissions
   */
  const clearPermissions = () => {
    permissions.value = []
    error.value = null
  }

  // Computed properties
  const hasPermissions = computed(() => permissions.value.length > 0)
  const permissionCount = computed(() => permissions.value.length)
  const resources = computed(() => permissions.value.map(p => p.resource))

  return {
    permissions,
    loading,
    error,
    hasPermissions,
    permissionCount,
    resources,
    loadPermissions,
    addPermission,
    updatePermission,
    removePermission,
    getPermission,
    exportPermissions,
    clearPermissions,
    validatePermission
  }
}

