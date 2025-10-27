<template>
  <header class="bg-gray-800 border-b border-gray-700 px-6 py-4">
    <div class="flex items-center justify-between">
      <!-- Page Title -->
      <div>
        <h2 class="text-2xl font-bold text-white">{{ pageTitle }}</h2>
        <p class="text-gray-400 text-sm">{{ pageDescription }}</p>
      </div>

      <!-- Actions -->
      <div class="flex items-center space-x-4">
        <!-- Notifications -->
        <button class="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors relative">
          <Bell class="w-5 h-5" />
          <span class="absolute top-1 right-1 w-2 h-2 bg-accent-500 rounded-full"></span>
        </button>

        <!-- User Menu -->
        <div class="relative">
          <button
            @click="showUserMenu = !showUserMenu"
            class="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <div class="w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
              <span class="text-white font-semibold text-sm">
                {{ userInitials }}
              </span>
            </div>
            <ChevronDown class="w-4 h-4 text-gray-400" />
          </button>

          <!-- Dropdown -->
          <div
            v-if="showUserMenu"
            class="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl py-2 z-50"
          >
            <router-link
              to="/settings"
              class="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
              @click="showUserMenu = false"
            >
              <Settings class="w-4 h-4" />
              <span>Settings</span>
            </router-link>
            <hr class="my-2 border-gray-700" />
            <button
              @click="handleLogout"
              class="w-full flex items-center space-x-2 px-4 py-2 text-red-400 hover:bg-gray-700 transition-colors"
            >
              <LogOut class="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Bell, ChevronDown, Settings, LogOut } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const showUserMenu = ref(false)

const pageTitle = computed(() => {
  const titles: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/market': 'Plugin Market',
    '/plugins': 'Installed Plugins',
    '/users': 'User Management',
    '/settings': 'Settings'
  }
  return titles[route.path] || 'Admin Panel'
})

const pageDescription = computed(() => {
  const descriptions: Record<string, string> = {
    '/dashboard': 'Overview of your system',
    '/market': 'Discover and install new plugins',
    '/plugins': 'Manage your installed plugins',
    '/users': 'Manage system users',
    '/settings': 'Configure your preferences'
  }
  return descriptions[route.path] || ''
})

const userInitials = computed(() => {
  if (!authStore.user) return 'U'
  const first = authStore.user.firstName?.[0] || ''
  const last = authStore.user.lastName?.[0] || ''
  return (first + last).toUpperCase()
})

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
  showUserMenu.value = false
}
</script>

