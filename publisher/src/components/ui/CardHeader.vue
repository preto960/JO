<template>
  <div :class="headerClasses">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  padding: 'md'
})

const headerClasses = computed(() => {
  const padding = {
    none: '',
    sm: 'p-3',
    md: 'px-6 py-4',
    lg: 'px-8 py-6'
  }
  
  return [
    padding[props.padding],
    'border-b border-gray-200 dark:border-gray-700'
  ].filter(Boolean).join(' ')
})
</script>