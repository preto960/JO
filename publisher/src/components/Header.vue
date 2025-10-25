<template>
  <header class="bg-gray-800 border-b border-gray-700 px-6 py-4">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <h1 class="text-2xl font-bold text-white">
          {{ pageTitle }}
        </h1>
      </div>
      
      <div class="flex items-center space-x-4">
        <!-- AI Assistant Button -->
        <button
          @click="openAIAssistant"
          class="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-lg hover:from-primary-700 hover:to-accent-700 transition-colors"
        >
          <Sparkles class="w-4 h-4" />
          <span>AI Assistant</span>
        </button>
        
        <!-- Notifications -->
        <button class="relative p-2 text-gray-400 hover:text-white transition-colors">
          <Bell class="w-5 h-5" />
          <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        <!-- User Menu -->
        <div class="relative">
          <button
            @click="toggleUserMenu"
            class="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <div class="w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
              <span class="text-white text-sm font-medium">
                {{ authStore.user?.firstName?.charAt(0) }}{{ authStore.user?.lastName?.charAt(0) }}
              </span>
            </div>
            <ChevronDown class="w-4 h-4 text-gray-400" />
          </button>
          
          <!-- Dropdown Menu -->
          <div
            v-if="showUserMenu"
            class="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50"
          >
            <div class="p-3 border-b border-gray-700">
              <p class="text-sm font-medium text-white">
                {{ authStore.user?.firstName }} {{ authStore.user?.lastName }}
              </p>
              <p class="text-xs text-gray-400">
                {{ authStore.user?.email }}
              </p>
            </div>
            
            <div class="p-2">
              <router-link
                to="/settings"
                class="flex items-center space-x-2 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors"
              >
                <Settings class="w-4 h-4" />
                <span>Settings</span>
              </router-link>
              
              <button
                @click="handleLogout"
                class="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors"
              >
                <LogOut class="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
  
  <!-- AI Assistant Modal -->
  <AIAssistantModal
    v-if="showAIAssistant"
    @close="closeAIAssistant"
  />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'
import {
  Bell,
  ChevronDown,
  Settings,
  LogOut,
  Sparkles
} from 'lucide-vue-next'
import AIAssistantModal from './AIAssistantModal.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const toast = useToast()

const showUserMenu = ref(false)
const showAIAssistant = ref(false)

const pageTitle = computed(() => {
  const routeName = route.name as string
  return routeName?.replace(/([A-Z])/g, ' $1').trim() || 'Dashboard'
})

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
  toast.success('Logged out successfully')
}

const openAIAssistant = () => {
  showAIAssistant.value = true
}

const closeAIAssistant = () => {
  showAIAssistant.value = false
}

// Close user menu when clicking outside
document.addEventListener('click', (e) => {
  const target = e.target as HTMLElement
  if (!target.closest('.relative')) {
    showUserMenu.value = false
  }
})
</script>