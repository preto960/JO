<template>
  <nav class="glass fixed top-0 left-0 right-0 z-50 fade-in">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16 items-center">
        <div class="flex items-center">
          <router-link to="/" class="text-xl font-bold text-glow flex items-center space-x-2">
            <div class="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg"></div>
            <span>Plugin Marketplace</span>
          </router-link>
        </div>
        
        <div class="flex items-center space-x-4">
          <router-link 
            to="/login" 
            class="glass-button text-sm hover:text-white transition-all duration-300"
          >
            Login
          </router-link>
          <router-link 
            to="/register" 
            class="glass-button text-sm bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 transition-all duration-300"
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