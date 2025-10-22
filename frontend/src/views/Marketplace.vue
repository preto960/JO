<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="bg-white dark:bg-gray-800 p-8 rounded-lg border border-gray-200 dark:border-gray-700">
      <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Available Plugins</h2>
          <p class="text-lg text-gray-600 dark:text-gray-300">Browse and manage plugins for your applications</p>
        </div>
        <div class="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search plugins..."
            class="w-full sm:w-auto px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
          />
          <select
            v-model="selectedCategory"
            class="w-full sm:w-auto px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
          >
            <option value="">All Categories</option>
            <option value="productivity">Productivity</option>
            <option value="analytics">Analytics</option>
            <option value="security">Security</option>
            <option value="integration">Integration</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
              </svg>
            </div>
          </div>
          <div class="ml-4 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-600 dark:text-gray-300">Total Plugins</dt>
              <dd class="text-2xl font-bold text-gray-900 dark:text-white">{{ plugins.length }}</dd>
            </dl>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
          <div class="ml-4 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-600 dark:text-gray-300">Installed</dt>
              <dd class="text-2xl font-bold text-gray-900 dark:text-white">{{ installedCount }}</dd>
            </dl>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
          <div class="ml-4 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-600 dark:text-gray-300">Updates Available</dt>
              <dd class="text-2xl font-bold text-gray-900 dark:text-white">{{ updatesCount }}</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>

    <!-- Plugins Grid -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      <p class="mt-4 text-gray-600 dark:text-gray-300 text-lg">Loading plugins...</p>
    </div>

    <div v-else-if="error" class="bg-white dark:bg-gray-800 p-8 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
      <div class="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </div>
      <p class="text-red-600 dark:text-red-400 text-lg">{{ error }}</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="plugin in filteredPlugins" 
        :key="plugin.id"
        class="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200"
      >
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">{{ plugin.title }}</h3>
          <span class="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            {{ plugin.category }}
          </span>
        </div>
        
        <p class="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">{{ plugin.description }}</p>
        
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center">
            <div class="flex items-center">
              <svg class="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
              <span class="text-sm text-gray-600 dark:text-gray-300">{{ plugin.avgRating.toFixed(1) }}</span>
            </div>
            <span class="text-sm text-gray-500 dark:text-gray-400 ml-2">({{ plugin._count.reviews }} reviews)</span>
          </div>
          <span class="text-lg font-bold text-gray-900 dark:text-white">${{ plugin.price }}</span>
        </div>

        <div class="flex flex-wrap gap-2 mb-4">
          <span 
            v-for="tag in plugin.tags.slice(0, 3)" 
            :key="tag"
            class="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs font-medium"
          >
            {{ tag }}
          </span>
        </div>

        <div class="flex space-x-2">
          <button 
            @click="installPlugin(plugin)"
            class="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200"
          >
            Install
          </button>
          <button 
            @click="viewDetails(plugin)"
            class="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg font-medium transition-colors duration-200"
          >
            Details
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!loading && !error && filteredPlugins.length === 0" class="bg-white dark:bg-gray-800 p-12 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
      <div class="w-16 h-16 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </div>
      <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">No plugins found</h3>
      <p class="text-gray-600 dark:text-gray-300 mb-4">Try adjusting your search or filter criteria</p>
      <button 
        @click="clearFilters"
        class="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200"
      >
        Clear Filters
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { usePluginStore } from '@/stores/plugins'
import type { Plugin } from '@/types'

const router = useRouter()
const authStore = useAuthStore()
const pluginStore = usePluginStore()

const searchQuery = ref('')
const selectedCategory = ref('')

const loading = computed(() => pluginStore.loading)
const error = computed(() => pluginStore.error)
const plugins = computed(() => pluginStore.plugins)

// Mock data for demo purposes
const installedCount = ref(0)
const updatesCount = ref(0)

const filteredPlugins = computed(() => {
  let filtered = plugins.value

  if (searchQuery.value) {
    filtered = filtered.filter(plugin => 
      plugin.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      plugin.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (selectedCategory.value) {
    filtered = filtered.filter(plugin => plugin.category === selectedCategory.value)
  }

  return filtered
})

const clearFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = ''
}

const installPlugin = (plugin: Plugin) => {
  console.log('Installing plugin:', plugin.title)
  // TODO: Implement plugin installation logic
}

const viewDetails = (plugin: Plugin) => {
  console.log('Viewing details for:', plugin.title)
  // TODO: Implement plugin details modal or navigation
}

onMounted(async () => {
  await pluginStore.fetchPlugins()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>