<template>
  <div class="plugin-renderer">
    <component
      v-if="pluginComponent"
      :is="pluginComponent"
      v-bind="props"
    />
    <div v-else class="text-gray-400 p-4">
      Plugin component not found
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePluginLoader } from '@/composables/usePluginLoader'

interface Props {
  pluginId: string
  componentName: string
  props?: Record<string, any>
}

const props = withDefaults(defineProps<Props>(), {
  props: () => ({})
})

const { getPluginComponents } = usePluginLoader()

const pluginComponent = computed(() => {
  const components = getPluginComponents.value
  const prefixedName = `Plugin${props.pluginId}${props.componentName}`
  return components[prefixedName] || null
})
</script>

