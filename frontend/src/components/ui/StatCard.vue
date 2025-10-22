<template>
  <div class="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200">
    <div class="flex items-center">
      <div class="flex-shrink-0">
        <div :class="iconContainerClass">
          <component :is="icon" :class="iconClass" />
        </div>
      </div>
      <div class="ml-4 w-0 flex-1">
        <dl>
          <dt class="text-sm font-medium text-gray-600 dark:text-gray-300">{{ title }}</dt>
          <dd class="text-2xl font-bold text-gray-900 dark:text-white">{{ value }}</dd>
        </dl>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  value: string | number
  icon: any
  iconContainerClass?: string
  iconClass?: string
}

withDefaults(defineProps<Props>(), {
  iconContainerClass: 'w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center',
  iconClass: 'w-6 h-6 text-white'
})
</script>