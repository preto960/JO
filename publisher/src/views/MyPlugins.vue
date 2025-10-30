<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-white">My Plugins</h1>
        <p class="text-gray-400 mt-1">Manage your plugin portfolio</p>
      </div>
      <div class="flex space-x-3">
        <button
          @click="refreshPlugins"
          class="btn-secondary flex items-center space-x-2"
        >
          <RefreshCw class="w-4 h-4" />
          <span>Refresh</span>
        </button>
        <router-link
          to="/plugins/create"
          class="btn-primary flex items-center space-x-2"
        >
          <PlusCircle class="w-5 h-5" />
          <span>Create New Plugin</span>
        </router-link>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap gap-4 items-center bg-gray-800 p-4 rounded-lg">
      <div class="flex items-center space-x-2">
        <Filter class="w-4 h-4 text-gray-400" />
        <span class="text-sm text-gray-400">Filter:</span>
      </div>
      
      <select
        v-model="filters.status"
        @change="applyFilters"
        class="input-field text-sm py-2"
      >
        <option value="">All Status</option>
        <option value="DRAFT">Draft</option>
        <option value="PENDING">Pending</option>
        <option value="APPROVED">Approved</option>
        <option value="REJECTED">Rejected</option>
      </select>
      
      <select
        v-model="filters.category"
        @change="applyFilters"
        class="input-field text-sm py-2"
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
      
      <div class="flex-1">
        <div class="relative">
          <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            v-model="filters.search"
            @input="debounceSearch"
            type="text"
            placeholder="Search plugins..."
            class="input-field pl-10 text-sm py-2"
          />
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-if="error" class="card border-red-500/50 bg-red-500/10">
      <div class="flex items-center space-x-3">
        <AlertCircle class="w-5 h-5 text-red-400" />
        <div>
          <h3 class="font-medium text-red-400">Failed to fetch plugins</h3>
          <p class="text-sm text-red-300 mt-1">{{ error }}</p>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
    </div>

    <!-- Plugins Grid -->
    <div v-else-if="filteredPlugins.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="plugin in filteredPlugins"
        :key="plugin.id"
        class="card hover:shadow-2xl transition-all duration-200 group"
      >
        <!-- Plugin Header -->
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
          
          <div class="flex items-center space-x-2">
            <span
              class="inline-flex px-2 py-1 text-xs font-medium rounded-full"
              :class="getStatusClass(plugin.status)"
            >
              {{ plugin.status }}
            </span>
          </div>
        </div>

        <!-- Plugin Description -->
        <p class="text-gray-300 text-sm mb-4 line-clamp-2">
          {{ plugin.description }}
        </p>

        <!-- Plugin Stats -->
        <div class="grid grid-cols-3 gap-2 mb-4">
          <div class="text-center p-2 bg-gray-700/50 rounded">
            <p class="text-xs text-gray-400">Downloads</p>
            <p class="font-semibold text-white">{{ plugin.downloadCount }}</p>
          </div>
          <div class="text-center p-2 bg-gray-700/50 rounded">
            <p class="text-xs text-gray-400">Rating</p>
            <p class="font-semibold text-white">{{ typeof plugin.rating === 'number' ? plugin.rating.toFixed(1) : '0.0' }}</p>
          </div>
          <div class="text-center p-2 bg-gray-700/50 rounded">
            <p class="text-xs text-gray-400">Reviews</p>
            <p class="font-semibold text-white">{{ plugin.reviewCount }}</p>
          </div>
        </div>

        <!-- Plugin Tags -->
        <div v-if="plugin.tags && plugin.tags.length > 0" class="flex flex-wrap gap-1 mb-4">
          <span
            v-for="tag in plugin.tags.slice(0, 3)"
            :key="tag"
            class="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded"
          >
            {{ tag }}
          </span>
          <span
            v-if="plugin.tags.length > 3"
            class="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded"
          >
            +{{ plugin.tags.length - 3 }}
          </span>
        </div>

        <!-- Actions -->
        <div class="flex space-x-2">
          <router-link
            :to="`/plugins/${plugin.id}/edit`"
            class="flex-1 flex items-center justify-center px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
          >
            <Edit class="w-4 h-4 mr-1" />
            Edit
          </router-link>
          
          <button
            v-if="plugin.status === 'DRAFT'"
            @click="submitForReview(plugin.id)"
            class="flex-1 flex items-center justify-center px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
          >
            <Send class="w-4 h-4 mr-1" />
            Submit
          </button>
          
          <button
            @click="deletePlugin(plugin.id)"
            class="px-3 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors"
          >
            <Trash2 class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <Puzzle class="w-16 h-16 mx-auto mb-4 text-gray-500" />
      <h3 class="text-lg font-medium text-white mb-2">No plugins found</h3>
      <p class="text-gray-400 mb-6">
        {{ filters.search || filters.status || filters.category 
          ? 'Try adjusting your filters' 
          : 'Get started by creating your first plugin' }}
      </p>
      <router-link
        v-if="!filters.search && !filters.status && !filters.category"
        to="/plugins/create"
        class="btn-primary inline-flex items-center space-x-2"
      >
        <PlusCircle class="w-5 h-5" />
        <span>Create Your First Plugin</span>
      </router-link>
    </div>

    <!-- Pagination -->
    <div
      v-if="pagination.totalPages > 1"
      class="flex items-center justify-between"
    >
      <div class="text-sm text-gray-400">
        Showing {{ (pagination.page - 1) * pagination.limit + 1 }} to {{ Math.min(pagination.page * pagination.limit, pagination.total) }} of {{ pagination.total }} results
      </div>
      
      <div class="flex space-x-2">
        <button
          @click="changePage(pagination.page - 1)"
          :disabled="pagination.page <= 1"
          class="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        
        <button
          v-for="page in visiblePages"
          :key="page"
          @click="changePage(page)"
          class="px-3 py-1 rounded"
          :class="page === pagination.page 
            ? 'bg-primary-600 text-white' 
            : 'bg-gray-700 text-white hover:bg-gray-600'"
        >
          {{ page }}
        </button>
        
        <button
          @click="changePage(pagination.page + 1)"
          :disabled="pagination.page >= pagination.totalPages"
          class="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { usePluginStore } from '@/stores/plugin'
