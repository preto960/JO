<template>
  <transition
    enter-active-class="transform ease-out duration-300 transition"
    enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
    enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
    leave-active-class="transition ease-in duration-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="show"
      class="pointer-events-auto overflow-hidden scale-in rounded-lg border shadow-lg"
      :class="[
        type === 'success' ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' :
        type === 'error' ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800' :
        'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'
      ]"
      style="min-width: 320px; max-width: 448px;"
    >
      <div class="p-4">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <!-- Success Icon -->
            <div
              v-if="type === 'success'"
              class="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0"
            >
              <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <!-- Error Icon -->
            <div
              v-else-if="type === 'error'"
              class="w-8 h-8 rounded-full bg-gradient-to-r from-red-500 to-pink-600 flex items-center justify-center flex-shrink-0"
            >
              <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <!-- Info Icon -->
            <div
              v-else
              class="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-600 flex items-center justify-center flex-shrink-0"
            >
              <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <div class="ml-3 min-w-0 flex-1">
            <p
              v-if="title"
              :class="['text-sm font-bold break-words', textClass]"
              :style="textGlowClass"
            >
              {{ title }}
            </p>
            <p
              v-if="message"
              :class="['mt-1 text-sm break-words', textClass]"
              style="opacity: 0.9;"
            >
              {{ message }}
            </p>
          </div>
          <div class="ml-4 flex-shrink-0 flex">
            <button
              @click="close"
              class="p-1 transition-all duration-300 rounded hover:bg-black/10 dark:hover:bg-white/10"
              :class="textClass"
            >
              <span class="sr-only">Dismiss</span>
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useThemeStore } from '@/stores/theme'

interface Props {
  show: boolean
  type?: 'success' | 'error' | 'info'
  title?: string
  message?: string
  duration?: number
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  duration: 5000
})

const emit = defineEmits<{
  close: []
}>()

const themeStore = useThemeStore()

const textClass = computed(() => {
  if (props.type === 'success') {
    return themeStore.theme === 'dark' ? 'text-green-100' : 'text-green-800'
  } else if (props.type === 'error') {
    return themeStore.theme === 'dark' ? 'text-red-100' : 'text-red-800'
  } else {
    return themeStore.theme === 'dark' ? 'text-blue-100' : 'text-blue-800'
  }
})

const textGlowClass = computed(() => {
  return themeStore.theme === 'dark' 
    ? 'text-shadow: 0 0 20px rgba(255, 255, 255, 0.5)'
    : 'text-shadow: 0 0 20px rgba(0, 0, 0, 0.3)'
})

let timeoutId: number | null = null

const close = () => {
  emit('close')
}

onMounted(() => {
  if (props.duration > 0) {
    timeoutId = setTimeout(() => {
      close()
    }, props.duration)
  }
})

onUnmounted(() => {
  if (timeoutId) {
    clearTimeout(timeoutId)
  }
})
</script>