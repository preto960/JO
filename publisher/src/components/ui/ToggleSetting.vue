<template>
  <div class="flex items-center justify-between">
    <div>
      <h3 class="font-medium text-gray-900 dark:text-white">{{ title }}</h3>
      <p class="text-sm text-gray-500 dark:text-gray-400">{{ description }}</p>
    </div>
    <label class="relative inline-flex items-center cursor-pointer">
      <input
        v-model="modelValue"
        type="checkbox"
        class="sr-only peer"
      />
      <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
    </label>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  description: string
  modelValue: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()
</script>