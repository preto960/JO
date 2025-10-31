<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Role Permissions</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Configure access permissions for each role
        </p>
      </div>
      <div class="flex items-center gap-3">
        <!-- Info Button -->
        <div class="relative">
          <button
            @click="showInfo = !showInfo"
            class="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors info-button"
            title="Permission Information"
          >
            <Info class="w-5 h-5" />
          </button>

          <!-- Info Dropdown -->
          <div
            v-if="showInfo"
            class="info-dropdown absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-4 z-50"
          >
            <div class="space-y-3">
              <div>
                <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-2">Permission Roles</h4>
                <div class="space-y-2 text-xs">
                  <div class="flex items-start space-x-2">
                    <span class="font-medium text-gray-900 dark:text-white min-w-[80px]">USER:</span>
                    <span class="text-gray-600 dark:text-gray-400">Basic access to dashboard and profile</span>
                  </div>
                  <div class="flex items-start space-x-2">
                    <span class="font-medium text-gray-900 dark:text-white min-w-[80px]">DEVELOPER:</span>
                    <span class="text-gray-600 dark:text-gray-400">Can manage plugins and marketplace</span>
                  </div>
                  <div class="flex items-start space-x-2">
                    <span class="font-medium text-gray-900 dark:text-white min-w-[80px]">ADMIN:</span>
                    <span class="text-gray-600 dark:text-gray-400">Full system access and control</span>
                  </div>
                </div>
              </div>
              
              <div class="pt-2 border-t border-gray-200 dark:border-gray-700">
                <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-2">Permission Actions</h4>
                <div class="space-y-1.5 text-xs">
                  <div class="flex items-start space-x-2">
                    <span class="font-medium text-gray-900 dark:text-white min-w-[60px]">View:</span>
                    <span class="text-gray-600 dark:text-gray-400">Access to view the resource</span>
                  </div>
                  <div class="flex items-start space-x-2">
                    <span class="font-medium text-gray-900 dark:text-white min-w-[60px]">Create:</span>
                    <span class="text-gray-600 dark:text-gray-400">Ability to create new items</span>
                  </div>
                  <div class="flex items-start space-x-2">
                    <span class="font-medium text-gray-900 dark:text-white min-w-[60px]">Edit:</span>
                    <span class="text-gray-600 dark:text-gray-400">Modify existing items</span>
                  </div>
                  <div class="flex items-start space-x-2">
                    <span class="font-medium text-gray-900 dark:text-white min-w-[60px]">Delete:</span>
                    <span class="text-gray-600 dark:text-gray-400">Remove items permanently</span>
                  </div>
                </div>
              </div>

              <div class="pt-2 border-t border-gray-200 dark:border-gray-700">
                <div class="flex items-start space-x-2 text-xs">
                  <AlertCircle class="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                  <p class="text-gray-600 dark:text-gray-400">
                    <span class="font-medium">Note:</span> Unchecking <span class="font-semibold">View</span> will automatically disable Create, Edit, and Delete permissions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          @click="handleReset"
          :disabled="loading"
          class="btn-secondary text-sm inline-flex items-center justify-center min-w-[140px]"
        >
          <RotateCcw class="w-4 h-4 mr-2 flex-shrink-0" />
          Reset to Default
        </button>
        <button
          @click="handleSave"
          :disabled="loading || !hasChanges"
          class="btn-primary text-sm inline-flex items-center justify-center min-w-[140px]"
        >
          <Save class="w-4 h-4 mr-2 flex-shrink-0" />
          Save Changes
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading && !localPermissions.length" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
      <p class="text-gray-500 dark:text-gray-400 mt-4">Loading permissions...</p>
    </div>

    <!-- Permissions Matrix -->
    <div v-else class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-200 dark:border-gray-700">
              <th class="text-left px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white sticky left-0 bg-white dark:bg-gray-800 z-10">
                Resource
              </th>
              <th 
                v-for="role in roles" 
                :key="role"
                :colspan="4"
                class="text-center px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white border-l border-gray-200 dark:border-gray-700"
              >
                {{ role }}
              </th>
            </tr>
            <tr class="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <th class="sticky left-0 bg-gray-50 dark:bg-gray-800/50 z-10"></th>
              <template v-for="role in roles" :key="`${role}-actions`">
                <th class="text-center px-2 py-2 text-xs font-medium text-gray-600 dark:text-gray-400 border-l border-gray-200 dark:border-gray-700">View</th>
                <th class="text-center px-2 py-2 text-xs font-medium text-gray-600 dark:text-gray-400">Create</th>
                <th class="text-center px-2 py-2 text-xs font-medium text-gray-600 dark:text-gray-400">Edit</th>
                <th class="text-center px-2 py-2 text-xs font-medium text-gray-600 dark:text-gray-400">Delete</th>
              </template>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="resource in resources" 
              :key="resource"
              class="border-b border-gray-200 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <td class="px-4 py-4 sticky left-0 bg-white dark:bg-gray-800 z-10">
                <div class="flex items-center space-x-2">
                  <component :is="getResourceIcon(resource)" class="w-5 h-5 text-gray-400" />
                  <span class="text-sm font-medium text-gray-900 dark:text-white capitalize">
                    {{ resource }}
                  </span>
                </div>
              </td>
              <template v-for="role in roles" :key="`${role}-${resource}`">
                <td class="px-2 py-4 text-center border-l border-gray-200 dark:border-gray-700">
                  <label class="inline-flex items-center cursor-pointer group">
                    <input
                      type="checkbox"
                      :checked="getPermissionAction(role, resource, 'canView')"
                      @change="togglePermissionAction(role, resource, 'canView', $event)"
                      class="permission-checkbox"
                    />
                    <span class="checkbox-custom"></span>
                  </label>
                </td>
                <td class="px-2 py-4 text-center">
                  <label 
                    class="inline-flex items-center group"
                    :class="getPermissionAction(role, resource, 'canView') ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'"
                  >
                    <input
                      type="checkbox"
                      :checked="getPermissionAction(role, resource, 'canCreate')"
                      :disabled="!getPermissionAction(role, resource, 'canView')"
                      @change="togglePermissionAction(role, resource, 'canCreate', $event)"
                      class="permission-checkbox"
                    />
                    <span class="checkbox-custom"></span>
                  </label>
                </td>
                <td class="px-2 py-4 text-center">
                  <label 
                    class="inline-flex items-center group"
                    :class="getPermissionAction(role, resource, 'canView') ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'"
                  >
                    <input
                      type="checkbox"
                      :checked="getPermissionAction(role, resource, 'canEdit')"
                      :disabled="!getPermissionAction(role, resource, 'canView')"
                      @change="togglePermissionAction(role, resource, 'canEdit', $event)"
                      class="permission-checkbox"
                    />
                    <span class="checkbox-custom"></span>
                  </label>
                </td>
                <td class="px-2 py-4 text-center">
                  <label 
                    class="inline-flex items-center group"
                    :class="getPermissionAction(role, resource, 'canView') ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'"
                  >
                    <input
                      type="checkbox"
                      :checked="getPermissionAction(role, resource, 'canDelete')"
                      :disabled="!getPermissionAction(role, resource, 'canView')"
                      @change="togglePermissionAction(role, resource, 'canDelete', $event)"
                      class="permission-checkbox"
                    />
                    <span class="checkbox-custom"></span>
                  </label>
                </td>
              </template>
            </tr>
          </tbody>
        </table>
      </div>
    </div>


    <!-- Changes indicator -->
    <div v-if="hasChanges" class="card bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
      <div class="flex items-center space-x-2 text-blue-700 dark:text-blue-300">
        <AlertCircle class="w-5 h-5" />
        <span class="text-sm font-medium">You have unsaved changes</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { Save, RotateCcw, AlertCircle, LayoutDashboard, Store, Puzzle, Users, Settings as SettingsIcon, User, Info } from 'lucide-vue-next'
