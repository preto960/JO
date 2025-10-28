<template>
  <tr class="border-b border-gray-700 hover:bg-gray-800/50 transition-colors">
    <!-- Checkbox -->
    <td class="px-4 py-3">
      <input
        type="checkbox"
        :checked="task.status === 'DONE'"
        @change="$emit('toggle', task.id)"
        class="w-4 h-4 rounded border-gray-600 text-primary-600 focus:ring-primary-500 focus:ring-offset-gray-900"
      />
    </td>

    <!-- Title & Description -->
    <td class="px-4 py-3">
      <div>
        <p 
          class="font-medium"
          :class="task.status === 'DONE' ? 'line-through text-gray-500' : 'text-white'"
        >
          {{ task.title }}
        </p>
        <p v-if="task.description" class="text-sm text-gray-400 mt-1 line-clamp-1">
          {{ task.description }}
        </p>
      </div>
    </td>

    <!-- Category -->
    <td class="px-4 py-3">
      <span 
        v-if="task.categoryName"
        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
        :style="{ 
          backgroundColor: task.categoryColor + '20',
          color: task.categoryColor 
        }"
      >
        {{ task.categoryName }}
      </span>
    </td>

    <!-- Priority -->
    <td class="px-4 py-3">
      <span 
        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
        :class="priorityClass"
      >
        {{ task.priority }}
      </span>
    </td>

    <!-- Status -->
    <td class="px-4 py-3">
      <span 
        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
        :class="statusClass"
      >
        {{ formatStatus(task.status) }}
      </span>
    </td>

    <!-- Due Date -->
    <td class="px-4 py-3 text-sm text-gray-400">
      {{ task.dueDate ? formatDate(task.dueDate) : '-' }}
    </td>

    <!-- Actions -->
    <td class="px-4 py-3">
      <div class="flex items-center space-x-2">
        <button
          @click="$emit('edit', task)"
          class="p-1.5 text-gray-400 hover:text-primary-400 hover:bg-gray-700 rounded transition-colors"
          title="Edit"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          @click="$emit('delete', task.id)"
          class="p-1.5 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded transition-colors"
          title="Delete"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </td>
  </tr>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Task } from '../store/tasks'

interface Props {
  task: Task
}

const props = defineProps<Props>()

defineEmits<{
  toggle: [id: string]
  edit: [task: Task]
  delete: [id: string]
}>()

const priorityClass = computed(() => {
  const classes = {
    LOW: 'bg-blue-500/20 text-blue-400',
    MEDIUM: 'bg-yellow-500/20 text-yellow-400',
    HIGH: 'bg-orange-500/20 text-orange-400',
    URGENT: 'bg-red-500/20 text-red-400'
  }
  return classes[props.task.priority] || classes.MEDIUM
})

const statusClass = computed(() => {
  const classes = {
    TODO: 'bg-gray-500/20 text-gray-400',
    IN_PROGRESS: 'bg-blue-500/20 text-blue-400',
    IN_REVIEW: 'bg-purple-500/20 text-purple-400',
    DONE: 'bg-green-500/20 text-green-400',
    CANCELLED: 'bg-red-500/20 text-red-400'
  }
  return classes[props.task.status] || classes.TODO
})

const formatStatus = (status: string) => {
  return status.replace('_', ' ')
}

const formatDate = (date: string) => {
  const d = new Date(date)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  if (d.toDateString() === today.toDateString()) {
    return 'Today'
  } else if (d.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow'
  } else {
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }
}
</script>
