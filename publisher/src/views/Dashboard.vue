<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-white">Dashboard</h1>
        <p class="text-gray-400 mt-1">Welcome back, {{ authStore.user?.firstName }}!</p>
      </div>
      <router-link
        to="/plugins/create"
        class="btn-primary flex items-center space-x-2"
      >
        <PlusCircle class="w-5 h-5" />
        <span>Create New Plugin</span>
      </router-link>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        v-for="stat in stats"
        :key="stat.name"
        class="card"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-400">{{ stat.name }}</p>
            <p class="text-2xl font-bold text-white mt-1">{{ stat.value }}</p>
            <div class="flex items-center mt-2">
              <component
                :is="stat.trend === 'up' ? TrendingUp : TrendingDown"
                class="w-4 h-4 mr-1"
                :class="stat.trend === 'up' ? 'text-green-400' : 'text-red-400'"
              />
              <span
                class="text-sm"
                :class="stat.trend === 'up' ? 'text-green-400' : 'text-red-400'"
              >
                {{ stat.change }}
              </span>
            </div>
          </div>
          <div
            class="w-12 h-12 rounded-lg flex items-center justify-center"
            :class="stat.bgColor"
          >
            <component :is="stat.icon" class="w-6 h-6" :class="stat.iconColor" />
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Downloads Chart -->
      <div class="card">
        <h3 class="text-lg font-semibold text-white mb-4">Download Trends</h3>
        <div class="h-64 flex items-center justify-center text-gray-400">
          <div class="text-center">
            <BarChart3 class="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Chart visualization coming soon</p>
          </div>
        </div>
      </div>

      <!-- Revenue Chart -->
      <div class="card">
        <h3 class="text-lg font-semibold text-white mb-4">Revenue Overview</h3>
        <div class="h-64 flex items-center justify-center text-gray-400">
          <div class="text-center">
            <TrendingUp class="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Revenue analytics coming soon</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Plugins -->
    <div class="card">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold text-white">Recent Plugins</h3>
        <router-link
          to="/plugins"
          class="text-primary-400 hover:text-primary-300 text-sm font-medium"
        >
          View All
        </router-link>
      </div>
      
      <div v-if="recentPlugins.length === 0" class="text-center py-8">
        <Puzzle class="w-12 h-12 mx-auto mb-4 text-gray-500" />
        <p class="text-gray-400 mb-4">No plugins yet</p>
        <router-link
          to="/plugins/create"
          class="btn-primary inline-flex items-center space-x-2"
        >
          <PlusCircle class="w-4 h-4" />
          <span>Create Your First Plugin</span>
        </router-link>
      </div>
      
      <div v-else class="space-y-4">
        <div
          v-for="plugin in recentPlugins"
          :key="plugin.id"
          class="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold">{{ plugin.name.charAt(0) }}</span>
            </div>
            <div>
              <h4 class="font-medium text-white">{{ plugin.name }}</h4>
              <p class="text-sm text-gray-400">{{ plugin.category }}</p>
            </div>
          </div>
          
          <div class="flex items-center space-x-6">
            <div class="text-center">
              <p class="text-sm text-gray-400">Downloads</p>
              <p class="font-semibold text-white">{{ plugin.downloadCount }}</p>
            </div>
            <div class="text-center">
              <p class="text-sm text-gray-400">Rating</p>
              <!-- Fixed: Handle null rating -->
              <p class="font-semibold text-white">{{ typeof plugin.rating === 'number' ? plugin.rating.toFixed(1) : '0.0' }}</p>
            </div>
            <div class="text-center">
              <p class="text-sm text-gray-400">Status</p>
              <span
                class="inline-flex px-2 py-1 text-xs font-medium rounded-full"
                :class="getStatusClass(plugin.status)"
              >
                {{ plugin.status }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="card">
      <h3 class="text-lg font-semibold text-white mb-4">Quick Actions</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          @click="openAIAssistant"
          class="p-4 bg-gradient-to-r from-primary-600/20 to-accent-600/20 border border-primary-500/30 rounded-lg hover:from-primary-600/30 hover:to-accent-600/30 transition-all text-left"
        >
          <Sparkles class="w-6 h-6 text-primary-400 mb-2" />
          <h4 class="font-medium text-white">AI Assistant</h4>
          <p class="text-sm text-gray-400 mt-1">Get AI-powered insights</p>
        </button>
        
        <router-link
          to="/analytics"
          class="p-4 bg-gray-700/50 border border-gray-600 rounded-lg hover:bg-gray-700 transition-all text-left"
        >
          <BarChart3 class="w-6 h-6 text-gray-400 mb-2" />
          <h4 class="font-medium text-white">View Analytics</h4>
          <p class="text-sm text-gray-400 mt-1">Track your performance</p>
        </router-link>
        
        <router-link
          to="/plugins/create"
          class="p-4 bg-gray-700/50 border border-gray-600 rounded-lg hover:bg-gray-700 transition-all text-left"
        >
          <PlusCircle class="w-6 h-6 text-gray-400 mb-2" />
          <h4 class="font-medium text-white">Create Plugin</h4>
          <p class="text-sm text-gray-400 mt-1">Build something new</p>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { usePluginStore } from '@/stores/plugin'
import {
  PlusCircle,
  Puzzle,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Users,
  DollarSign,
  Star,
  Sparkles
} from 'lucide-vue-next'

const authStore = useAuthStore()
const pluginStore = usePluginStore()

const recentPlugins = ref<any[]>([])

const stats = ref([
  {
    name: 'Total Plugins',
    value: '0',
    change: '+0%',
    trend: 'up',
    icon: Puzzle,
    bgColor: 'bg-blue-500/10',
    iconColor: 'text-blue-400'
  },
  {
    name: 'Total Downloads',
    value: '0',
    change: '+0%',
    trend: 'up',
    icon: Users,
    bgColor: 'bg-green-500/10',
    iconColor: 'text-green-400'
  },
  {
    name: 'Revenue',
    value: '$0',
    change: '+0%',
    trend: 'up',
    icon: DollarSign,
    bgColor: 'bg-yellow-500/10',
    iconColor: 'text-yellow-400'
  },
  {
    name: 'Avg Rating',
    value: '0.0',
    change: '+0%',
    trend: 'up',
    icon: Star,
    bgColor: 'bg-purple-500/10',
    iconColor: 'text-purple-400'
  }
])

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

const openAIAssistant = () => {
  // Emit event to open AI assistant
  console.log('Opening AI Assistant...')
}

onMounted(async () => {
  await pluginStore.fetchMyPlugins({ limit: 5 })
  recentPlugins.value = pluginStore.plugins
  
  // Update stats with real data
  stats.value[0].value = pluginStore.plugins.length.toString()
  stats.value[1].value = pluginStore.plugins.reduce((sum, p) => sum + p.downloadCount, 0).toString()
  stats.value[3].value = pluginStore.plugins.length > 0 
    ? (pluginStore.plugins.reduce((sum, p) => sum + (p.rating || 0), 0) / pluginStore.plugins.length).toFixed(1)
    : '0.0'
})
</script>