import { usePermissionsStore, ResourceType, type Permission } from '@/stores/permissions'
import { useToast } from 'vue-toastification'

const permissionsStore = usePermissionsStore()
const toast = useToast()

const loading = ref(false)
const localPermissions = ref<Permission[]>([])
const hasChanges = ref(false)
const showInfo = ref(false)

const roles = ['USER', 'DEVELOPER', 'ADMIN']
const resources = Object.values(ResourceType)

// Get icon for resource
const getResourceIcon = (resource: string) => {
  const icons: Record<string, any> = {
    dashboard: LayoutDashboard,
    market: Store,
    plugins: Puzzle,
    users: Users,
    settings: SettingsIcon,
    profile: User
  }
  return icons[resource] || LayoutDashboard
}

// Get permission action value for role and resource
const getPermissionAction = (role: string, resource: ResourceType, action: 'canView' | 'canCreate' | 'canEdit' | 'canDelete'): boolean => {
  const permission = localPermissions.value.find(
    p => p.role === role && p.resource === resource
  )
  return permission?.[action] || false
}

// Toggle permission action
const togglePermissionAction = (role: string, resource: ResourceType, action: 'canView' | 'canCreate' | 'canEdit' | 'canDelete', event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.checked

  const permIndex = localPermissions.value.findIndex(
    p => p.role === role && p.resource === resource
  )

  if (permIndex !== -1) {
    localPermissions.value[permIndex][action] = value
    
    // Si se desmarca VIEW, desmarcar automáticamente CREATE, EDIT y DELETE
    if (action === 'canView' && !value) {
      localPermissions.value[permIndex].canCreate = false
      localPermissions.value[permIndex].canEdit = false
      localPermissions.value[permIndex].canDelete = false
    }
  } else {
    // Create new permission entry
    const newPermission: Permission = {
      id: '',
      role,
      resource,
      canView: false,
      canCreate: false,
      canEdit: false,
      canDelete: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    newPermission[action] = value
    localPermissions.value.push(newPermission)
  }

  hasChanges.value = true
}

// Save changes
const handleSave = async () => {
  loading.value = true
  try {
    const result = await permissionsStore.bulkUpdatePermissions(localPermissions.value)
    
    if (result.success) {
      toast.success('Permissions updated successfully')
      hasChanges.value = false
    } else {
      toast.error(result.message || 'Failed to update permissions')
    }
  } catch (error) {
    toast.error('An error occurred while saving permissions')
  } finally {
    loading.value = false
  }
}

// Reset to default
const handleReset = async () => {
  const message = `Are you sure you want to reset all permissions to default?\n\nThis will restore:\n• USER: Dashboard and Profile only\n• DEVELOPER: Dashboard, Market, Plugins, Profile\n• ADMIN: Full access to all resources\n\nThis action cannot be undone.`
  
  if (!confirm(message)) {
    return
  }

  loading.value = true
  try {
    const result = await permissionsStore.resetPermissions()
    
    if (result.success) {
      toast.success('Permissions reset to default successfully')
      localPermissions.value = [...permissionsStore.permissions]
      hasChanges.value = false
    } else {
      toast.error(result.message || 'Failed to reset permissions')
    }
  } catch (error) {
    toast.error('An error occurred while resetting permissions')
  } finally {
    loading.value = false
  }
}

// Close info dropdown when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  const dropdown = document.querySelector('.info-dropdown')
  const button = document.querySelector('.info-button')
  
  if (dropdown && button) {
    if (!dropdown.contains(target) && !button.contains(target)) {
      showInfo.value = false
    }
  }
}

