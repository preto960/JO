<template>
  <div class="space-y-6">
    <!-- Search and Filters -->
    <div class="card">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1">
          <div class="relative">
            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search plugins..."
              class="input-field pl-10"
              @input="handleSearch"
            />
          </div>
        </div>
        <select v-model="selectedCategory" @change="handleCategoryChange" class="input-field md:w-48">
          <option value="">All Categories</option>
          <option value="PRODUCTIVITY">Productivity</option>
          <option value="ANALYTICS">Analytics</option>
          <option value="MARKETING">Marketing</option>
          <option value="DEVELOPMENT">Development</option>
          <option value="DESIGN">Design</option>
        </select>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="marketStore.loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      <p class="text-gray-400 mt-4">Loading plugins...</p>
    </div>

    <!-- Plugins Grid -->
    <div v-else-if="marketStore.availablePlugins.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="plugin in marketStore.availablePlugins"
        :key="plugin.id"
        class="card hover:shadow-2xl transition-all cursor-pointer"
        @click="viewPlugin(plugin.id)"
      >
        <!-- Plugin Icon -->
        <div class="w-16 h-16 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl flex items-center justify-center mb-4">
          <Puzzle class="w-8 h-8 text-white" />
        </div>

        <!-- Plugin Info -->
        <h3 class="text-xl font-bold text-white mb-2">{{ plugin.name }}</h3>
        <p class="text-gray-400 text-sm mb-4 line-clamp-2">{{ plugin.description }}</p>

        <!-- Meta -->
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-1">
            <Star class="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span class="text-white text-sm">{{ plugin.rating }}</span>
          </div>
          <div class="flex items-center space-x-1 text-gray-400 text-sm">
            <Download class="w-4 h-4" />
            <span>{{ formatNumber(plugin.downloadCount) }}</span>
          </div>
        </div>

        <!-- Category & Price -->
        <div class="flex items-center justify-between">
          <span class="px-3 py-1 bg-primary-500/20 text-primary-400 text-xs rounded-full">
            {{ plugin.category }}
          </span>
          <span class="text-white font-bold">
            {{ plugin.price ? `$${plugin.price}` : 'Free' }}
          </span>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="card text-center py-12">
      <Store class="w-16 h-16 text-gray-600 mx-auto mb-4" />
      <h3 class="text-xl font-bold text-white mb-2">No plugins found</h3>
      <p class="text-gray-400">Try adjusting your search or filters</p>
    </div>

    <!-- Pagination -->
    <div v-if="marketStore.pagination.totalPages > 1" class="flex justify-center space-x-2">
      <button
        v-for="page in marketStore.pagination.totalPages"
        :key="page"
        @click="changePage(page)"
        class="px-4 py-2 rounded-lg transition-colors"
        :class="page === marketStore.pagination.page ? 'bg-primary-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'"
      >
        {{ page }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Search, Puzzle, Star, Download, Store } from 'lucide-vue-next'
import { useMarketStore } from '@/stores/market'

const router = useRouter()
const marketStore = useMarketStore()

const searchQuery = ref('')
const selectedCategory = ref('')

const formatNumber = (num: number) => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

const handleSearch = () => {
  marketStore.fetchAvailablePlugins({
    search: searchQuery.value,
    category: selectedCategory.value
  })
}

const handleCategoryChange = () => {
  marketStore.fetchAvailablePlugins({
    search: searchQuery.value,
    category: selectedCategory.value
  })
}

const changePage = (page: number) => {
  marketStore.fetchAvailablePlugins({
    page,
    search: searchQuery.value,
    category: selectedCategory.value
  })
}

const viewPlugin = (id: string) => {
  router.push(`/market/${id}`)
}

onMounted(() => {
  marketStore.fetchAvailablePlugins()
})
</script>

