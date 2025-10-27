<template>
  <div class="space-y-6">
    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-400 text-sm">Installed Plugins</p>
            <p class="text-3xl font-bold text-white mt-2">{{ stats.installedPlugins }}</p>
          </div>
          <div class="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center">
            <Puzzle class="w-6 h-6 text-primary-400" />
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-400 text-sm">Active Plugins</p>
            <p class="text-3xl font-bold text-white mt-2">{{ stats.activePlugins }}</p>
          </div>
          <div class="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
            <CheckCircle class="w-6 h-6 text-green-400" />
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-400 text-sm">Available in Market</p>
            <p class="text-3xl font-bold text-white mt-2">{{ stats.availablePlugins }}</p>
          </div>
          <div class="w-12 h-12 bg-accent-500/20 rounded-lg flex items-center justify-center">
            <Store class="w-6 h-6 text-accent-400" />
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-400 text-sm">System Users</p>
            <p class="text-3xl font-bold text-white mt-2">{{ stats.totalUsers }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
            <Users class="w-6 h-6 text-blue-400" />
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="card">
      <h3 class="text-xl font-bold text-white mb-4">Quick Actions</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <router-link
          to="/market"
          class="flex items-center space-x-3 p-4 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <Store class="w-6 h-6 text-primary-400" />
          <div>
            <p class="text-white font-medium">Browse Market</p>
            <p class="text-gray-400 text-sm">Discover new plugins</p>
          </div>
        </router-link>

        <router-link
          to="/plugins"
          class="flex items-center space-x-3 p-4 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <Puzzle class="w-6 h-6 text-accent-400" />
          <div>
            <p class="text-white font-medium">Manage Plugins</p>
            <p class="text-gray-400 text-sm">Configure installed plugins</p>
          </div>
        </router-link>

        <router-link
          to="/settings"
          class="flex items-center space-x-3 p-4 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <Settings class="w-6 h-6 text-blue-400" />
          <div>
            <p class="text-white font-medium">Settings</p>
            <p class="text-gray-400 text-sm">System configuration</p>
          </div>
        </router-link>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="card">
      <h3 class="text-xl font-bold text-white mb-4">Recent Activity</h3>
      <div class="space-y-3">
        <div v-for="activity in recentActivity" :key="activity.id" class="flex items-center space-x-3 p-3 bg-gray-700/30 rounded-lg">
          <div class="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
            <component :is="activity.icon" class="w-5 h-5 text-gray-400" />
          </div>
          <div class="flex-1">
            <p class="text-white text-sm">{{ activity.message }}</p>
            <p class="text-gray-400 text-xs">{{ activity.time }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Puzzle, CheckCircle, Store, Users, Settings, Download, Upload, Power } from 'lucide-vue-next'
import { usePluginsStore } from '@/stores/plugins'
import { useMarketStore } from '@/stores/market'

const pluginsStore = usePluginsStore()
const marketStore = useMarketStore()

const stats = ref({
  installedPlugins: 0,
  activePlugins: 0,
  availablePlugins: 0,
  totalUsers: 0
})

const recentActivity = ref([
  { id: 1, icon: Download, message: 'Installed "Advanced Analytics" plugin', time: '2 hours ago' },
  { id: 2, icon: Power, message: 'Activated "Email Marketing Suite"', time: '5 hours ago' },
  { id: 3, icon: Upload, message: 'Updated "Task Manager Pro" to v2.0', time: '1 day ago' },
])

onMounted(async () => {
  await pluginsStore.fetchInstalledPlugins()
  await marketStore.fetchAvailablePlugins()
  
  stats.value.installedPlugins = pluginsStore.installedPlugins.length
  stats.value.activePlugins = pluginsStore.installedPlugins.filter(p => p.isActive).length
  stats.value.availablePlugins = marketStore.availablePlugins.length
  stats.value.totalUsers = 12 // Mock data
})
</script>

