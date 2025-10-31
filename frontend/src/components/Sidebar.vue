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
        <div class="w-8 h-8 bg-gray-900 dark:bg-white rounded-md flex items-center justify-center flex-shrink-0">
          <span class="text-white dark:text-gray-900 font-bold text-sm">A</span>
        </div>
        <div v-if="!props.isCollapsed" class="min-w-0">
          <h1 class="text-gray-900 dark:text-white font-semibold text-base truncate">Admin Panel</h1>
          <p class="text-gray-500 dark:text-gray-400 text-xs truncate">Plugin System</p>
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
        v-if="authStore.isAdmin"
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
          v-if="authStore.isAdmin"
          to="/market"
          class="bottom-action-btn"
          :class="{ 'active': $route.path.startsWith('/market') }"
          title="Plugin Market"
        >
          <Store class="w-5 h-5" />
        </router-link>

        <router-link
          v-if="authStore.isAdmin"
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
            v-if="authStore.isAdmin"
            to="/market"
            class="flex items-center space-x-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            @click="showBottomMenu = false"
          >
            <Store class="w-5 h-5" />
            <span>Plugin Market</span>
          </router-link>

          <router-link
            v-if="authStore.isAdmin"
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

// Props to receive collapsed state
const props = defineProps<{
  isCollapsed: boolean
}>()

const authStore = useAuthStore()
const pluginsStore = usePluginsStore()

const showNotifications = ref(false)
const showBottomMenu = ref(false)
const notificationCount = ref(3) // TODO: Connect to real notification system

const handleNotificationClick = () => {
  showNotifications.value = !showNotifications.value
  showBottomMenu.value = false
  // TODO: Open notifications panel/modal
  console.log('Notifications clicked')
}

const activePlugins = computed(() => {
  return pluginsStore.installedPlugins.filter(p => p.isActive)
})

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

onMounted(() => {
  if (authStore.isAuthenticated) {
    pluginsStore.fetchInstalledPlugins()
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

