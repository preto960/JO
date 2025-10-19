<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <h1 class="text-xl font-semibold text-gray-900">Publisher Dashboard</h1>
            </div>
            <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
              <router-link
                to="/dashboard"
                class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Dashboard
              </router-link>
              <router-link
                to="/plugins"
                class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Plugins
              </router-link>
              <router-link
                to="/analytics"
                class="border-primary-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Analytics
              </router-link>
            </div>
          </div>
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <button
                @click="logout"
                class="btn btn-secondary text-sm"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main content -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <!-- Header -->
        <div class="mb-6">
          <h1 class="text-2xl font-bold text-gray-900">Analytics</h1>
          <p class="mt-1 text-sm text-gray-600">
            Track your plugin performance and revenue
          </p>
        </div>

        <!-- Loading state -->
        <div v-if="loading" class="text-center py-12">
          <svg class="animate-spin h-8 w-8 text-primary-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="mt-2 text-gray-600">Loading analytics...</p>
        </div>

        <!-- Analytics Content -->
        <div v-else>
          <!-- Key Metrics -->
          <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <div class="card">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                    </svg>
                  </div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Total Downloads</dt>
                    <dd class="text-lg font-medium text-gray-900">{{ analytics.totalDownloads.toLocaleString() }}</dd>
                  </dl>
                </div>
              </div>
            </div>

            <div class="card">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                    <dd class="text-lg font-medium text-gray-900">${{ analytics.totalRevenue.toFixed(2) }}</dd>
                  </dl>
                </div>
              </div>
            </div>

            <div class="card">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Active Plugins</dt>
                    <dd class="text-lg font-medium text-gray-900">{{ analytics.activePlugins }}</dd>
                  </dl>
                </div>
              </div>
            </div>

            <div class="card">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Avg. Revenue/Plugin</dt>
                    <dd class="text-lg font-medium text-gray-900">${{ averageRevenuePerPlugin.toFixed(2) }}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <!-- Charts -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <!-- Downloads Chart -->
            <div class="card">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Downloads Trend</h3>
              <div class="h-64">
                <canvas ref="downloadsChart"></canvas>
              </div>
            </div>

            <!-- Revenue Chart -->
            <div class="card">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Revenue by Plugin</h3>
              <div class="h-64">
                <canvas ref="revenueChart"></canvas>
              </div>
            </div>
          </div>

          <!-- Top Plugins Table -->
          <div class="card">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Plugin Performance</h3>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Plugin Name
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Downloads
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Revenue
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Conversion Rate
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="plugin in analytics.topPlugins" :key="plugin.id">
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {{ plugin.name }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ plugin.downloads.toLocaleString() }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${{ plugin.revenue.toFixed(2) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {{ getConversionRate(plugin) }}%
                      </span>
                    </td>
                  </tr>
                  <tr v-if="analytics.topPlugins.length === 0">
                    <td colspan="4" class="px-6 py-12 text-center text-gray-500">
                      No plugin data available. Create plugins to see analytics.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { analyticsAPI } from '@/services/api'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

export default {
  name: 'Analytics',
  data() {
    return {
      analytics: {
        totalDownloads: 0,
        totalRevenue: 0,
        activePlugins: 0,
        downloadsByMonth: [],
        topPlugins: []
      },
      loading: false,
      downloadsChart: null,
      revenueChart: null
    }
  },
  computed: {
    averageRevenuePerPlugin() {
      if (this.analytics.activePlugins === 0) return 0
      return this.analytics.totalRevenue / this.analytics.activePlugins
    }
  },
  async mounted() {
    await this.loadAnalytics()
    this.initCharts()
  },
  methods: {
    async loadAnalytics() {
      this.loading = true
      try {
        const response = await analyticsAPI.getDashboard()
        if (response.success) {
          this.analytics = response.analytics
        }
      } catch (error) {
        console.error('Failed to load analytics:', error)
      } finally {
        this.loading = false
      }
    },
    
    initCharts() {
      this.initDownloadsChart()
      this.initRevenueChart()
    },
    
    initDownloadsChart() {
      const ctx = this.$refs.downloadsChart
      if (!ctx) return

      this.downloadsChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: this.analytics.downloadsByMonth.map(d => d.month),
          datasets: [{
            label: 'Downloads',
            data: this.analytics.downloadsByMonth.map(d => d.downloads),
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      })
    },
    
    initRevenueChart() {
      const ctx = this.$refs.revenueChart
      if (!ctx) return

      this.revenueChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: this.analytics.topPlugins.map(p => p.name),
          datasets: [{
            data: this.analytics.topPlugins.map(p => p.revenue),
            backgroundColor: [
              'rgba(59, 130, 246, 0.8)',
              'rgba(16, 185, 129, 0.8)',
              'rgba(251, 146, 60, 0.8)',
              'rgba(147, 51, 234, 0.8)',
              'rgba(244, 63, 94, 0.8)'
            ],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom'
            }
          }
        }
      })
    },
    
    getConversionRate(plugin) {
      if (this.analytics.totalDownloads === 0) return 0
      return ((plugin.downloads / this.analytics.totalDownloads) * 100).toFixed(1)
    },
    
    logout() {
      localStorage.removeItem('publisher_token')
      localStorage.removeItem('publisher_user')
      this.$router.push('/login')
    }
  },
  
  beforeUnmount() {
    if (this.downloadsChart) {
      this.downloadsChart.destroy()
    }
    if (this.revenueChart) {
      this.revenueChart.destroy()
    }
  }
}
</script>