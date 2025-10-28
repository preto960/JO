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
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <div class="w-16 h-16 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl flex items-center justify-center text-3xl">
            {{ plugin.manifest?.icon || '📦' }}
          </div>
          <div>
            <h2 class="text-2xl font-bold text-white">{{ plugin.name }}</h2>
            <p class="text-gray-400">Version {{ plugin.version }}</p>
          </div>
        </div>
        <div class="flex items-center space-x-3">
          <span class="px-3 py-1 rounded-full text-sm font-medium bg-green-500/20 text-green-400">
            Active
          </span>
          <router-link to="/plugins" class="btn-secondary">
            <Settings class="w-5 h-5 mr-2" />
            Manage
          </router-link>
        </div>
      </div>

      <!-- Description -->
      <div v-if="plugin.description" class="card">
        <p class="text-gray-300">{{ plugin.description }}</p>
      </div>

      <!-- Routes/Features -->
      <div v-if="pluginRoutes.length > 0" class="card">
        <h3 class="text-lg font-bold text-white mb-4">Available Features</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            v-for="route in pluginRoutes"
            :key="route.path"
            @click="selectRoute(route)"
            class="p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-left"
            :class="{ 'ring-2 ring-primary-500': selectedRoute?.path === route.path }"
          >
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
                <component :is="getIcon(route.meta?.icon)" class="w-5 h-5 text-primary-400" />
              </div>
              <div>
                <h4 class="font-semibold text-white">{{ route.meta?.title || route.name }}</h4>
                <p class="text-sm text-gray-400">{{ route.meta?.description || 'View details' }}</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      <!-- Dynamic Component View -->
      <div v-if="selectedRoute && selectedComponent" class="card">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold text-white">{{ selectedRoute.meta?.title || selectedRoute.name }}</h3>
          <button @click="selectedRoute = null" class="text-gray-400 hover:text-white">
            <X class="w-5 h-5" />
          </button>
        </div>
        <DynamicPluginView
          :plugin-slug="plugin.slug"
          :component-name="selectedComponent"
        />
      </div>

      <!-- Plugin Content Placeholder -->
      <div class="card">
        <div class="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-6">
          <div class="flex items-start space-x-3">
            <AlertCircle class="w-5 h-5 text-yellow-400 mt-0.5" />
            <div>
              <h4 class="font-semibold text-yellow-400 mb-1">Plugin UI Loading</h4>
              <p class="text-sm text-gray-300">
                The plugin is installed and active. The dynamic UI loading system is currently being implemented.
                This is a placeholder view showing the plugin's configuration.
              </p>
            </div>
          </div>
        </div>

        <!-- Plugin Info -->
        <div class="space-y-4">
          <div>
            <h4 class="text-sm font-semibold text-gray-400 mb-2">Plugin Information</h4>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-xs text-gray-500">Slug</p>
                <p class="text-white font-mono">{{ plugin.slug }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500">Status</p>
                <p class="text-white">{{ plugin.status }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500">Installed</p>
                <p class="text-white">{{ formatDate(plugin.installedAt) }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500">Last Updated</p>
                <p class="text-white">{{ formatDate(plugin.updatedAt) }}</p>
              </div>
            </div>
          </div>

          <!-- Manifest Info -->
          <div v-if="plugin.manifest">
            <h4 class="text-sm font-semibold text-gray-400 mb-2">Manifest</h4>
            <pre class="bg-gray-800 rounded-lg p-4 text-sm text-gray-300 overflow-x-auto">{{ JSON.stringify(plugin.manifest, null, 2) }}</pre>
          </div>
        </div>
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

const route = useRoute()
const router = useRouter()
const pluginsStore = usePluginsStore()
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
  loading.value = false
  
  // Si el plugin no existe, redirigir
  if (!plugin.value) {
    setTimeout(() => {
      router.push('/plugins')
    }, 2000)
  }
})
</script>

