<template>
  <aside 
    :class="[
      'bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300',
      props.isCollapsed ? 'w-16' : 'w-64'
    ]"
  >
    <!-- Logo -->
    <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-center">
      <div class="flex items-center space-x-3 min-w-0">
        <!-- Logo Image or Default Icon -->
        <div v-if="siteLogo" class="w-8 h-8 flex items-center justify-center flex-shrink-0">
          <img :src="siteLogo" :alt="siteName" class="max-w-full max-h-full object-contain" />
        </div>
        <div v-else class="w-8 h-8 bg-gray-900 dark:bg-white rounded-md flex items-center justify-center flex-shrink-0">
          <span class="text-white dark:text-gray-900 font-bold text-sm">{{ siteInitial }}</span>
        </div>
        
              <!-- Site Name (hidden if useLogoOnly is true and logo exists) -->
              <div v-if="!props.isCollapsed && !(useLogoOnly && siteLogo)" class="min-w-0">
                <h1 class="text-gray-900 dark:text-white font-semibold text-base truncate">{{ siteName }}</h1>
              </div>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
      <router-link
        to="/dashboard"
        class="nav-item"
        :class="{ 'active': $route.path === '/dashboard' }"
        :title="props.isCollapsed ? 'Dashboard' : ''"
      >
        <LayoutDashboard class="w-5 h-5 flex-shrink-0" />
        <span v-if="!props.isCollapsed">Dashboard</span>
      </router-link>

      <router-link
        v-if="canViewUsers"
        to="/users"
        class="nav-item"
        :class="{ 'active': $route.path === '/users' }"
        :title="props.isCollapsed ? 'Users' : ''"
      >
        <Users class="w-5 h-5 flex-shrink-0" />
        <span v-if="!props.isCollapsed">Users</span>
      </router-link>

      <!-- Plugins Activos - Integrados directamente en el menú -->
      <router-link
        v-for="plugin in activePlugins"
        :key="plugin.id"
        :to="`/plugins/${plugin.slug}`"
        class="nav-item"
        :class="{ 'active': $route.path.startsWith(`/plugins/${plugin.slug}`) }"
        :title="props.isCollapsed ? plugin.name : ''"
      >
        <Puzzle class="w-5 h-5 flex-shrink-0" />
        <span v-if="!props.isCollapsed">{{ plugin.name }}</span>
      </router-link>
    </nav>

            <!-- Bottom Actions -->
    <div class="p-4 border-t border-gray-200 dark:border-gray-700">
      <!-- Expanded: Show icons horizontally -->
      <div v-if="!props.isCollapsed" class="flex items-center justify-center flex-row gap-2">
        <router-link
          v-if="canViewMarket"
          to="/market"
          class="bottom-action-btn"
          :class="{ 'active': $route.path.startsWith('/market') }"
          title="Plugin Market"
        >
          <Store class="w-5 h-5" />
        </router-link>

        <router-link
          v-if="canViewSettings"
          to="/settings"
          class="bottom-action-btn"
          :class="{ 'active': $route.path === '/settings' }"
          title="Settings"
        >
          <Settings class="w-5 h-5" />
        </router-link>

        <button
          @click="showNotifications = !showNotifications"
          class="bottom-action-btn relative"
          title="Notifications"
        >
          <Bell class="w-5 h-5" />
          <span v-if="notificationCount > 0" class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {{ notificationCount }}
          </span>
        </button>
      </div>

      <!-- Collapsed: Show dropdown menu -->
      <div v-else class="relative">
        <button
          @click="showBottomMenu = !showBottomMenu"
          class="bottom-action-btn bottom-menu-button w-full relative"
          title="Menu"
        >
          <MoreVertical class="w-5 h-5" />
          <span v-if="notificationCount > 0" class="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <!-- Dropdown Menu -->
        <div
          v-if="showBottomMenu"
          class="bottom-menu-dropdown absolute bottom-full left-0 mb-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl py-2 z-50"
        >
          <router-link
            v-if="canViewMarket"
            to="/market"
            class="flex items-center space-x-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            @click="showBottomMenu = false"
          >
            <Store class="w-5 h-5" />
            <span>Plugin Market</span>
          </router-link>

          <router-link
            v-if="canViewSettings"
            to="/settings"
            class="flex items-center space-x-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            @click="showBottomMenu = false"
          >
            <Settings class="w-5 h-5" />
            <span>Settings</span>
          </router-link>

          <button
            @click="handleNotificationClick"
            class="w-full flex items-center space-x-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Bell class="w-5 h-5" />
            <span>Notifications</span>
            <span v-if="notificationCount > 0" class="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
              {{ notificationCount }}
            </span>
          </button>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { LayoutDashboard, Store, Puzzle, Users, Settings, Bell, MoreVertical } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { usePluginsStore } from '@/stores/plugins'