import { useToast } from 'vue-toastification'
import {
  PlusCircle,
  RefreshCw,
  Filter,
  Search,
  Edit,
  Trash2,
  Send,
  Puzzle,
  AlertCircle
} from 'lucide-vue-next'

const pluginStore = usePluginStore()
const toast = useToast()

const loading = ref(false)
const error = ref('')
const searchTimeout = ref<NodeJS.Timeout>()

const filters = ref({
  search: '',
  status: '',
  category: ''
})

const filteredPlugins = computed(() => {
  let plugins = pluginStore.plugins
  
  if (filters.value.search) {
    plugins = plugins.filter(plugin => 
      plugin.name.toLowerCase().includes(filters.value.search.toLowerCase()) ||
      plugin.description.toLowerCase().includes(filters.value.search.toLowerCase())
    )
  }
  
  if (filters.value.status) {
    plugins = plugins.filter(plugin => plugin.status === filters.value.status)
  }
  
  if (filters.value.category) {
    plugins = plugins.filter(plugin => plugin.category === filters.value.category)
  }
  
  return plugins
})

const pagination = computed(() => pluginStore.pagination)

const visiblePages = computed(() => {
  const current = pagination.value.page
  const total = pagination.value.totalPages
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

const getStatusClass = (status: string) => {
  switch (status) {
    case 'APPROVED':
      return 'bg-green-500/20 text-green-400'
    case 'PENDING':
      return 'bg-yellow-500/20 text-yellow-400'
    case 'DRAFT':
      return 'bg-gray-500/20 text-gray-400'
    case 'REJECTED':
      return 'bg-red-500/20 text-red-400'
    default:
      return 'bg-gray-500/20 text-gray-400'
  }
}

const refreshPlugins = async () => {
  loading.value = true
  error.value = ''
  
  try {
    await pluginStore.fetchMyPlugins({
      page: pagination.value.page,
      limit: pagination.value.limit,
      ...filters.value
    })
  } catch (err) {
    error.value = 'Failed to fetch plugins'
  } finally {
    loading.value = false
  }
}

const applyFilters = () => {
  refreshPlugins()
}

const debounceSearch = () => {
  clearTimeout(searchTimeout.value)
  searchTimeout.value = setTimeout(() => {
    refreshPlugins()
  }, 500)
}

const changePage = (page: number) => {
  if (page >= 1 && page <= pagination.value.totalPages) {
    refreshPlugins()
  }
}

const submitForReview = async (pluginId: string) => {
  const result = await pluginStore.submitForReview(pluginId)
  if (result.success) {
    toast.success('Plugin submitted for review!')
  } else {
    toast.error(result.message || 'Failed to submit plugin')
  }
}

const deletePlugin = async (pluginId: string) => {
  if (confirm('Are you sure you want to delete this plugin? This action cannot be undone.')) {
    const result = await pluginStore.deletePlugin(pluginId)
    if (result.success) {
      toast.success('Plugin deleted successfully!')
    } else {
      toast.error(result.message || 'Failed to delete plugin')
    }
  }
}

onMounted(() => {
  refreshPlugins()
})

watch(() => pluginStore.plugins, () => {
  error.value = ''
})
</script>