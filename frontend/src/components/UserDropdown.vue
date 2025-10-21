<template>
  <div class="relative">
    <button
      @click="toggleDropdown"
      class="flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
    >
      <div class="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
        <span class="text-white text-sm font-medium">
          {{ user?.username?.charAt(0).toUpperCase() || 'U' }}
        </span>
      </div>
      <span class="text-sm font-medium text-gray-700 dark:text-gray-200">
        {{ user?.username || 'User' }}
      </span>
      <svg 
        class="w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-200"
        :class="{ 'rotate-180': isOpen }"
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
      </svg>
    </button>

    <!-- Dropdown Menu -->
    <div
      v-if="isOpen"
      class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50"
      @click.stop
    >
      <div class="py-1">
        <div class="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
          <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
            {{ user?.username || 'User' }}
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            {{ user?.email || 'user@example.com' }}
          </p>
        </div>
        
        <button
          @click="handleLogout"
          class="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200 flex items-center space-x-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { useToastStore } from '@/stores/toast'

const authStore = useAuthStore()
const router = useRouter()
const toastStore = useToastStore()

const isOpen = ref(false)
const user = computed(() => authStore.user)

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const closeDropdown = () => {
  isOpen.value = false
}

const handleLogout = () => {
  authStore.logout()
  toastStore.success('Logged out successfully')
  router.push('/login')
  closeDropdown()
}

// Close dropdown when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>