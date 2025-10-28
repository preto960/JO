<template>
  <div class="dynamic-plugin-view">
    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      <span class="ml-4 text-gray-400">Loading plugin...</span>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="card bg-red-500/10 border border-red-500/20">
      <div class="flex items-start space-x-3">
        <AlertCircle class="w-6 h-6 text-red-400 mt-1" />
        <div>
          <h3 class="text-lg font-bold text-red-400 mb-2">Failed to Load Plugin Component</h3>
          <p class="text-gray-300 mb-4">{{ error }}</p>
          <button @click="retry" class="btn-secondary">
            <RefreshCw class="w-4 h-4 mr-2" />
            Retry
          </button>
        </div>
      </div>
    </div>

    <!-- Component Loaded -->
    <component
      v-else-if="componentInstance"
      :is="componentInstance"
      v-bind="componentProps"
    />

    <!-- Fallback -->
    <div v-else class="card">
      <div class="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
        <div class="flex items-start space-x-3">
          <AlertCircle class="w-5 h-5 text-yellow-400 mt-0.5" />
          <div>
            <h4 class="font-semibold text-yellow-400 mb-1">Component Not Available</h4>
            <p class="text-sm text-gray-300">
              This plugin component could not be loaded. The plugin may need to be recompiled or the component path may be incorrect.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, defineAsyncComponent, shallowRef } from 'vue'
import { AlertCircle, RefreshCw } from 'lucide-vue-next'

interface Props {
  pluginSlug: string
  componentName: string
  componentProps?: Record<string, any>
}

const props = withDefaults(defineProps<Props>(), {
  componentProps: () => ({})
})

const loading = ref(true)
const error = ref<string | null>(null)
const componentInstance = shallowRef<any>(null)

const loadComponent = async () => {
  loading.value = true
  error.value = null
  componentInstance.value = null

  try {
    console.log(`🔧 Loading component ${props.componentName} from plugin ${props.pluginSlug}`)

    // Construir la URL del componente
    const componentUrl = `/api/plugin-assets/${props.pluginSlug}/frontend/views/${props.componentName}.vue`

    // Intentar cargar el componente dinámicamente
    const component = defineAsyncComponent({
      loader: () => import(/* @vite-ignore */ componentUrl),
      loadingComponent: undefined,
      errorComponent: undefined,
      delay: 200,
      timeout: 10000
    })

    componentInstance.value = component
    console.log(`✅ Component ${props.componentName} loaded successfully`)
  } catch (err: any) {
    console.error(`Failed to load component ${props.componentName}:`, err)
    error.value = err.message || 'Unknown error occurred'
  } finally {
    loading.value = false
  }
}

const retry = () => {
  loadComponent()
}

onMounted(() => {
  loadComponent()
})

// Recargar si cambia el componente
watch(() => [props.pluginSlug, props.componentName], () => {
  loadComponent()
})
</script>

