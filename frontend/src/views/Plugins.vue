<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">Browse Plugins</h1>
        
        <!-- Search and Filters -->
        <div class="bg-white p-6 rounded-lg shadow-sm">
          <div class="grid md:grid-cols-4 gap-4">
            <div class="md:col-span-2">
              <input
                v-model="searchQuery"
                @input="searchPlugins"
                type="text"
                placeholder="Search plugins..."
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <select
                v-model="selectedCategory"
                @change="filterPlugins"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                <option value="productivity">Productivity</option>
                <option value="development">Development</option>
                <option value="design">Design</option>
                <option value="marketing">Marketing</option>
                <option value="analytics">Analytics</option>
              </select>
            </div>
            <div>
              <select
                v-model="sortBy"
                @change="sortPlugins"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="createdAt">Newest First</option>
                <option value="price">Price: Low to High</option>
                <option value="price">Price: High to Low</option>
                <option value="avgRating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12 text-red-600">
        {{ error }}
      </div>

      <!-- Plugins Grid -->
      <div v-else class="grid md:grid-cols-3 gap-6">
        <div 
          v-for="plugin in plugins" 
          :key="plugin.id"
          class="bg-white rounded-lg shadow-sm hover:shadow-md transition"
        >
          <div class="p-6">
            <div class="flex justify-between items-start mb-4">
              <h3 class="text-xl font-semibold text-gray-900">{{ plugin.title }}</h3>
              <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                {{ plugin.category }}
              </span>
            </div>
            
            <p class="text-gray-600 mb-4 line-clamp-3">{{ plugin.description }}</p>
            
            <div class="flex items-center mb-4">
              <div class="flex items-center">
                <span class="text-yellow-400">★</span>
                <span class="ml-1 text-sm text-gray-600">
                  {{ plugin.avgRating.toFixed(1) }} ({{ plugin._count.reviews }})
                </span>
              </div>
              <span class="mx-2 text-gray-400">•</span>
              <span class="text-sm text-gray-600">{{ plugin._count.purchases }} sold</span>
            </div>
            
            <div class="flex justify-between items-center">
              <div>
                <span class="text-2xl font-bold text-blue-600">${{ plugin.price }}</span>
              </div>
              <div class="flex space-x-2">
                <router-link 
                  :to="`/plugins/${plugin.id}`"
                  class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  View Details
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.pages > 1" class="mt-8 flex justify-center">
        <nav class="flex items-center space-x-2">
          <button
            @click="changePage(pagination.page - 1)"
            :disabled="pagination.page === 1"
            class="px-3 py-2 rounded-md bg-white border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <span class="px-3 py-2 text-sm text-gray-700">
            Page {{ pagination.page }} of {{ pagination.pages }}
          </span>
          
          <button
            @click="changePage(pagination.page + 1)"
            :disabled="pagination.page === pagination.pages"
            class="px-3 py-2 rounded-md bg-white border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { usePluginStore } from '@/stores/plugins'

const pluginStore = usePluginStore()

const searchQuery = ref('')
const selectedCategory = ref('')
const sortBy = ref('createdAt')
const sortOrder = ref('desc')

const loading = computed(() => pluginStore.loading)
const error = computed(() => pluginStore.error)
const plugins = computed(() => pluginStore.plugins)
const pagination = computed(() => pluginStore.pagination)

const fetchPlugins = async () => {
  await pluginStore.fetchPlugins({
    page: pagination.value.page,
    limit: pagination.value.limit,
    category: selectedCategory.value || undefined,
    search: searchQuery.value || undefined,
    sortBy: sortBy.value,
    sortOrder: sortOrder.value
  })
}

const searchPlugins = () => {
  pluginStore.pagination.page = 1
  fetchPlugins()
}

const filterPlugins = () => {
  pluginStore.pagination.page = 1
  fetchPlugins()
}

const sortPlugins = () => {
  if (sortBy.value === 'price') {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortOrder.value = 'desc'
  }
  fetchPlugins()
}

const changePage = (page: number) => {
  pluginStore.pagination.page = page
  fetchPlugins()
}

onMounted(() => {
  fetchPlugins()
})
</script>