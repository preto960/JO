<template>
  <div class="flex flex-col h-full bg-gray-800 border-r border-gray-700">
    <!-- Logo -->
    <div class="flex items-center justify-center h-16 px-4 border-b border-gray-700">
      <div class="flex items-center space-x-2">
        <div class="w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
          <span class="text-white font-bold text-lg">N</span>
        </div>
        <span class="text-white font-bold text-xl">NJO Publisher</span>
      </div>
    </div>
    
    <!-- Navigation -->
    <nav class="flex-1 px-4 py-6 space-y-2">
      <router-link
        v-for="item in navigation"
        :key="item.name"
        :to="item.to"
        class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors"
        :class="[
          $route.path === item.to
            ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white'
            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
        ]"
      >
        <component :is="item.icon" class="w-5 h-5 mr-3" />
        {{ item.name }}
      </router-link>
    </nav>
    
    <!-- User Section -->
    <div class="p-4 border-t border-gray-700">
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
          <span class="text-white text-sm font-medium">
            {{ authStore.user?.firstName?.charAt(0) }}{{ authStore.user?.lastName?.charAt(0) }}
          </span>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-white truncate">
            {{ authStore.user?.firstName }} {{ authStore.user?.lastName }}
          </p>
          <p class="text-xs text-gray-400 truncate">
            {{ authStore.user?.email }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import {
  LayoutDashboard,
  Puzzle,
  PlusCircle,
  TrendingUp,
  Settings,
  LogOut
} from 'lucide-vue-next'

const authStore = useAuthStore()

const navigation = computed(() => [
  {
    name: 'Dashboard',
    to: '/dashboard',
    icon: LayoutDashboard
  },
  {
    name: 'My Plugins',
    to: '/plugins',
    icon: Puzzle
  },
  {
    name: 'Create New Plugin',
    to: '/plugins/create',
    icon: PlusCircle
  },
  {
    name: 'Analytics',
    to: '/analytics',
    icon: TrendingUp
  },
  {
    name: 'Settings',
    to: '/settings',
    icon: Settings
  }
])
</script>