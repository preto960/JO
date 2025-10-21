<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 p-8 rounded-lg border border-gray-200 dark:border-gray-700">
      <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Plugins</h2>
      <p class="text-lg text-gray-600 dark:text-gray-300">Manage your published plugins and track their performance.</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
            </div>
          </div>
          <div class="ml-4 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-600 dark:text-gray-300">Total Plugins</dt>
              <dd class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.totalPlugins }}</dd>
            </dl>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
              </svg>
            </div>
          </div>
          <div class="ml-4 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-600 dark:text-gray-300">Total Revenue</dt>
              <dd class="text-2xl font-bold text-gray-900 dark:text-white">${{ stats.totalRevenue }}</dd>
            </dl>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
            </div>
          </div>
          <div class="ml-4 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-600 dark:text-gray-300">Total Sales</dt>
              <dd class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.totalSales }}</dd>
            </dl>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
              </svg>
            </div>
          </div>
          <div class="ml-4 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-600 dark:text-gray-300">Avg Rating</dt>
              <dd class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.avgRating }}</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>

    <!-- Create New Plugin Button -->
    <div class="flex justify-between items-center">
      <h3 class="text-xl font-bold text-gray-900 dark:text-white">Your Plugins</h3>
      <button class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors duration-200">
        Create New Plugin
      </button>
    </div>

    <!-- Plugins List -->
    <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div v-if="plugins.length === 0" class="p-12 text-center">
        <div class="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No plugins yet</h3>
        <p class="text-gray-600 dark:text-gray-300 mb-4">Create your first plugin to get started!</p>
        <button class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors duration-200">
          Create New Plugin
        </button>
      </div>
      
      <div v-else class="divide-y divide-gray-200 dark:divide-gray-700">
        <div v-for="plugin in plugins" :key="plugin.id" class="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <div class="flex items-center space-x-3">
                <h4 class="text-lg font-medium text-gray-900 dark:text-white">{{ plugin.title }}</h4>
                <span :class="getStatusClass(plugin.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                  {{ plugin.status }}
                </span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 mt-1">{{ plugin.description }}</p>
              <div class="flex items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                <span>Version {{ plugin.version }}</span>
                <span>•</span>
                <span>${{ plugin.price }}</span>
                <span>•</span>
                <span>{{ plugin._count.purchases }} sales</span>
                <span>•</span>
                <span>⭐ {{ plugin.avgRating }}</span>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <button class="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
                Edit
              </button>
              <button class="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// Mock data - replace with actual API call
const plugins = ref<any[]>([])
const stats = ref({
  totalPlugins: 0,
  totalRevenue: '0.00',
  totalSales: 0,
  avgRating: '0.0'
})

const getStatusClass = (status: string) => {
  switch (status) {
    case 'APPROVED':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
    case 'DRAFT':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    case 'REJECTED':
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
  }
}
</script>