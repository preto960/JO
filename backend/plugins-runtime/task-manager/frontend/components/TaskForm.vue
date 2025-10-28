<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click.self="$emit('close')">
    <div class="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-700">
        <h3 class="text-xl font-bold text-white">
          {{ isEdit ? 'Edit Task' : 'New Task' }}
        </h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-white">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        <!-- Title -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">
            Title <span class="text-red-400">*</span>
          </label>
          <input
            v-model="form.title"
            type="text"
            required
            class="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Enter task title..."
          />
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">
            Description
          </label>
          <textarea
            v-model="form.description"
            rows="3"
            class="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            placeholder="Add a description..."
          />
        </div>

        <!-- Category & Priority -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Category
            </label>
            <select
              v-model="form.categoryId"
              class="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">No category</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Priority
            </label>
            <select
              v-model="form.priority"
              class="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>
        </div>

        <!-- Status & Due Date -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Status
            </label>
            <select
              v-model="form.status"
              class="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="IN_REVIEW">In Review</option>
              <option value="DONE">Done</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Due Date
            </label>
            <input
              v-model="form.dueDate"
              type="date"
              class="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        <!-- Estimated Hours -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">
            Estimated Hours
          </label>
          <input
            v-model.number="form.estimatedHours"
            type="number"
            min="0"
            step="0.5"
            class="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <!-- Actions -->
        <div class="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            @click="$emit('close')"
            class="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? 'Saving...' : (isEdit ? 'Update Task' : 'Create Task') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Task, TaskCategory } from '../store/tasks'

interface Props {
  task?: Task
  categories: TaskCategory[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  submit: [data: Partial<Task>]
}>()

const loading = ref(false)
const isEdit = computed(() => !!props.task)

const form = ref({
  title: '',
  description: '',
  status: 'TODO' as Task['status'],
  priority: 'MEDIUM' as Task['priority'],
  categoryId: '',
  dueDate: '',
  estimatedHours: 0
})

onMounted(() => {
  if (props.task) {
    form.value = {
      title: props.task.title,
      description: props.task.description || '',
      status: props.task.status,
      priority: props.task.priority,
      categoryId: props.task.categoryId || '',
      dueDate: props.task.dueDate ? props.task.dueDate.split('T')[0] : '',
      estimatedHours: props.task.estimatedHours
    }
  }
})

const handleSubmit = () => {
  loading.value = true
  
  const data: Partial<Task> = {
    title: form.value.title,
    description: form.value.description || undefined,
    status: form.value.status,
    priority: form.value.priority,
    categoryId: form.value.categoryId || undefined,
    dueDate: form.value.dueDate || undefined,
    estimatedHours: form.value.estimatedHours
  }

  emit('submit', data)
}
</script>
