<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
      <p class="text-gray-600 mt-2">Welcome back, {{ authStore.user?.name }}!</p>
    </div>

    <!-- Stats Cards -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      <p class="mt-2 text-gray-600">Loading dashboard...</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="card">
        <div class="flex items-center">
          <div class="flex-shrink-0 bg-primary-100 rounded-lg p-3">
            <div class="text-primary-600 text-2xl">📦</div>
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-medium text-gray-900">Total Plugins</h3>
            <p class="text-2xl font-bold text-primary-600">{{ stats.totalPlugins }}</p>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center">
          <div class="flex-shrink-0 bg-green-100 rounded-lg p-3">
            <div class="text-green-600 text-2xl">📥</div>
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-medium text-gray-900">Total Downloads</h3>
            <p class="text-2xl font-bold text-green-600">{{ stats.totalDownloads }}</p>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center">
          <div class="flex-shrink-0 bg-yellow-100 rounded-lg p-3">
            <div class="text-yellow-600 text-2xl">📈</div>
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-medium text-gray-900">Avg Downloads</h3>
            <p class="text-2xl font-bold text-yellow-600">{{ averageDownloads }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Downloads -->
    <div class="card">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">Recent Downloads</h2>
      
      <div v-if="stats.recentDownloads.length === 0" class="text-center py-8">
        <div class="text-gray-400 text-4xl mb-2">📊</div>
        <p class="text-gray-600">No downloads yet</p>
      </div>
      
      <div v-else class="space-y-3">
        <div 
          v-for="download in stats.recentDownloads" 
          :key="download.id"
          class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
        >
          <div>
            <h4 class="font-medium text-gray-900">{{ download.plugin.name }}</h4>
            <p class="text-sm text-gray-600">{{ formatDate(download.createdAt) }}</p>
          </div>
          <div class="text-green-600">
            ✓ Downloaded
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="card">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div class="space-y-3">
          <router-link to="/plugins" class="btn-primary block text-center">
            Manage Plugins
          </router-link>
          <router-link to="/analytics" class="btn-secondary block text-center">
            View Analytics
          </router-link>
        </div>
      </div>

      <div class="card">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Resources</h3>
        <div class="space-y-2 text-sm text-gray-600">
          <p>• Check your plugin performance</p>
          <p>• Update plugin information</p>
          <p>• Monitor download trends</p>
          <p>• Optimize your listings</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import api from '@/services/api'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

interface Stats {
  totalPlugins: number
  totalDownloads: number
  recentDownloads: Array<{
    id: string
    plugin: { name: string }
    createdAt: string
  }>
}

const stats = ref<Stats>({
  totalPlugins: 0,
  totalDownloads: 0,
  recentDownloads: []
})

const loading = ref(true)

const averageDownloads = computed(() => {
  if (stats.value.totalPlugins === 0) return 0
  return Math.round(stats.value.totalDownloads / stats.value.totalPlugins)
})

const fetchStats = async () => {
  try {
    const response = await api.get('/analytics')
    stats.value = response.data
  } catch (error) {
    console.error('Error fetching stats:', error)
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

onMounted(() => {
  fetchStats()
})
</script>