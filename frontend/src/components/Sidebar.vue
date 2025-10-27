<template>
  <aside class="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
    <!-- Logo -->
    <div class="p-6 border-b border-gray-700">
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
          <span class="text-white font-bold text-xl">A</span>
        </div>
        <div>
          <h1 class="text-white font-bold text-lg">Admin Panel</h1>
          <p class="text-gray-400 text-xs">Plugin System</p>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
      <router-link
        to="/dashboard"
        class="nav-item"
        :class="{ 'active': $route.path === '/dashboard' }"
      >
        <LayoutDashboard class="w-5 h-5" />
        <span>Dashboard</span>
      </router-link>

      <router-link
        to="/market"
        class="nav-item"
        :class="{ 'active': $route.path.startsWith('/market') }"
      >
        <Store class="w-5 h-5" />
        <span>Plugin Market</span>
      </router-link>

      <router-link
        to="/plugins"
        class="nav-item"
        :class="{ 'active': $route.path === '/plugins' }"
      >
        <Puzzle class="w-5 h-5" />
        <span>Installed Plugins</span>
      </router-link>

      <router-link
        v-if="authStore.isAdmin"
        to="/users"
        class="nav-item"
        :class="{ 'active': $route.path === '/users' }"
      >
        <Users class="w-5 h-5" />
        <span>Users</span>
      </router-link>

      <router-link
        to="/settings"
        class="nav-item"
        :class="{ 'active': $route.path === '/settings' }"
      >
        <Settings class="w-5 h-5" />
        <span>Settings</span>
      </router-link>
    </nav>

    <!-- User Info -->
    <div class="p-4 border-t border-gray-700">
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
          <span class="text-white font-semibold text-sm">
            {{ userInitials }}
          </span>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-white text-sm font-medium truncate">
            {{ authStore.user?.firstName }} {{ authStore.user?.lastName }}
          </p>
          <p class="text-gray-400 text-xs truncate">{{ authStore.user?.email }}</p>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { LayoutDashboard, Store, Puzzle, Users, Settings } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const userInitials = computed(() => {
  if (!authStore.user) return 'U'
  const first = authStore.user.firstName?.[0] || ''
  const last = authStore.user.lastName?.[0] || ''
  return (first + last).toUpperCase()
})
</script>

<style scoped>
.nav-item {
  @apply flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors;
}

.nav-item.active {
  @apply bg-gradient-to-r from-primary-600 to-accent-600 text-white;
}
</style>

