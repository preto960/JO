<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="buttonClass"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="flex items-center">
      <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      {{ loadingText }}
    </span>
    <span v-else>{{ text }}</span>
  </button>
</template>

<script setup lang="ts">
interface Props {
  text: string
  loading?: boolean
  loadingText?: string
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'danger'
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  loadingText: 'Loading...',
  disabled: false,
  type: 'button',
  variant: 'primary'
})

defineEmits<{
  click: [event: Event]
}>()

const buttonClass = computed(() => {
  const baseClass = 'px-6 py-3 font-medium rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed'
  
  switch (props.variant) {
    case 'primary':
      return `${baseClass} bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700`
    case 'secondary':
      return `${baseClass} bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600`
    case 'danger':
      return `${baseClass} bg-red-600 text-white hover:bg-red-700`
    default:
      return `${baseClass} bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700`
  }
})
</script>

<script setup lang="ts">
import { computed }
</script>