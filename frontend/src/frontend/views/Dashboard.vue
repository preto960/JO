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
                class="border-primary-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
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
                class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
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
        <!-- Welcome section -->
        <div class="mb-8">
          <h1 class="text-2xl font-bold text-gray-900">
            Welcome back, {{ user?.name }}!
          </h1>
          <p class="mt-1 text-sm text-gray-600">
            Here's what's happening with your plugins today.
          </p>
        </div>

        <!-- Stats grid -->
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div class="card">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
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
                <div class="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Avg. Downloads/Plugin</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ averageDownloads }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <!-- Charts section -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <!-- Downloads Chart -->
          <div class="card">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Downloads Over Time</h3>
            <div class="h-64">
              <canvas ref="downloadsChart"></canvas>
            </div>
          </div>

          <!-- Top Plugins -->
          <div class="card">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Top Plugins</h3>
            <div class="space-y-3">
              <div v-for="plugin in analytics.topPlugins" :key="plugin.id" class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ plugin.name }}</p>
                  <p class="text-sm text-gray-500">{{ plugin.downloads }} downloads</p>
                </div>
                <div class="text-right">
                  <p class="text-sm font-medium text-gray-900">${{ plugin.revenue.toFixed(2) }}</p>
                </div>
              </div>
              <div v-if="analytics.topPlugins.length === 0" class="text-center py-8 text-gray-500">
                No plugins yet. Create your first plugin to see analytics.
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="card">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <router-link
              to="/plugins"
              class="btn btn-primary text-center"
            >
              Create New Plugin
            </router-link>
            <router-link
              to="/analytics"
              class="btn btn-secondary text-center"
            >
              View Analytics
            </router-link>
            <button
              @click="refreshData"
              :disabled="loading"
              class="btn btn-secondary text-center"
            >
              Refresh Data
            </button>
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
  name: 'Dashboard',
  data() {
    return {
      user: null,
      analytics: {
        totalDownloads: 0,
        totalRevenue: 0,
        activePlugins: 0,
        downloadsByMonth: [],
        topPlugins: []
      },
      loading: false,
      downloadsChart: null
    }
  },
  computed: {
    averageDownloads() {
      if (this.analytics.activePlugins === 0) return 0
      return Math.round(this.analytics.totalDownloads / this.analytics.activePlugins)
    }
  },
  async mounted() {
    this.user = JSON.parse(localStorage.getItem('publisher_user') || '{}')
    await this.loadAnalytics()
    this.initDownloadsChart()
  },
  methods: {
    async loadAnalytics() {
      try {
        const response = await analyticsAPI.getDashboard()
        if (response.success) {
          this.analytics = response.analytics
        }
      } catch (error) {
        console.error('Failed to load analytics:', error)
      }
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
    
    async refreshData() {
      this.loading = true
      await this.loadAnalytics()
      
      // Update chart
      if (this.downloadsChart) {
        this.downloadsChart.data.labels = this.analytics.downloadsByMonth.map(d => d.month)
        this.downloadsChart.data.datasets[0].data = this.analytics.downloadsByMonth.map(d => d.downloads)
        this.downloadsChart.update()
      }
      
      this.loading = false
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
  }
}
</script>