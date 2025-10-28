<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h3 class="text-2xl font-bold text-white">Task Board</h3>
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

    <!-- Kanban Board -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <!-- TODO Column -->
      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <h4 class="font-semibold text-white">To Do</h4>
          <span class="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300">
            {{ taskStore.tasksByStatus.TODO.length }}
          </span>
        </div>
        <div class="space-y-3">
          <div
            v-for="task in taskStore.tasksByStatus.TODO"
            :key="task.id"
            class="p-3 bg-gray-800 rounded-lg border border-gray-700 hover:border-primary-500 transition-colors cursor-pointer"
          >
            <h5 class="font-medium text-white mb-1">{{ task.title }}</h5>
            <p v-if="task.description" class="text-sm text-gray-400 mb-2 line-clamp-2">
              {{ task.description }}
            </p>
            <div class="flex items-center justify-between">
              <span
                v-if="task.categoryName"
                class="text-xs px-2 py-0.5 rounded"
                :style="{ backgroundColor: task.categoryColor + '20', color: task.categoryColor }"
              >
                {{ task.categoryName }}
              </span>
              <span class="text-xs text-gray-500">
                {{ task.dueDate ? formatDate(task.dueDate) : '' }}
              </span>
            </div>
          </div>
          <div v-if="taskStore.tasksByStatus.TODO.length === 0" class="text-center py-8 text-gray-500 text-sm">
            No tasks
          </div>
        </div>
      </div>

      <!-- IN PROGRESS Column -->
      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <h4 class="font-semibold text-white">In Progress</h4>
          <span class="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300">
            {{ taskStore.tasksByStatus.IN_PROGRESS.length }}
          </span>
        </div>
        <div class="space-y-3">
          <div
            v-for="task in taskStore.tasksByStatus.IN_PROGRESS"
            :key="task.id"
            class="p-3 bg-gray-800 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors cursor-pointer"
          >
            <h5 class="font-medium text-white mb-1">{{ task.title }}</h5>
            <p v-if="task.description" class="text-sm text-gray-400 mb-2 line-clamp-2">
              {{ task.description }}
            </p>
            <div class="flex items-center justify-between">
              <span
                v-if="task.categoryName"
                class="text-xs px-2 py-0.5 rounded"
                :style="{ backgroundColor: task.categoryColor + '20', color: task.categoryColor }"
              >
                {{ task.categoryName }}
              </span>
              <span class="text-xs text-gray-500">
                {{ task.dueDate ? formatDate(task.dueDate) : '' }}
              </span>
            </div>
          </div>
          <div v-if="taskStore.tasksByStatus.IN_PROGRESS.length === 0" class="text-center py-8 text-gray-500 text-sm">
            No tasks
          </div>
        </div>
      </div>

      <!-- IN REVIEW Column -->
      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <h4 class="font-semibold text-white">In Review</h4>
          <span class="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300">
            {{ taskStore.tasksByStatus.IN_REVIEW.length }}
          </span>
        </div>
        <div class="space-y-3">
          <div
            v-for="task in taskStore.tasksByStatus.IN_REVIEW"
            :key="task.id"
            class="p-3 bg-gray-800 rounded-lg border border-gray-700 hover:border-purple-500 transition-colors cursor-pointer"
          >
            <h5 class="font-medium text-white mb-1">{{ task.title }}</h5>
            <p v-if="task.description" class="text-sm text-gray-400 mb-2 line-clamp-2">
              {{ task.description }}
            </p>
            <div class="flex items-center justify-between">
              <span
                v-if="task.categoryName"
                class="text-xs px-2 py-0.5 rounded"
                :style="{ backgroundColor: task.categoryColor + '20', color: task.categoryColor }"
              >
                {{ task.categoryName }}
              </span>
              <span class="text-xs text-gray-500">
                {{ task.dueDate ? formatDate(task.dueDate) : '' }}
              </span>
            </div>
          </div>
          <div v-if="taskStore.tasksByStatus.IN_REVIEW.length === 0" class="text-center py-8 text-gray-500 text-sm">
            No tasks
          </div>
        </div>
      </div>

      <!-- DONE Column -->
      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <h4 class="font-semibold text-white">Done</h4>
          <span class="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300">
            {{ taskStore.tasksByStatus.DONE.length }}
          </span>
        </div>
        <div class="space-y-3">
          <div
            v-for="task in taskStore.tasksByStatus.DONE"
            :key="task.id"
            class="p-3 bg-gray-800 rounded-lg border border-gray-700 hover:border-green-500 transition-colors cursor-pointer opacity-75"
          >
            <h5 class="font-medium text-white mb-1 line-through">{{ task.title }}</h5>
            <p v-if="task.description" class="text-sm text-gray-400 mb-2 line-clamp-2">
              {{ task.description }}
            </p>
            <div class="flex items-center justify-between">
              <span
                v-if="task.categoryName"
                class="text-xs px-2 py-0.5 rounded"
                :style="{ backgroundColor: task.categoryColor + '20', color: task.categoryColor }"
              >
                {{ task.categoryName }}
              </span>
              <span class="text-xs text-gray-500">
                {{ task.completedAt ? formatDate(task.completedAt) : '' }}
              </span>
            </div>
          </div>
          <div v-if="taskStore.tasksByStatus.DONE.length === 0" class="text-center py-8 text-gray-500 text-sm">
            No tasks
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
import { ref, onMounted } from 'vue'
import { useTaskStore } from '../store/tasks'
import type { Task } from '../store/tasks'
import TaskForm from '../components/TaskForm.vue'

const taskStore = useTaskStore()
const showForm = ref(false)

const formatDate = (date: string) => {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
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