import { usePermissionsStore, ResourceType, PermissionAction } from '@/stores/permissions'
import { useSettingsStore } from '@/stores/settings'

// Props to receive collapsed state
const props = defineProps<{
  isCollapsed: boolean
}>()

const authStore = useAuthStore()
const pluginsStore = usePluginsStore()
const permissionsStore = usePermissionsStore()
const settingsStore = useSettingsStore()

const showNotifications = ref(false)
const showBottomMenu = ref(false)
const notificationCount = ref(3) // TODO: Connect to real notification system

// Get site settings
const siteName = computed(() => settingsStore.siteName || 'Admin Panel')
const siteLogo = computed(() => settingsStore.siteLogo)
const useLogoOnly = computed(() => settingsStore.useLogoOnly)
const siteInitial = computed(() => siteName.value.charAt(0).toUpperCase())

const handleNotificationClick = () => {
  showNotifications.value = !showNotifications.value
  showBottomMenu.value = false
  // TODO: Open notifications panel/modal
  console.log('Notifications clicked')
}

const activePlugins = computed(() => {
  return pluginsStore.installedPlugins.filter(p => p.isActive)
})

// Check if user has permission to view a resource
const canView = (resource: ResourceType): boolean => {
  if (!authStore.user) return false
  
  // Load permissions if not loaded
  if (permissionsStore.permissions.length === 0) {
    return authStore.isAdmin // Fallback to admin check
  }
  
  return permissionsStore.hasPermission(
    authStore.user.role,
    resource,
    PermissionAction.VIEW
  )
}

// Computed properties for menu visibility
const canViewMarket = computed(() => canView(ResourceType.MARKET))
const canViewSettings = computed(() => canView(ResourceType.SETTINGS))
const canViewUsers = computed(() => canView(ResourceType.USERS))

// Close dropdown when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  const dropdown = document.querySelector('.bottom-menu-dropdown')
  const button = document.querySelector('.bottom-menu-button')
  
  if (dropdown && button) {
    if (!dropdown.contains(target) && !button.contains(target)) {
      showBottomMenu.value = false
    }
  }
}

onMounted(async () => {
  if (authStore.isAuthenticated) {
    pluginsStore.fetchInstalledPlugins()
    
    // Load permissions based on user role
    if (permissionsStore.permissions.length === 0) {
      if (authStore.isAdmin) {
        await permissionsStore.fetchPermissions()
      } else {
        await permissionsStore.fetchMyPermissions()
      }
    }
    
    // Load settings (will use cache if recently loaded)
    await settingsStore.fetchSettings(false, false)
  }
  
  // Add click outside listener
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  // Remove click outside listener
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.nav-item {
  @apply flex items-center space-x-3 px-3 py-2 rounded-md text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors relative;
}

.nav-item.active {
  @apply bg-gray-900 dark:bg-white text-white dark:text-gray-900;
}

/* Centered icons when collapsed */
aside.w-16 .nav-item {
  @apply justify-center;
}

/* Bottom action buttons - always icon only */
.bottom-action-btn {
  @apply flex items-center justify-center p-2 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors relative;
}

.bottom-action-btn.active {
  @apply bg-gray-900 dark:bg-white text-white dark:text-gray-900;
}
</style>

