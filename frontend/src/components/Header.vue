<template>
  <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 transition-colors">
    <div class="flex items-center justify-between">
      <!-- Left: Sidebar Toggle -->
      <button
        @click="toggleSidebar"
        class="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        :title="isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
      >
        <Menu class="w-5 h-5" />
      </button>

      <!-- Actions -->
      <div class="flex items-center space-x-4">
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
            class="user-menu-button flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <div class="w-8 h-8 bg-gray-900 dark:bg-white rounded-full flex items-center justify-center flex-shrink-0">
              <span class="text-white dark:text-gray-900 font-semibold text-sm">
                {{ userInitials }}
              </span>
            </div>
            <div class="text-left">
              <p class="text-sm font-medium text-gray-900 dark:text-white">
                {{ authStore.user?.firstName }} {{ authStore.user?.lastName }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                {{ userRole }}
              </p>
            </div>
            <ChevronDown class="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>

          <!-- Dropdown -->
          <div
            v-if="showUserMenu"
            class="user-menu-dropdown absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl py-2 z-50"
          >
            <router-link
              to="/profile"
              class="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors"
              @click="showUserMenu = false"
            >
              <User class="w-4 h-4" />
              <span>Profile</span>
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
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ChevronDown, User, LogOut, Sun, Moon, Menu } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'

// Props to receive sidebar state
const props = defineProps<{
  isSidebarCollapsed: boolean
}>()

// Emit to toggle sidebar
const emit = defineEmits<{
  toggleSidebar: []
}>()

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const showUserMenu = ref(false)
const isDark = ref(true)

const toggleSidebar = () => {
  emit('toggleSidebar')
}

// Close dropdown when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  const dropdown = document.querySelector('.user-menu-dropdown')
  const button = document.querySelector('.user-menu-button')
  
  if (dropdown && button) {
    if (!dropdown.contains(target) && !button.contains(target)) {
      showUserMenu.value = false
    }
  }
}

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
  
  // Add click outside listener
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  // Remove click outside listener
  document.removeEventListener('click', handleClickOutside)
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

const userInitials = computed(() => {
  if (!authStore.user) return 'U'
  const first = authStore.user.firstName?.[0] || ''
  const last = authStore.user.lastName?.[0] || ''
  return (first + last).toUpperCase()
})

const userRole = computed(() => {
  if (!authStore.user) return 'User'
  return authStore.user.role === 'ADMIN' ? 'Administrator' : 'User'
})

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
  showUserMenu.value = false
}
</script>

