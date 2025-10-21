<template>
  <div class="mb-8">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
    <p class="text-gray-600 dark:text-gray-400 mt-2">Track your plugin performance and revenue</p>
  </div>

  <!-- Date Range Selector -->
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
    <div class="flex flex-wrap items-center gap-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date Range</label>
        <select
          v-model="dateRange"
          @change="fetchAnalytics"
          class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
          <option value="365">Last year</option>
        </select>
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Plugin</label>
        <select
          v-model="selectedPlugin"
          @change="fetchAnalytics"
          class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
        >
          <option value="">All Plugins</option>
          <option v-for="plugin in myPlugins" :key="plugin.id" :value="plugin.id">
            {{ plugin.title }}
          </option>
        </select>
      </div>
    </div>
  </div>

  <!-- Overview Stats -->
  <div class="grid md:grid-cols-4 gap-6 mb-8">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div class="flex items-center">
        <div class="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
          <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <div class="ml-4">
          <div class="text-2xl font-bold text-gray-900 dark:text-white">${{ analytics.totalRevenue }}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">Total Revenue</div>
        </div>
      </div>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div class="flex items-center">
        <div class="p-3 bg-green-100 dark:bg-green-900/20 rounded-xl">
          <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
          </svg>
        </div>
        <div class="ml-4">
          <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ analytics.totalSales }}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">Total Sales</div>
        </div>
      </div>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div class="flex items-center">
        <div class="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-xl">
          <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
          </svg>
        </div>
        <div class="ml-4">
          <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ analytics.totalDownloads }}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">Total Downloads</div>
        </div>
      </div>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div class="flex items-center">
        <div class="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-xl">
          <svg class="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
          </svg>
        </div>
        <div class="ml-4">
          <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ analytics.avgRating }}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">Average Rating</div>
        </div>
      </div>
    </div>
  </div>

  <!-- Charts and Recent Plugins -->
  <div class="grid md:grid-cols-2 gap-8 mb-8">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">Revenue Over Time</h2>
      <div class="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
        <canvas ref="revenueChart"></canvas>
      </div>
    </div>
    
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">Downloads Over Time</h2>
      <div class="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
        <canvas ref="downloadsChart"></canvas>
      </div>
    </div>
  </div>

  <!-- Recent Plugins and Plugin Performance -->
  <div class="grid md:grid-cols-2 gap-8">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Recent Plugins</h2>
      </div>
      <div class="p-6">
        <div v-if="recentPlugins.length === 0" class="text-gray-500 dark:text-gray-400 text-center py-8">
          No plugins yet. Create your first plugin!
        </div>
        <div v-else class="space-y-4">
          <div 
            v-for="plugin in recentPlugins.slice(0, 5)" 
            :key="plugin.id"
            class="flex items-center justify-between"
          >
            <div>
              <h3 class="font-medium text-gray-900 dark:text-white">{{ plugin.title }}</h3>
              <p class="text-sm text-gray-600 dark:text-gray-300">{{ plugin.category }}</p>
            </div>
            <div class="text-right">
              <span class="inline-block px-2 py-1 text-xs rounded-full"
                    :class="getStatusClass(plugin.status)">
                {{ plugin.status }}
              </span>
            </div>
          </div>
        </div>
        <div class="mt-4">
          <router-link 
            to="/plugins" 
            class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
          >
            View all plugins →
          </router-link>
        </div>
      </div>
    </div>

    <!-- Plugin Performance Table -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Plugin Performance</h2>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Plugin
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Downloads
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Revenue
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Rating
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="plugin in pluginStats" :key="plugin.pluginId" class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900 dark:text-white">{{ plugin.pluginTitle }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                  Active
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ plugin.downloads }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                ${{ plugin.revenue }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                <div class="flex items-center">
                  <svg class="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  {{ plugin.rating.toFixed(1) }}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { usePluginStore } from '@/stores/plugins'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import type { Analytics } from '@/types'

const pluginStore = usePluginStore()
const authStore = useAuthStore()
const toastStore = useToastStore()

const user = computed(() => authStore.user)

const dateRange = ref('30')
const selectedPlugin = ref('')
const revenueChart = ref<HTMLCanvasElement>()
const downloadsChart = ref<HTMLCanvasElement>()

const analytics = ref<Analytics>({
  totalRevenue: '0',
  totalSales: 0,
  totalPlugins: 0,
  avgRating: '0',
  totalDownloads: 0,
  dailyStats: [],
  pluginStats: []
})

const plugins = computed(() => pluginStore.plugins)
const myPlugins = computed(() => {
  return plugins.value.filter(plugin => plugin.author.id === authStore.user?.id)
})

const recentPlugins = computed(() => {
  return plugins.value
    .filter(plugin => plugin.author.id === authStore.user?.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
})

const pluginStats = computed(() => {
  return analytics.value.pluginStats.map(stat => ({
    ...stat,
    downloads: stat.downloads || 0,
    revenue: stat.revenue.toFixed(2),
    rating: stat.rating || 0
  }))
})

const getStatusClass = (status: string) => {
  switch (status) {
    case 'APPROVED':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
    case 'REJECTED':
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
  }
}

const fetchAnalytics = async () => {
  // TODO: Implement actual analytics API call
  // For now, using mock data
  
  const mockAnalytics: Analytics = {
    totalRevenue: '2,847.50',
    totalSales: 156,
    totalPlugins: myPlugins.value.length,
    avgRating: '4.6',
    totalDownloads: 289,
    dailyStats: Array.from({ length: parseInt(dateRange.value) }, (_, i) => ({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      downloads: Math.floor(Math.random() * 20) + 5,
      revenue: Math.floor(Math.random() * 200) + 50,
      views: Math.floor(Math.random() * 100) + 20
    })).reverse(),
    pluginStats: myPlugins.value.map(plugin => ({
      pluginId: plugin.id,
      pluginTitle: plugin.title,
      downloads: plugin._count.purchases,
      revenue: plugin.price * plugin._count.purchases,
      rating: plugin.avgRating
    }))
  }
  
  analytics.value = mockAnalytics
  
  await nextTick()
  renderCharts()
}

const renderCharts = () => {
  // TODO: Implement actual chart rendering with Chart.js
  console.log('Rendering charts...')
}

onMounted(async () => {
  try {
    await pluginStore.fetchPlugins()
    plugins.value = pluginStore.plugins
    await fetchAnalytics()
    // Only show success toast on first load, not on navigation back
    if (!sessionStorage.getItem('dashboardVisited')) {
      toastStore.success('Dashboard loaded successfully')
      sessionStorage.setItem('dashboardVisited', 'true')
    }
  } catch (error) {
    toastStore.error('Failed to load dashboard data')
  }
})
</script>