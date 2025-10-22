<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
    <div class="p-6 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center space-x-3">
        <div :class="iconContainerClass">
          <component :is="icon" :class="iconClass" />
        </div>
        <div>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">{{ title }}</h2>
          <p class="text-sm text-gray-600 dark:text-gray-400">{{ description }}</p>
        </div>
      </div>
    </div>
    <div class="p-6">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  description: string
  icon: any
  iconContainerClass?: string
  iconClass?: string
}

withDefaults(defineProps<Props>(), {
  iconContainerClass: 'w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center',
  iconClass: 'w-6 h-6 text-blue-600 dark:text-blue-400'
})
</script>