<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-75" @click="close"></div>

      <!-- Modal panel -->
      <div class="inline-block overflow-hidden text-left align-bottom transition-all transform bg-gray-800 rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div class="px-6 pt-5 pb-4 bg-gray-800 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto bg-primary-100 rounded-full sm:mx-0 sm:h-10 sm:w-10">
              <div v-if="status === 'loading'" class="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
              <svg v-else-if="status === 'success'" class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <svg v-else-if="status === 'error'" class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-1">
              <h3 class="text-lg font-medium leading-6 text-white">
                {{ title }}
              </h3>
              <div class="mt-2">
                <p class="text-sm text-gray-400">
                  {{ message }}
                </p>
                
                <!-- Progress steps -->
                <div v-if="steps.length > 0" class="mt-4 space-y-2">
                  <div v-for="(step, index) in steps" :key="index" class="flex items-center text-sm">
                    <div v-if="step.status === 'loading'" class="w-4 h-4 mr-2 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                    <svg v-else-if="step.status === 'completed'" class="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <div v-else class="w-4 h-4 mr-2 border-2 border-gray-600 rounded-full"></div>
                    <span :class="step.status === 'completed' ? 'text-gray-300' : 'text-gray-500'">
                      {{ step.label }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="px-4 py-3 bg-gray-700 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            v-if="status !== 'loading'"
            @click="close"
            type="button"
            class="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
          >
            {{ status === 'success' ? 'Done' : 'Close' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Step {
  label: string
  status: 'pending' | 'loading' | 'completed'
}

interface Props {
  isOpen: boolean
  status: 'loading' | 'success' | 'error'
  operation: 'install' | 'update' | 'uninstall'
  pluginName?: string
  steps?: Step[]
}

const props = withDefaults(defineProps<Props>(), {
  steps: () => []
})

const emit = defineEmits<{
  close: []
}>()

const title = computed(() => {
  if (props.status === 'loading') {
    switch (props.operation) {
      case 'install': return `Installing ${props.pluginName || 'Plugin'}...`
      case 'update': return `Updating ${props.pluginName || 'Plugin'}...`
      case 'uninstall': return `Uninstalling ${props.pluginName || 'Plugin'}...`
    }
  } else if (props.status === 'success') {
    switch (props.operation) {
      case 'install': return 'Installation Complete!'
      case 'update': return 'Update Complete!'
      case 'uninstall': return 'Uninstallation Complete!'
    }
  } else {
    return 'Operation Failed'
  }
})

const message = computed(() => {
  if (props.status === 'loading') {
    return 'Please wait while we process your request. This may take a few moments...'
  } else if (props.status === 'success') {
    return `${props.pluginName || 'The plugin'} has been ${props.operation === 'install' ? 'installed' : props.operation === 'update' ? 'updated' : 'uninstalled'} successfully.`
  } else {
    return 'An error occurred during the operation. Please try again.'
  }
})

const close = () => {
  if (props.status !== 'loading') {
    emit('close')
  }
}
</script>

