<template>
  <nav class="bg-white shadow-sm border-b">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <router-link to="/" class="text-xl font-bold text-primary-600">
            Publisher Dashboard
          </router-link>
        </div>
        
        <div class="flex items-center space-x-4">
          <router-link 
            to="/" 
            class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            :class="{ 'text-primary-600 border-b-2 border-primary-600': $route.path === '/' }"
          >
            Dashboard
          </router-link>
          <router-link 
            to="/plugins" 
            class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            :class="{ 'text-primary-600 border-b-2 border-primary-600': $route.path === '/plugins' }"
          >
            My Plugins
          </router-link>
          <router-link 
            to="/analytics" 
            class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            :class="{ 'text-primary-600 border-b-2 border-primary-600': $route.path === '/analytics' }"
          >
            Analytics
          </router-link>
          
          <div class="flex items-center space-x-2 ml-4 pl-4 border-l">
            <span class="text-sm text-gray-600">{{ authStore.user?.name }}</span>
            <button 
              @click="authStore.logout"
              class="btn-secondary text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>