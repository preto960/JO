<template>
  <div :class="cardClasses">
    <div v-if="$slots.header" :class="headerClasses">
      <slot name="header" />
    </div>
    <div v-if="$slots.title" :class="titleClasses">
      <slot name="title" />
    </div>
    <div :class="contentClasses">
      <slot />
    </div>
    <div v-if="$slots.footer" :class="footerClasses">
      <slot name="footer" />
    </div>
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

const headerClasses = computed(() => {
  return 'px-6 pt-6 pb-4 border-b border-gray-200 dark:border-gray-700'
})

const titleClasses = computed(() => {
  return 'px-6 pt-4 pb-2'
})

const contentClasses = computed(() => {
  const padding = {
    none: '',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-6'
  }
  return padding[props.padding] || 'px-6 pb-6'
})

const footerClasses = computed(() => {
  return 'px-6 pb-6 pt-4 border-t border-gray-200 dark:border-gray-700'
})
</script>