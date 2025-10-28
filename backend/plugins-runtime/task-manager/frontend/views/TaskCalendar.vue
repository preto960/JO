<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h3 class="text-2xl font-bold text-white">Task Calendar</h3>
      <button
        @click="showForm = true"
        class="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span>New Task</span>
      </button>
    </div>

    <!-- Calendar View Placeholder -->
    <div class="card">
      <div class="text-center py-12">
        <svg class="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <h4 class="text-lg font-semibold text-white mb-2">Calendar View</h4>
        <p class="text-gray-400 mb-6">Full calendar view coming soon</p>
      </div>

      <!-- Upcoming Tasks -->
      <div class="border-t border-gray-700 pt-6">
        <h4 class="font-semibold text-white mb-4">Upcoming Tasks</h4>
        <div class="space-y-3">
          <div
            v-for="task in upcomingTasks"
            :key="task.id"
            class="flex items-center justify-between p-3 bg-gray-800 rounded-lg"
          >
            <div class="flex-1">
              <h5 class="font-medium text-white">{{ task.title }}</h5>
              <p class="text-sm text-gray-400">{{ task.categoryName || 'No category' }}</p>
            </div>
            <div class="text-right">
              <p class="text-sm font-medium text-white">{{ formatDate(task.dueDate!) }}</p>
              <span
                class="inline-block px-2 py-0.5 rounded text-xs"
                :class="getPriorityClass(task.priority)"
              >
                {{ task.priority }}
              </span>
            </div>
          </div>
          <div v-if="upcomingTasks.length === 0" class="text-center py-8 text-gray-500">
            No upcoming tasks
          </div>
        </div>
      </div>
    </div>

    <!-- Task Form Modal -->
    <TaskForm
      v-if="showForm"
      :categories="taskStore.categories"
      @close="showForm = false"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useTaskStore } from '../store/tasks'
import type { Task } from '../store/tasks'
import TaskForm from '../components/TaskForm.vue'

const taskStore = useTaskStore()
const showForm = ref(false)

const upcomingTasks = computed(() => {
  return taskStore.tasks
    .filter(t => t.dueDate && !t.isArchived && t.status !== 'DONE')
    .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
    .slice(0, 10)
})

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
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  }
}

const getPriorityClass = (priority: string) => {
  const classes = {
    LOW: 'bg-blue-500/20 text-blue-400',
    MEDIUM: 'bg-yellow-500/20 text-yellow-400',
    HIGH: 'bg-orange-500/20 text-orange-400',
    URGENT: 'bg-red-500/20 text-red-400'
  }
  return classes[priority as keyof typeof classes] || classes.MEDIUM
}

const handleSubmit = async (data: Partial<Task>) => {
  await taskStore.createTask(data)
  showForm.value = false
}

onMounted(async () => {
  await taskStore.fetchCategories()
  await taskStore.fetchTasks()
})
</script>
