<template>
  <div class="space-y-6">
    <!-- Page Title -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-xl font-bold text-gray-900 dark:text-white">Installed Plugins</h1>
        <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage your installed plugins</p>
      </div>
      <router-link to="/market" class="btn-primary flex items-center text-sm">
        <Store class="w-4 h-4 mr-2" />
        Browse Market
      </router-link>
    </div>

    <!-- Loading -->
    <div v-if="pluginsStore.loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
    </div>

    <!-- Plugins List -->
    <div v-else-if="pluginsStore.installedPlugins.length > 0" class="space-y-4">
      <div
        v-for="plugin in pluginsStore.installedPlugins"
        :key="plugin.id"
        class="card"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center">
              <Puzzle class="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </div>
            
            <div>
              <h3 class="text-base font-semibold text-gray-900 dark:text-white">{{ plugin.name }}</h3>
              <p class="text-gray-500 dark:text-gray-400 text-xs">Version {{ plugin.version }}</p>
              <p class="text-gray-600 dark:text-gray-500 text-xs">Installed {{ formatDate(plugin.installedAt) }}</p>
            </div>
          </div>

          <div class="flex items-center space-x-3">
            <!-- Status Badge -->
            <span
              class="px-3 py-1 rounded-full text-sm font-medium"
              :class="plugin.isActive ? 'bg-green-500/20 text-green-400' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'"
            >
              {{ plugin.isActive ? 'Active' : 'Inactive' }}
            </span>

            <!-- Toggle Button -->
            <button
              @click="togglePlugin(plugin.id)"
              class="p-2 rounded-lg transition-colors"
              :class="plugin.isActive ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30' : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'"
            >
              <Power class="w-5 h-5" />
            </button>

            <!-- Settings Button -->
            <button class="p-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors">
              <Settings class="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>

            <!-- Delete Button -->
            <button
              @click="confirmUninstall(plugin)"
              class="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
            >
              <Trash2 class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="card text-center py-12">
      <Puzzle class="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
      <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">No plugins installed</h3>
      <p class="text-gray-500 dark:text-gray-400 mb-6">Browse the market to discover and install plugins</p>
      <router-link to="/market" class="btn-primary inline-flex items-center">
        <Store class="w-5 h-5 mr-2" />
        Browse Market
      </router-link>
    </div>

    <!-- Uninstall Confirmation Modal -->
    <div
      v-if="showUninstallModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      @click.self="showUninstallModal = false"
    >
      <div class="bg-gray-800 rounded-xl p-6 max-w-md w-full">
        <h3 class="text-xl font-bold text-white mb-4">Uninstall Plugin?</h3>
        <p class="text-gray-400 mb-6">
          Are you sure you want to uninstall <strong class="text-white">{{ pluginToUninstall?.name }}</strong>?
          This action cannot be undone.
        </p>
        <div class="flex space-x-3">
          <button
            @click="showUninstallModal = false"
            class="flex-1 btn-secondary"
          >
            Cancel
          </button>
          <button
            @click="handleUninstall"
            class="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Uninstall
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Puzzle, Store, Power, Settings, Trash2 } from 'lucide-vue-next'
import { usePluginsStore } from '@/stores/plugins'
import { useToast } from 'vue-toastification'

const pluginsStore = usePluginsStore()
const toast = useToast()

const showUninstallModal = ref(false)
const pluginToUninstall = ref<any>(null)

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}

const togglePlugin = async (id: string) => {
  const plugin = pluginsStore.installedPlugins.find(p => p.id === id)
  if (!plugin) return
  
  const result = await pluginsStore.togglePlugin(id, !plugin.isActive)
  if (result.success) {
    toast.success('Plugin status updated')
    await pluginsStore.fetchInstalledPlugins()
  } else {
    toast.error(result.message || 'Failed to update plugin')
  }
}

const confirmUninstall = (plugin: any) => {
  pluginToUninstall.value = plugin
  showUninstallModal.value = true
}

const handleUninstall = async () => {
  if (!pluginToUninstall.value) return

  const result = await pluginsStore.uninstallPlugin(pluginToUninstall.value.id)
  showUninstallModal.value = false
  
  if (result.success) {
    toast.success('Plugin uninstalled successfully')
  } else {
    toast.error(result.message || 'Failed to uninstall plugin')
  }
  
  pluginToUninstall.value = null
}

onMounted(() => {
  pluginsStore.fetchInstalledPlugins()
})
</script>

