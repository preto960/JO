<template>
  <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 transition-colors">
    <div class="flex items-center justify-between">
      <!-- Page Title -->
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">{{ pageTitle }}</h2>
        <p class="text-gray-500 dark:text-gray-400 text-sm">{{ pageDescription }}</p>
      </div>

      <!-- Actions -->
      <div class="flex items-center space-x-4">
        <!-- Notifications -->
        <button class="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors relative">
          <Bell class="w-5 h-5" />
          <span class="absolute top-1 right-1 w-2 h-2 bg-accent-500 rounded-full"></span>
        </button>

        <!-- Theme Toggle -->
        <button
          @click="toggleTheme"
          class="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          :title="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
        >
          <Sun v-if="isDark" class="w-5 h-5" />
          <Moon v-else class="w-5 h-5" />
        </button>

        <!-- User Menu -->
        <div class="relative">
          <button
            @click="showUserMenu = !showUserMenu"
            class="flex items-center space-x-2 px-2 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <div class="w-7 h-7 bg-gray-900 dark:bg-white rounded-full flex items-center justify-center">
              <span class="text-white dark:text-gray-900 font-semibold text-xs">
                {{ userInitials }}
              </span>
            </div>
            <ChevronDown class="w-3 h-3 text-gray-600 dark:text-gray-400" />
          </button>

          <!-- Dropdown -->
          <div
            v-if="showUserMenu"
            class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl py-2 z-50"
          >
            <router-link
              to="/settings"
              class="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors"
              @click="showUserMenu = false"
            >
              <Settings class="w-4 h-4" />
              <span>Settings</span>
            </router-link>
            <hr class="my-2 border-gray-200 dark:border-gray-700" />
            <button
              @click="handleLogout"
              class="w-full flex items-center space-x-2 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
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
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Bell, ChevronDown, Settings, LogOut, Sun, Moon } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const showUserMenu = ref(false)
const isDark = ref(true)

// Inicializar tema desde localStorage
onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    isDark.value = savedTheme === 'dark'
  } else {
    // Detectar preferencia del sistema
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  applyTheme()
})

const toggleTheme = () => {
  isDark.value = !isDark.value
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  applyTheme()
}

const applyTheme = () => {
  if (isDark.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

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

