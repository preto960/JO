<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">My Plugins</h1>
      <p class="text-gray-600 mt-2">Manage your installed plugins</p>
    </div>

    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      <p class="mt-2 text-gray-600">Loading your plugins...</p>
    </div>

    <div v-else-if="installedPlugins.length > 0" class="space-y-6">
      <div 
        v-for="item in installedPlugins" 
        :key="item.id"
        class="card"
      >
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-gray-900">{{ item.plugin.name }}</h3>
            <p class="text-gray-600 mb-2">{{ item.plugin.description }}</p>
            <div class="flex items-center space-x-4 text-sm text-gray-500">
              <span>by {{ item.plugin.publisher.name }}</span>
              <span>Version {{ item.plugin.version }}</span>
              <span>Installed {{ formatDate(item.installedAt) }}</span>
            </div>
          </div>
          
          <div class="flex items-center space-x-4">
            <span class="text-lg font-bold text-primary-600">
              ${{ item.plugin.price }}
            </span>
            <button
              @click="uninstallPlugin(item.plugin.id)"
              class="btn-secondary text-sm"
            >
              Uninstall
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-12">
      <div class="text-gray-400 text-6xl mb-4">📦</div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">No plugins installed</h3>
      <p class="text-gray-600 mb-6">Start exploring and installing plugins to enhance your workflow</p>
      <router-link to="/" class="btn-primary">
        Browse Plugins
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/services/api'

interface InstalledPlugin {
  id: string
  plugin: {
    id: string
    name: string
    description: string
    version: string
    price: number
    publisher: { name: string }
  }
  installedAt: string
}

const installedPlugins = ref<InstalledPlugin[]>([])
const loading = ref(true)

const fetchInstalledPlugins = async () => {
  try {
    const response = await api.get('/users/plugins')
    installedPlugins.value = response.data
  } catch (error) {
    console.error('Error fetching installed plugins:', error)
  } finally {
    loading.value = false
  }
}

const uninstallPlugin = async (pluginId: string) => {
  if (!confirm('Are you sure you want to uninstall this plugin?')) {
    return
  }
  
  try {
    await api.delete(`/users/uninstall/${pluginId}`)
    await fetchInstalledPlugins() // Refresh the list
  } catch (error: any) {
    alert(error.response?.data?.error || 'Failed to uninstall plugin')
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

onMounted(() => {
  fetchInstalledPlugins()
})
</script>