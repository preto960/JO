<template>
  <div v-if="show" class="fixed top-4 right-4 z-50 max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden">
    <div class="p-4">
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <CheckCircleIcon v-if="type === 'success'" class="h-6 w-6 text-green-400" />
          <XCircleIcon v-else-if="type === 'error'" class="h-6 w-6 text-red-400" />
          <ExclamationCircleIcon v-else-if="type === 'warning'" class="h-6 w-6 text-yellow-400" />
          <InformationCircleIcon v-else class="h-6 w-6 text-blue-400" />
        </div>
        <div class="ml-3 w-0 flex-1 pt-0.5">
          <p v-if="title" class="text-sm font-medium text-gray-900">{{ title }}</p>
          <p class="text-sm text-gray-500">{{ message }}</p>
        </div>
        <div class="ml-4 flex-shrink-0 flex">
          <button @click="close" class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500">
            <XMarkIcon class="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CheckCircleIcon, XCircleIcon, ExclamationCircleIcon, InformationCircleIcon, XMarkIcon } from '@heroicons/vue/24/outline'

interface Props {
  show: boolean
  type: 'success' | 'error' | 'warning' | 'info'
  title?: string
  message: string
}

defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

const close = () => {
  emit('close')
}
</script>
