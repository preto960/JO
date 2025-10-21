<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-semibold text-gray-900">Analytics</h1>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-600">Welcome, {{ user?.username }}</span>
            <button 
              @click="logout"
              class="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Navigation -->
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex space-x-8">
          <router-link 
            to="/" 
            class="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
          >
            Dashboard
          </router-link>
          <router-link 
            to="/plugins" 
            class="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
          >
            My Plugins
          </router-link>
          <router-link 
            to="/analytics" 
            class="inline-flex items-center px-1 pt-1 border-b-2 border-blue-500 text-sm font-medium text-gray-900"
          >
            Analytics
          </router-link>
          <router-link 
            to="/settings" 
            class="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
          >
            Settings
          </router-link>
        </div>
      </div>
    </nav>

      <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">Analytics</h1>
          <p class="text-gray-600 mt-2">Track your plugin performance and revenue</p>
        </div>

        <!-- Date Range Selector -->
        <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div class="flex flex-wrap items-center gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
              <select
                v-model="dateRange"
                @change="fetchAnalytics"
                class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="365">Last year</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Plugin</label>
              <select
                v-model="selectedPlugin"
                @change="fetchAnalytics"
                class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
          <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="text-2xl font-bold text-blue-600">{{ analytics.totalRevenue }}</div>
            <div class="text-sm text-gray-600">Total Revenue</div>
          </div>
          <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="text-2xl font-bold text-green-600">{{ analytics.totalSales }}</div>
            <div class="text-sm text-gray-600">Total Sales</div>
          </div>
          <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="text-2xl font-bold text-purple-600">{{ analytics.totalDownloads }}</div>
            <div class="text-sm text-gray-600">Total Downloads</div>
          </div>
          <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="text-2xl font-bold text-orange-600">{{ analytics.avgRating }}</div>
            <div class="text-sm text-gray-600">Average Rating</div>
          </div>
        </div>

        <!-- Charts -->
        <div class="grid md:grid-cols-2 gap-8 mb-8">
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-lg font-semibold mb-4">Revenue Over Time</h2>
            <div class="h-64 flex items-center justify-center text-gray-500">
              <canvas ref="revenueChart"></canvas>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-lg font-semibold mb-4">Downloads Over Time</h2>
            <div class="h-64 flex items-center justify-center text-gray-500">
              <canvas ref="downloadsChart"></canvas>
            </div>
          </div>
        </div>

        <!-- Plugin Performance Table -->
        <div class="bg-white rounded-lg shadow-sm">
          <div class="p-6 border-b border-gray-200">
            <h2 class="text-lg font-semibold">Plugin Performance</h2>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plugin
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Downloads
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="plugin in pluginStats" :key="plugin.pluginId">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">{{ plugin.pluginTitle }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ plugin.downloads }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${{ plugin.revenue }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ plugin.rating.toFixed(1) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { usePluginStore } from '@/stores/plugins'
import { useAuthStore } from '@/stores/auth'
import type { Analytics } from '@/types'

const router = useRouter()
const pluginStore = usePluginStore()
const authStore = useAuthStore()

const user = computed(() => authStore.user)

const logout = async () => {
  try {
    await authStore.logout()
    router.push('/login')
  } catch (error) {
    console.error('Failed to logout')
  }
}

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

const pluginStats = computed(() => {
  return analytics.value.pluginStats.map(stat => ({
    ...stat,
    downloads: stat.downloads || 0,
    revenue: stat.revenue.toFixed(2),
    rating: stat.rating || 0
  }))
})

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
  await pluginStore.fetchPlugins()
  await fetchAnalytics()
})
</script>