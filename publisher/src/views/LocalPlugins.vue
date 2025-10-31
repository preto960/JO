<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-white">Local Plugins</h2>
        <p class="text-gray-400">Develop and publish plugins from your local directory</p>
        <p class="text-xs text-gray-500 mt-1">📁 {{ localPluginsStore.pluginsDirectory }}</p>
      </div>
      <button
        @click="refreshPlugins"
        :disabled="localPluginsStore.loading"
        class="btn-primary flex items-center"
      >
        <RefreshCw :class="{ 'animate-spin': localPluginsStore.loading }" class="w-5 h-5 mr-2" />
        Refresh
      </button>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-400 text-sm">Total Plugins</p>
            <p class="text-3xl font-bold text-white mt-1">{{ localPluginsStore.plugins.length }}</p>
          </div>
          <Package class="w-12 h-12 text-primary-500" />
        </div>
      </div>

      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-400 text-sm">Valid Plugins</p>
            <p class="text-3xl font-bold text-green-400 mt-1">{{ validPlugins.length }}</p>
          </div>
          <CheckCircle class="w-12 h-12 text-green-500" />
        </div>
      </div>

      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-400 text-sm">With Errors</p>
            <p class="text-3xl font-bold text-red-400 mt-1">{{ invalidPlugins.length }}</p>
          </div>
          <AlertCircle class="w-12 h-12 text-red-500" />
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="localPluginsStore.loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      <p class="text-gray-400 mt-4">Detecting plugins...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="localPluginsStore.plugins.length === 0" class="card text-center py-12">
      <FolderOpen class="w-16 h-16 text-gray-600 mx-auto mb-4" />
      <h3 class="text-xl font-bold text-white mb-2">No plugins found</h3>
      <p class="text-gray-400 mb-6">Create a plugin in the plugins directory to get started</p>
      <div class="bg-gray-700/50 rounded-lg p-4 max-w-2xl mx-auto text-left">
        <p class="text-sm text-gray-300 mb-2">Quick start:</p>
        <code class="text-xs text-green-400 block">
          cd {{ localPluginsStore.pluginsDirectory }}<br>
          mkdir my-awesome-plugin<br>
          cd my-awesome-plugin<br>
          # Create manifest.json and start coding!
        </code>
      </div>
    </div>

    <!-- Plugins List -->
    <div v-else class="space-y-4">
      <!-- Valid Plugins -->
      <div v-if="validPlugins.length > 0">
        <h3 class="text-lg font-semibold text-white mb-3">✅ Ready to Publish</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PluginCard
            v-for="plugin in validPlugins"
            :key="plugin.manifest.slug"
            :plugin="plugin"
            @view="viewPlugin"
            @build="buildPlugin"
            @publish="publishPlugin"
            @sandbox="testInSandbox"
          />
        </div>
      </div>

      <!-- Invalid Plugins -->
      <div v-if="invalidPlugins.length > 0" class="mt-8">
        <h3 class="text-lg font-semibold text-red-400 mb-3">⚠️ Needs Attention</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PluginCard
            v-for="plugin in invalidPlugins"
            :key="plugin.path"
            :plugin="plugin"
            @view="viewPlugin"
          />
        </div>
      </div>
    </div>

    <!-- Plugin Detail Modal -->
    <PluginDetailModal
      v-if="showDetailModal"
      :plugin="selectedPlugin"
      @close="showDetailModal = false"
      @build="buildPlugin"
      @publish="publishPlugin"
      @sandbox="testInSandbox"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RefreshCw, Package, CheckCircle, AlertCircle, FolderOpen } from 'lucide-vue-next'
import { useLocalPluginsStore } from '@/stores/localPlugins'
import { useToast } from 'vue-toastification'
import PluginCard from '@/components/PluginCard.vue'
import PluginDetailModal from '@/components/PluginDetailModal.vue'
import type { LocalPlugin } from '@/types/plugin'

const localPluginsStore = useLocalPluginsStore()
const toast = useToast()

const showDetailModal = ref(false)
const selectedPlugin = ref<LocalPlugin | null>(null)

const validPlugins = computed(() => localPluginsStore.getValidPlugins())
const invalidPlugins = computed(() => localPluginsStore.getInvalidPlugins())

const refreshPlugins = async () => {
  const result = await localPluginsStore.fetchLocalPlugins()
  if (result.success) {
    toast.success('Plugins refreshed')
  } else {
    toast.error(result.message || 'Failed to refresh plugins')
  }
}

const viewPlugin = (plugin: LocalPlugin) => {
  selectedPlugin.value = plugin
  showDetailModal.value = true
}

const buildPlugin = async (plugin: LocalPlugin) => {
  const result = await localPluginsStore.buildPlugin(plugin.manifest.slug)
  if (result.success) {
    toast.success(`Plugin ${plugin.manifest.name} built successfully`)
  } else {
    toast.error(result.message || 'Build failed')
  }
}

const publishPlugin = async (plugin: LocalPlugin) => {
  if (!confirm(`Publish ${plugin.manifest.name} v${plugin.manifest.version}?`)) {
    return
  }

  const result = await localPluginsStore.buildAndPublish(plugin.manifest.slug)
  if (result.success) {
    toast.success(`Plugin ${plugin.manifest.name} published successfully!`)
    showDetailModal.value = false
  } else {
    toast.error(result.message || 'Publish failed')
  }
}

const testInSandbox = async (plugin: LocalPlugin) => {
  const result = await localPluginsStore.buildForSandbox(plugin.manifest.slug)
  if (result.success) {
    toast.success('Plugin built for sandbox')
    if (result.sandboxUrl) {
      console.log('Sandbox URL:', result.sandboxUrl)
    }
  } else {
    toast.error(result.message || 'Sandbox build failed')
  }
}

onMounted(() => {
  refreshPlugins()
})
</script>



