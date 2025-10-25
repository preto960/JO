<template>
  <div class="min-h-screen bg-gray-900">
    <!-- Header -->
    <div class="bg-gray-800 border-b border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 class="text-3xl font-bold text-white">Browse Plugins</h1>
            <p class="text-gray-400 mt-1">Discover the perfect plugins for your needs</p>
          </div>
          
          <div class="mt-4 md:mt-0 flex flex-col sm:flex-row gap-4">
            <div class="relative">
              <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search plugins..."
                class="input-field pl-10"
              />
            </div>
            
            <select
              v-model="selectedCategory"
              class="input-field"
            >
              <option value="">All Categories</option>
              <option value="PRODUCTIVITY">Productivity</option>
              <option value="ENTERTAINMENT">Entertainment</option>
              <option value="EDUCATION">Education</option>
              <option value="BUSINESS">Business</option>
              <option value="DEVELOPMENT">Development</option>
              <option value="DESIGN">Design</option>
              <option value="MARKETING">Marketing</option>
              <option value="ANALYTICS">Analytics</option>
              <option value="SOCIAL">Social</option>
              <option value="UTILITY">Utility</option>
            </select>
            
            <select
              v-model="sortBy"
              class="input-field"
            >
              <option value="createdAt">Newest First</option>
              <option value="downloadCount">Most Downloaded</option>
              <option value="rating">Highest Rated</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Results -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Results Count -->
      <div class="flex justify-between items-center mb-6">
        <p class="text-gray-400">
          Showing {{ filteredPlugins.length }} plugins
        </p>
        
        <div class="flex items-center space-x-2">
          <button
            @click="viewMode = 'grid'"
            class="p-2 rounded hover:bg-gray-700 transition-colors"
            :class="{ 'bg-gray-700': viewMode === 'grid' }"
          >
            <Grid class="w-4 h-4 text-gray-400" />
          </button>
          <button
            @click="viewMode = 'list'"
            class="p-2 rounded hover:bg-gray-700 transition-colors"
            :class="{ 'bg-gray-700': viewMode === 'list' }"
          >
            <List class="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredPlugins.length === 0" class="text-center py-12">
        <Puzzle class="w-16 h-16 mx-auto mb-4 text-gray-500" />
        <h3 class="text-lg font-medium text-white mb-2">No plugins found</h3>
        <p class="text-gray-400">
          {{ searchQuery || selectedCategory ? 'Try adjusting your search or filters' : 'No plugins available yet' }}
        </p>
      </div>

      <!-- Grid View -->
      <div v-else-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="plugin in filteredPlugins"
          :key="plugin.id"
          class="card hover:shadow-2xl transition-all duration-200 group cursor-pointer"
          @click="$router.push(`/plugins/${plugin.id}`)"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center space-x-3">
              <div class="w-12 h-12 bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                <span class="text-white font-bold text-lg">{{ plugin.name.charAt(0) }}</span>
              </div>
              <div>
                <h3 class="font-semibold text-white group-hover:text-primary-400 transition-colors">
                  {{ plugin.name }}
                </h3>
                <p class="text-sm text-gray-400">{{ plugin.category }}</p>
              </div>
            </div>
          </div>

          <p class="text-gray-300 text-sm mb-4 line-clamp-2">
            {{ plugin.description }}
          </p>

          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center space-x-1">
              <Star class="w-4 h-4 text-yellow-400 fill-current" />
              <span class="text-sm text-white">{{ plugin.rating.toFixed(1) }}</span>
              <span class="text-xs text-gray-400">({{ plugin.reviewCount }})</span>
            </div>
            
            <div class="text-sm font-medium text-white">
              {{ plugin.price > 0 ? `$${plugin.price}` : 'Free' }}
            </div>
          </div>

          <div class="flex items-center justify-between text-sm text-gray-400">
            <span>{{ plugin.downloadCount }} downloads</span>
            <span>{{ getCategoryLabel(plugin.category) }}</span>
          </div>
        </div>
      </div>

      <!-- List View -->
      <div v-else class="space-y-4">
        <div
          v-for="plugin in filteredPlugins"
          :key="plugin.id"
          class="card hover:shadow-2xl transition-all duration-200 group cursor-pointer"
          @click="$router.push(`/plugins/${plugin.id}`)"
        >
          <div class="flex items-center space-x-4">
            <div class="w-16 h-16 bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform flex-shrink-0">
              <span class="text-white font-bold text-xl">{{ plugin.name.charAt(0) }}</span>
            </div>
            
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between">
                <div>
                  <h3 class="font-semibold text-white group-hover:text-primary-400 transition-colors">
                    {{ plugin.name }}
                  </h3>
                  <p class="text-sm text-gray-400 mb-2">{{ plugin.category }}</p>
                  <p class="text-gray-300 text-sm line-clamp-2">{{ plugin.description }}</p>
                </div>
                
                <div class="text-right ml-4">
                  <div class="text-lg font-medium text-white mb-1">
                    {{ plugin.price > 0 ? `$${plugin.price}` : 'Free' }}
                  </div>
                  <div class="flex items-center space-x-1 text-sm">
                    <Star class="w-4 h-4 text-yellow-400 fill-current" />
                    <span class="text-white">{{ plugin.rating.toFixed(1) }}</span>
                    <span class="text-gray-400">({{ plugin.reviewCount }})</span>
                  </div>
                </div>
              </div>
              
              <div class="flex items-center justify-between mt-3 text-sm text-gray-400">
                <span>{{ plugin.downloadCount }} downloads</span>
                <span>{{ getCategoryLabel(plugin.category) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div
        v-if="totalPages > 1"
        class="flex items-center justify-between mt-8"
      >
        <div class="text-sm text-gray-400">
          Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to {{ Math.min(currentPage * itemsPerPage, filteredPlugins.length) }} of {{ filteredPlugins.length }} results
        </div>
        
        <div class="flex space-x-2">
          <button
            @click="currentPage--"
            :disabled="currentPage <= 1"
            class="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="currentPage = page"
            class="px-3 py-1 rounded"
            :class="page === currentPage 
              ? 'bg-primary-600 text-white' 
              : 'bg-gray-700 text-white hover:bg-gray-600'"
          >
            {{ page }}
          </button>
          
          <button
            @click="currentPage++"
            :disabled="currentPage >= totalPages"
            class="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import {
  Search,
  Grid,
  List,
  Puzzle,
  Star
} from 'lucide-vue-next'

const loading = ref(false)
const searchQuery = ref('')
const selectedCategory = ref('')
const sortBy = ref('createdAt')
const viewMode = ref<'grid' | 'list'>('grid')
const currentPage = ref(1)
const itemsPerPage = 12

const plugins = ref([
  {
    id: '1',
    name: 'AI Assistant Pro',
    category: 'PRODUCTIVITY',
    description: 'Advanced AI-powered assistant that helps you with daily tasks and boosts productivity with smart automation.',
    rating: 4.8,
    reviewCount: 234,
    downloadCount: 12543,
    price: 9.99,
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'Code Optimizer',
    category: 'DEVELOPMENT',
    description: 'Automatically optimize your code for better performance and readability with advanced algorithms.',
    rating: 4.6,
    reviewCount: 189,
    downloadCount: 8932,
    price: 14.99,
    createdAt: new Date('2024-01-10')
  },
  {
    id: '3',
    name: 'Design System Kit',
    category: 'DESIGN',
    description: 'Complete design system with reusable components and style guides for modern applications.',
    rating: 4.9,
    reviewCount: 412,
    downloadCount: 15678,
    price: 0,
    createdAt: new Date('2024-01-20')
  },
  {
    id: '4',
    name: 'Analytics Dashboard',
    category: 'ANALYTICS',
    description: 'Real-time analytics and insights for your applications and websites with beautiful visualizations.',
    rating: 4.7,
    reviewCount: 156,
    downloadCount: 9876,
    price: 19.99,
    createdAt: new Date('2024-01-08')
  },
  {
    id: '5',
    name: 'Social Media Manager',
    category: 'MARKETING',
    description: 'Manage all your social media accounts from one unified dashboard with scheduling and analytics.',
    rating: 4.5,
    reviewCount: 98,
    downloadCount: 7234,
    price: 12.99,
    createdAt: new Date('2024-01-12')
  },
  {
    id: '6',
    name: 'Task Automation',
    category: 'PRODUCTIVITY',
    description: 'Automate repetitive tasks and workflows to save time and increase efficiency.',
    rating: 4.8,
    reviewCount: 267,
    downloadCount: 11234,
    price: 7.99,
    createdAt: new Date('2024-01-18')
  },
  {
    id: '7',
    name: 'Learning Platform',
    category: 'EDUCATION',
    description: 'Interactive learning platform with courses, tutorials, and skill tracking.',
    rating: 4.4,
    reviewCount: 143,
    downloadCount: 6543,
    price: 0,
    createdAt: new Date('2024-01-05')
  },
  {
    id: '8',
    name: 'Business CRM',
    category: 'BUSINESS',
    description: 'Complete customer relationship management system for small and medium businesses.',
    rating: 4.6,
    reviewCount: 178,
    downloadCount: 8765,
    price: 29.99,
    createdAt: new Date('2024-01-22')
  }
])

const filteredPlugins = computed(() => {
  let filtered = plugins.value

  // Filter by search query
  if (searchQuery.value) {
    filtered = filtered.filter(plugin =>
      plugin.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      plugin.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  // Filter by category
  if (selectedCategory.value) {
    filtered = filtered.filter(plugin => plugin.category === selectedCategory.value)
  }

  // Sort
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'downloadCount':
        return b.downloadCount - a.downloadCount
      case 'rating':
        return b.rating - a.rating
      case 'price':
        return a.price - b.price
      case '-price':
        return b.price - a.price
      case 'createdAt':
      default:
        return b.createdAt.getTime() - a.createdAt.getTime()
    }
  })

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredPlugins.value.length / itemsPerPage))

const visiblePages = computed(() => {
  const current = currentPage.value
  const total = totalPages.value
  const delta = 2
  
  const range = []
  const rangeWithDots = []
  
  for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
    range.push(i)
  }
  
  if (current - delta > 2) {
    rangeWithDots.push(1, '...')
  } else {
    rangeWithDots.push(1)
  }
  
  rangeWithDots.push(...range)
  
  if (current + delta < total - 1) {
    rangeWithDots.push('...', total)
  } else {
    rangeWithDots.push(total)
  }
  
  return rangeWithDots.filter(page => page !== '...' || rangeWithDots.length > 1)
})

const getCategoryLabel = (category: string) => {
  return category.charAt(0) + category.slice(1).toLowerCase()
}

// Reset pagination when filters change
watch([searchQuery, selectedCategory, sortBy], () => {
  currentPage.value = 1
})

onMounted(() => {
  // In a real app, fetch plugins from API
  loading.value = false
})
</script>