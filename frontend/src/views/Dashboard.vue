<template>
  <div class="space-y-6">
    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide">Installed Plugins</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white mt-1">{{ stats.installedPlugins }}</p>
          </div>
          <Puzzle class="w-5 h-5 text-gray-400" />
        </div>
      </div>

      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide">Active Plugins</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white mt-1">{{ stats.activePlugins }}</p>
          </div>
          <CheckCircle class="w-5 h-5 text-gray-400" />
        </div>
      </div>

      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide">Available in Market</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white mt-1">{{ stats.availablePlugins }}</p>
          </div>
          <Store class="w-5 h-5 text-gray-400" />
        </div>
      </div>

      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide">System Users</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white mt-1">{{ stats.totalUsers }}</p>
          </div>
          <Users class="w-5 h-5 text-gray-400" />
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="card">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
        <router-link
          to="/market"
          class="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 rounded-md transition-colors"
        >
          <Store class="w-5 h-5 text-gray-400" />
          <div>
            <p class="text-gray-900 dark:text-white font-medium text-sm">Browse Market</p>
            <p class="text-gray-500 dark:text-gray-400 text-xs">Discover new plugins</p>
          </div>
        </router-link>

        <router-link
          to="/plugins"
          class="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 rounded-md transition-colors"
        >
          <Puzzle class="w-5 h-5 text-gray-400" />
          <div>
            <p class="text-gray-900 dark:text-white font-medium text-sm">Manage Plugins</p>
            <p class="text-gray-500 dark:text-gray-400 text-xs">Configure installed plugins</p>
          </div>
        </router-link>

        <router-link
          to="/settings"
          class="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 rounded-md transition-colors"
        >
          <Settings class="w-5 h-5 text-gray-400" />
          <div>
            <p class="text-gray-900 dark:text-white font-medium text-sm">Settings</p>
            <p class="text-gray-500 dark:text-gray-400 text-xs">System configuration</p>
          </div>
        </router-link>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="card">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
      <div class="space-y-2">
        <div v-for="activity in recentActivity" :key="activity.id" class="flex items-center space-x-3 p-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
          <component :is="activity.icon" class="w-4 h-4 text-gray-400" />
          <div class="flex-1">
            <p class="text-gray-900 dark:text-white text-sm">{{ activity.message }}</p>
            <p class="text-gray-500 dark:text-gray-400 text-xs">{{ activity.time }}</p>
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

