<template>
  <nav class="bg-white shadow-sm border-b">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <router-link to="/" class="text-xl font-bold text-primary-600">
            Plugin Marketplace
          </router-link>
        </div>
        
        <div class="flex items-center space-x-4">
          <template v-if="!authStore.isAuthenticated">
            <router-link 
              to="/login" 
              class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Login
            </router-link>
            <router-link 
              to="/register" 
              class="btn-primary text-sm"
            >
              Register
            </router-link>
          </template>
          
          <template v-else>
            <router-link 
              v-if="authStore.isUser"
              to="/my-plugins" 
              class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              My Plugins
            </router-link>
            <div class="flex items-center space-x-2">
              <span class="text-sm text-gray-600">{{ authStore.user?.name }}</span>
              <button 
                @click="authStore.logout"
                class="btn-secondary text-sm"
              >
                Logout
              </button>
            </div>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>