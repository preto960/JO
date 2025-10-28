<template>
  <div class="space-y-6">
    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
    </div>

    <!-- Plugin Not Found -->
    <div v-else-if="!plugin" class="card text-center py-12">
      <AlertCircle class="w-16 h-16 text-red-500 mx-auto mb-4" />
      <h3 class="text-xl font-bold text-white mb-2">Plugin Not Found</h3>
      <p class="text-gray-400 mb-6">The requested plugin could not be found or is not installed.</p>
      <router-link to="/plugins" class="btn-primary inline-flex items-center">
        <ArrowLeft class="w-5 h-5 mr-2" />
        Back to Plugins
      </router-link>
    </div>

    <!-- Plugin Inactive -->
    <div v-else-if="!plugin.isActive" class="card text-center py-12">
      <Power class="w-16 h-16 text-yellow-500 mx-auto mb-4" />
      <h3 class="text-xl font-bold text-white mb-2">Plugin Inactive</h3>
      <p class="text-gray-400 mb-6">This plugin is currently inactive. Activate it to use its features.</p>
      <button @click="activatePlugin" class="btn-primary inline-flex items-center">
        <Power class="w-5 h-5 mr-2" />
        Activate Plugin
      </button>
    </div>

    <!-- Plugin Active -->
    <div v-else>
      <!-- Mini Header with Feature Selector -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center space-x-4">
          <div class="w-12 h-12 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg flex items-center justify-center text-2xl">
            {{ plugin.manifest?.icon || '📦' }}
          </div>
          <div>
            <h2 class="text-xl font-bold text-white">{{ plugin.name }}</h2>
          </div>
        </div>
        
        <div class="flex items-center space-x-3">
          <!-- Feature Selector -->
          <div v-if="pluginRoutes.length > 1" class="flex items-center space-x-2 bg-gray-800 rounded-lg p-1">
            <button
              v-for="route in pluginRoutes"
              :key="route.path"
              @click="selectRoute(route)"
              class="px-4 py-2 rounded-md text-sm font-medium transition-colors"
              :class="selectedRoute?.path === route.path 
                ? 'bg-primary-600 text-white' 
                : 'text-gray-400 hover:text-white hover:bg-gray-700'"
            >
              {{ route.meta?.title || route.name }}
            </button>
          </div>
          
          <router-link to="/plugins" class="text-gray-400 hover:text-white">
            <Settings class="w-5 h-5" />
          </router-link>
        </div>
      </div>

      <!-- Dynamic Component View -->
      <div v-if="selectedRoute && selectedComponent">
        <DynamicPluginView
          :plugin-slug="plugin.slug"
          :component-name="selectedComponent"
        />
      </div>

      <!-- Loading State -->
      <div v-else class="card text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mb-4"></div>
        <p class="text-gray-400">Loading plugin...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { AlertCircle, Power, Settings, ArrowLeft, CheckSquare, X } from 'lucide-vue-next'
import { usePluginsStore } from '@/stores/plugins'
import { useToast } from 'vue-toastification'
import DynamicPluginView from '@/components/DynamicPluginView.vue'
import { usePluginLoader } from '@/composables/usePluginLoader'

const route = useRoute()
const router = useRouter()
const pluginsStore = usePluginsStore()
const pluginLoader = usePluginLoader()
const toast = useToast()

const loading = ref(true)
const selectedRoute = ref<any>(null)
const pluginSlug = computed(() => route.params.slug as string)

const plugin = computed(() => {
  return pluginsStore.installedPlugins.find(p => p.slug === pluginSlug.value)
})

const pluginRoutes = computed(() => {
  if (!plugin.value?.manifest?.frontend?.routes) return []
  return plugin.value.manifest.frontend.routes
})

const selectedComponent = computed(() => {
  if (!selectedRoute.value) return null
  
  // Extraer el nombre del componente desde la ruta del manifest
  // Ejemplo: "frontend/views/TaskList.vue" -> "TaskList"
  const componentPath = selectedRoute.value.component
  if (!componentPath) return null
  
  const match = componentPath.match(/\/([^/]+)\.vue$/)
  return match ? match[1] : null
})

const selectRoute = (route: any) => {
  selectedRoute.value = route
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getIcon = (iconName?: string) => {
  // Default icon if not specified
  return CheckSquare
}

const activatePlugin = async () => {
  if (!plugin.value) return
  
  const result = await pluginsStore.togglePlugin(plugin.value.id, true)
  if (result.success) {
    toast.success('Plugin activated successfully')
  } else {
    toast.error(result.message || 'Failed to activate plugin')
  }
}

onMounted(async () => {
  loading.value = true
  await pluginsStore.fetchInstalledPlugins()
  
  // Si el plugin no existe, redirigir
  if (!plugin.value) {
    loading.value = false
    setTimeout(() => {
      router.push('/plugins')
    }, 2000)
    return
  }

  // Asegurarse de que el plugin esté cargado
  if (plugin.value.isActive) {
    try {
      await pluginLoader.loadPlugin(plugin.value.id)
      console.log(`✅ Plugin ${plugin.value.slug} loaded`)
    } catch (error) {
      console.error(`Failed to load plugin ${plugin.value.slug}:`, error)
      toast.error('Failed to load plugin')
    }
  }
  
  loading.value = false

  // Auto-seleccionar la primera ruta
  if (pluginRoutes.value.length > 0 && !selectedRoute.value) {
    selectedRoute.value = pluginRoutes.value[0]
  }
})
</script>

