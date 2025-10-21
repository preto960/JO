<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-semibold text-gray-900">Publisher Dashboard</h1>
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
            class="inline-flex items-center px-1 pt-1 border-b-2 border-blue-500 text-sm font-medium text-gray-900"
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
            class="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
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
      <h1 class="text-3xl font-bold text-gray-900">Publisher Dashboard</h1>
      <p class="text-gray-600 mt-2">Manage your plugins and track your performance</p>
    </div>

    <!-- Stats Overview -->
    <div class="grid md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center">
          <div class="p-3 bg-blue-100 rounded-full">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
          </div>
          <div class="ml-4">
            <div class="text-2xl font-bold text-gray-900">{{ stats.totalPlugins }}</div>
            <div class="text-sm text-gray-600">Total Plugins</div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center">
          <div class="p-3 bg-green-100 rounded-full">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <div class="text-2xl font-bold text-gray-900">${{ stats.totalRevenue }}</div>
            <div class="text-sm text-gray-600">Total Revenue</div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center">
          <div class="p-3 bg-purple-100 rounded-full">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <div class="text-2xl font-bold text-gray-900">{{ stats.totalSales }}</div>
            <div class="text-sm text-gray-600">Total Sales</div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center">
          <div class="p-3 bg-yellow-100 rounded-full">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <div class="text-2xl font-bold text-gray-900">{{ stats.avgRating }}</div>
            <div class="text-sm text-gray-600">Avg Rating</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="grid md:grid-cols-2 gap-8">
      <div class="bg-white rounded-lg shadow-sm">
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-lg font-semibold">Recent Plugins</h2>
        </div>
        <div class="p-6">
          <div v-if="recentPlugins.length === 0" class="text-gray-500 text-center py-8">
            No plugins yet. Create your first plugin!
          </div>
          <div v-else class="space-y-4">
            <div 
              v-for="plugin in recentPlugins.slice(0, 5)" 
              :key="plugin.id"
              class="flex items-center justify-between"
            >
              <div>
                <h3 class="font-medium">{{ plugin.title }}</h3>
                <p class="text-sm text-gray-600">{{ plugin.category }}</p>
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
              class="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View all plugins →
            </router-link>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm">
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-lg font-semibold">Quick Actions</h2>
        </div>
        <div class="p-6">
          <div class="space-y-4">
            <router-link 
              to="/plugins?action=create"
              class="block w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              <div class="flex items-center">
                <div class="p-2 bg-blue-100 rounded-full mr-3">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                  </svg>
                </div>
                <div>
                  <h3 class="font-medium">Create New Plugin</h3>
                  <p class="text-sm text-gray-600">Add a new plugin to the marketplace</p>
                </div>
              </div>
            </router-link>

            <router-link 
              to="/analytics"
              class="block w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              <div class="flex items-center">
                <div class="p-2 bg-green-100 rounded-full mr-3">
                  <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                </div>
                <div>
                  <h3 class="font-medium">View Analytics</h3>
                  <p class="text-sm text-gray-600">Track downloads and revenue</p>
                </div>
              </div>
            </router-link>

            <router-link 
              to="/settings"
              class="block w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              <div class="flex items-center">
                <div class="p-2 bg-purple-100 rounded-full mr-3">
                  <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                </div>
                <div>
                  <h3 class="font-medium">Settings</h3>
                  <p class="text-sm text-gray-600">Manage your account settings</p>
                </div>
              </div>
            </router-link>
          </div>
        </div>
      </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePluginStore } from '@/stores/plugins'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import type { Plugin } from '@/types'

const router = useRouter()
const pluginStore = usePluginStore()
const authStore = useAuthStore()
const toastStore = useToastStore()

const user = computed(() => authStore.user)

const logout = async () => {
  try {
    await authStore.logout()
    toastStore.success('Logged out successfully')
    router.push('/login')
  } catch (error) {
    toastStore.error('Failed to logout')
  }
}

const plugins = ref<Plugin[]>([])

const recentPlugins = computed(() => {
  return plugins.value
    .filter(plugin => plugin.author.id === authStore.user?.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
})

const stats = computed(() => {
  const userPlugins = recentPlugins.value
  const totalRevenue = userPlugins.reduce((sum, plugin) => {
    return sum + (plugin.price * plugin._count.purchases)
  }, 0)
  const totalSales = userPlugins.reduce((sum, plugin) => sum + plugin._count.purchases, 0)
  const avgRating = userPlugins.length > 0 
    ? userPlugins.reduce((sum, plugin) => sum + plugin.avgRating, 0) / userPlugins.length 
    : 0

  return {
    totalPlugins: userPlugins.length,
    totalRevenue: totalRevenue.toFixed(2),
    totalSales,
    avgRating: avgRating.toFixed(1)
  }
})

const getStatusClass = (status: string) => {
  switch (status) {
    case 'APPROVED':
      return 'bg-green-100 text-green-800'
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800'
    case 'REJECTED':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

onMounted(async () => {
  try {
    await pluginStore.fetchPlugins()
    plugins.value = pluginStore.plugins
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