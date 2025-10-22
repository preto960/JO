<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center">
      <!-- Backdrop -->
      <div 
        class="fixed inset-0 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
        @click="handleBackdropClick"
      />
      
      <!-- Dialog -->
      <div 
        :class="dialogClasses"
        role="dialog"
        aria-modal="true"
        @click.stop
      >
        <div class="flex flex-col h-full">
          <!-- Header -->
          <div v-if="$slots.header || $slots.title || $slots.description" class="flex flex-col space-y-1.5 text-center sm:text-left p-6 border-b border-gray-200 dark:border-gray-700">
            <slot name="header">
              <slot name="title">
                <h2 v-if="$slots.title" class="text-lg font-semibold leading-none tracking-tight">
                  <slot name="title" />
                </h2>
              </slot>
              <slot name="description">
                <p v-if="$slots.description" class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  <slot name="description" />
                </p>
              </slot>
            </slot>
          </div>
          
          <!-- Content -->
          <div class="flex-1 p-6 overflow-y-auto">
            <slot />
          </div>
          
          <!-- Footer -->
          <div v-if="$slots.footer" class="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 p-6 border-t border-gray-200 dark:border-gray-700">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'

interface Props {
  open?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closeOnBackdrop?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
  size: 'md',
  closeOnBackdrop: true
})

const emit = defineEmits<{
  'update:open': [value: boolean]
  close: []
}>()

const dialogClasses = computed(() => {
  const base = 'fixed bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-lg rounded-lg'
  
  const sizes = {
    sm: 'w-full max-w-md',
    md: 'w-full max-w-lg',
    lg: 'w-full max-w-2xl',
    xl: 'w-full max-w-4xl',
    full: 'w-full max-w-[95vw] h-[95vh]'
  }
  
  return [
    base,
    sizes[props.size],
    'relative z-50 grid w-full gap-4 border border-gray-200 dark:border-gray-700 p-0 shadow-lg'
  ].join(' ')
})

const handleBackdropClick = () => {
  if (props.closeOnBackdrop) {
    emit('update:open', false)
    emit('close')
  }
}

// Handle escape key
watch(() => props.open, (newValue) => {
  if (newValue) {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        emit('update:open', false)
        emit('close')
      }
    }
    document.addEventListener('keydown', handleEscape)
    
    // Cleanup when dialog closes
    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }
})
</script>