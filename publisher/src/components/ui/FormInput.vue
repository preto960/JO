<template>
  <div>
    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ label }}</label>
    <div class="relative">
      <input
        :value="modelValue"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        :type="type"
        :required="required"
        :placeholder="placeholder"
        class="w-full px-4 py-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
      />
      <div class="absolute left-3 top-3.5">
        <slot name="icon">
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path>
          </svg>
        </slot>
      </div>
    </div>
    <p v-if="helpText" class="mt-2 text-sm text-gray-500 dark:text-gray-400">{{ helpText }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  label: string
  type?: 'text' | 'email' | 'url' | 'number' | 'password'
  modelValue: string | number
  placeholder?: string
  required?: boolean
  helpText?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  required: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()
</script>