// Load permissions on mount
onMounted(async () => {
  loading.value = true
  await permissionsStore.fetchPermissions()
  localPermissions.value = JSON.parse(JSON.stringify(permissionsStore.permissions))
  loading.value = false
  
  // Add click outside listener
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  // Remove click outside listener
  document.removeEventListener('click', handleClickOutside)
})

// Watch for external changes
watch(() => permissionsStore.permissions, (newPermissions) => {
  if (!hasChanges.value) {
    localPermissions.value = JSON.parse(JSON.stringify(newPermissions))
  }
}, { deep: true })
</script>

<style scoped>
/* Hide default checkbox */
.permission-checkbox {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

/* Custom checkbox */
.checkbox-custom {
  position: relative;
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid #9ca3af;
  border-radius: 4px;
  background-color: transparent;
  transition: all 0.2s ease;
}

/* Dark mode border */
:deep(.dark) .checkbox-custom {
  border-color: #6b7280;
}

/* Hover state */
.group:hover .checkbox-custom {
  border-color: #4b5563;
  background-color: rgba(156, 163, 175, 0.1);
}

:deep(.dark) .group:hover .checkbox-custom {
  border-color: #9ca3af;
  background-color: rgba(156, 163, 175, 0.1);
}

/* Checked state */
.permission-checkbox:checked + .checkbox-custom {
  background-color: #111827;
  border-color: #111827;
}

:deep(.dark) .permission-checkbox:checked + .checkbox-custom {
  background-color: #f9fafb;
  border-color: #f9fafb;
}

/* Checkmark */
.permission-checkbox:checked + .checkbox-custom::after {
  content: '';
  position: absolute;
  left: 6px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

:deep(.dark) .permission-checkbox:checked + .checkbox-custom::after {
  border-color: #111827;
}

/* Focus state */
.permission-checkbox:focus + .checkbox-custom {
  outline: 2px solid #111827;
  outline-offset: 2px;
}

:deep(.dark) .permission-checkbox:focus + .checkbox-custom {
  outline-color: #f9fafb;
}

/* Disabled state */
.permission-checkbox:disabled + .checkbox-custom {
  border-color: #d1d5db;
  background-color: #f3f4f6;
  cursor: not-allowed;
}

:deep(.dark) .permission-checkbox:disabled + .checkbox-custom {
  border-color: #4b5563;
  background-color: #374151;
}

.permission-checkbox:disabled:checked + .checkbox-custom {
  background-color: #e5e7eb;
  border-color: #e5e7eb;
}

:deep(.dark) .permission-checkbox:disabled:checked + .checkbox-custom {
  background-color: #6b7280;
  border-color: #6b7280;
}

.permission-checkbox:disabled:checked + .checkbox-custom::after {
  border-color: #9ca3af;
}

:deep(.dark) .permission-checkbox:disabled:checked + .checkbox-custom::after {
  border-color: #4b5563;
}

/* Smooth transitions */
tr {
  transition: background-color 0.15s ease;
}

/* Sticky column styling */
.sticky {
  position: sticky;
  background: inherit;
}

/* Table borders for better readability */
table {
  border-collapse: separate;
  border-spacing: 0;
}

/* Ensure proper z-index stacking */
thead th.sticky {
  z-index: 20;
}

tbody td.sticky {
  z-index: 10;
}
</style>

