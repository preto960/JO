<template>
  <div v-if="loading" class="text-center py-12">
    <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
  </div>

  <div v-else-if="plugin" class="space-y-6">
    <!-- Back Button -->
    <button @click="$router.back()" class="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
      <ArrowLeft class="w-5 h-5" />
      <span>Back to Market</span>
    </button>

    <!-- Plugin Header -->
    <div class="card">
      <div class="flex flex-col md:flex-row gap-6">
        <div class="w-24 h-24 bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center flex-shrink-0">
          <Puzzle class="w-12 h-12 text-white" />
        </div>
        
        <div class="flex-1">
          <div class="flex items-start justify-between mb-4">
            <div>
              <h1 class="text-3xl font-bold text-white mb-2">{{ plugin.name }}</h1>
              <p class="text-gray-400">by {{ plugin.developer.firstName }} {{ plugin.developer.lastName }}</p>
            </div>
            <div class="text-right">
              <p class="text-3xl font-bold text-white">{{ plugin.price ? `$${plugin.price}` : 'Free' }}</p>
              <p class="text-gray-400 text-sm">v{{ plugin.version }}</p>
            </div>
          </div>

          <div class="flex items-center space-x-6 mb-4">
            <div class="flex items-center space-x-2">
              <Star class="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <span class="text-white font-semibold">{{ plugin.rating }}</span>
            </div>
            <div class="flex items-center space-x-2 text-gray-400">
              <Download class="w-5 h-5" />
              <span>{{ formatNumber(plugin.downloadCount) }} downloads</span>
            </div>
            <span class="px-3 py-1 bg-primary-500/20 text-primary-400 text-sm rounded-full">
              {{ plugin.category }}
            </span>
          </div>

          <!-- Botón de Actualización si ya está instalado -->
          <button
            v-if="isInstalled && hasUpdate"
            @click="handleUpdate"
            :disabled="updating"
            class="btn-primary bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
          >
            <Download class="w-5 h-5 mr-2" />
            {{ updating ? 'Updating...' : `Update to v${plugin.version}` }}
          </button>

          <!-- Botón de Instalado (sin acción) -->
          <button
            v-else-if="isInstalled && !hasUpdate"
            disabled
            class="btn-secondary opacity-75 cursor-not-allowed"
          >
            <Download class="w-5 h-5 mr-2" />
            Installed (v{{ installedPlugin?.version }})
          </button>

          <!-- Botón de Instalación normal -->
          <button
            v-else
            @click="handleInstall"
            :disabled="installing"
            class="btn-primary"
          >
            <Download class="w-5 h-5 mr-2" />
            {{ installing ? 'Installing...' : 'Install Plugin' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Description -->
    <div class="card">
      <h2 class="text-2xl font-bold text-white mb-4">Description</h2>
      <p class="text-gray-300 leading-relaxed">{{ plugin.longDescription || plugin.description }}</p>
    </div>

    <!-- Tags -->
    <div v-if="plugin.tags && plugin.tags.length > 0" class="card">
      <h2 class="text-2xl font-bold text-white mb-4">Tags</h2>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="tag in plugin.tags"
          :key="tag"
          class="px-3 py-1 bg-gray-700 text-gray-300 text-sm rounded-full"
        >
          {{ tag }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Puzzle, Star, Download } from 'lucide-vue-next'
import { useMarketStore } from '@/stores/market'
import { usePluginsStore } from '@/stores/plugins'
import { useToast } from 'vue-toastification'

const route = useRoute()
const router = useRouter()
const marketStore = useMarketStore()
const pluginsStore = usePluginsStore()
const toast = useToast()

const plugin = ref<any>(null)
const loading = ref(true)
const installing = ref(false)
const updating = ref(false)

// Computed para verificar si el plugin ya está instalado
const installedPlugin = computed(() => {
  if (!plugin.value) return null
  return pluginsStore.installedPlugins.find(
    p => p.publisherPluginId === plugin.value.id
  )
})

const isInstalled = computed(() => !!installedPlugin.value)

const hasUpdate = computed(() => {
  if (!installedPlugin.value || !plugin.value) return false
  return installedPlugin.value.version !== plugin.value.version
})

const formatNumber = (num: number) => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

const handleInstall = async () => {
  // Mostrar modal de instalación
  pluginsStore.showOperationModal('install', plugin.value.name)
  
  installing.value = true
  const result = await pluginsStore.installPlugin(plugin.value.id)
  installing.value = false

  if (!result.success) {
    pluginsStore.completeOperation(false)
    toast.error(result.message || 'Failed to install plugin')
  }
  // El éxito se maneja en el WebSocket listener
}

const handleUpdate = async () => {
  if (!installedPlugin.value) return
  
  // Mostrar modal de actualización
  pluginsStore.showOperationModal('update', plugin.value.name)
  
  updating.value = true
  const result = await pluginsStore.updatePlugin(installedPlugin.value.id)
  updating.value = false

  if (!result.success) {
    pluginsStore.completeOperation(false)
    toast.error(result.message || 'Failed to update plugin')
  }
  // El éxito se maneja en el WebSocket listener
}

onMounted(async () => {
  const id = route.params.id as string
  // Cargar plugins instalados y detalles del plugin en paralelo
  await Promise.all([
    pluginsStore.fetchInstalledPlugins(),
    marketStore.fetchPluginDetail(id).then(data => plugin.value = data)
  ])
  loading.value = false
})
</script>

