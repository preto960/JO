<template>
  <div :class="cardClasses">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'default' | 'outline' | 'ghost'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  shadow?: 'none' | 'sm' | 'md' | 'lg'
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  padding: 'md',
  shadow: 'sm',
  rounded: 'md'
})

const cardClasses = computed(() => {
  const base = 'bg-white dark:bg-gray-800'
  
  const variants = {
    default: 'border border-gray-200 dark:border-gray-700',
    outline: 'border-2 border-gray-300 dark:border-gray-600',
    ghost: 'border-0'
  }
  
  const shadows = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg'
  }
  
  const rounded = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full'
  }
  
  const padding = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  }
  
  return [
    base,
    variants[props.variant],
    shadows[props.shadow],
    rounded[props.rounded],
    padding[props.padding]
  ].filter(Boolean).join(' ')
})
</script>