<template>
  <nav v-if="!authStore.isAuthenticated" class="bg-white shadow-sm border-b">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <router-link to="/" class="text-xl font-bold text-primary-600">
            Plugin Marketplace
          </router-link>
        </div>
        
        <div class="flex items-center space-x-4">
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
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>