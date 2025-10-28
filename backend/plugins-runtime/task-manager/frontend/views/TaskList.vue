<template>
  <div class="space-y-6">
    <!-- Header with Actions -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <h3 class="text-2xl font-bold text-white">Tasks</h3>
        <span class="px-3 py-1 bg-gray-700 rounded-full text-sm text-gray-300">
          {{ filteredTasks.length }} tasks
        </span>
      </div>
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

    <!-- Filters -->
    <div class="card">
      <div class="flex flex-wrap items-center gap-4">
        <!-- Status Filter -->
        <div class="flex items-center space-x-2">
          <span class="text-sm text-gray-400">Status:</span>
          <div class="flex space-x-1">
            <button
              v-for="status in statusOptions"
              :key="status.value"
              @click="taskStore.setStatusFilter(status.value)"
              class="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
              :class="taskStore.statusFilter === status.value
                ? 'bg-primary-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'"
            >
              {{ status.label }}
            </button>
          </div>
        </div>

        <!-- Category Filter -->
        <div class="flex items-center space-x-2">
          <span class="text-sm text-gray-400">Category:</span>
          <select
            v-model="taskStore.categoryFilter"
            class="px-3 py-1.5 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All</option>
            <option v-for="cat in taskStore.categories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>
        </div>

        <!-- Priority Filter -->
        <div class="flex items-center space-x-2">
          <span class="text-sm text-gray-400">Priority:</span>
          <select
            v-model="taskStore.priorityFilter"
            class="px-3 py-1.5 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
        </div>

        <!-- Search -->
        <div class="flex-1 min-w-[200px]">
          <input
            v-model="taskStore.searchQuery"
            type="text"
            placeholder="Search tasks..."
            class="w-full px-4 py-1.5 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <!-- Clear Filters -->
        <button
          v-if="hasActiveFilters"
          @click="taskStore.clearFilters()"
          class="px-3 py-1.5 text-sm text-gray-400 hover:text-white transition-colors"
        >
          Clear filters
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="taskStore.loading" class="card text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mb-4"></div>
      <p class="text-gray-400">Loading tasks...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="taskStore.error" class="card bg-red-500/10 border border-red-500/20">
      <div class="flex items-center space-x-3">
        <svg class="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-red-400">{{ taskStore.error }}</p>
      </div>
    </div>

    <!-- Tasks Table -->
    <div v-else-if="filteredTasks.length > 0" class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-800 border-b border-gray-700">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-12">
                <input
                  type="checkbox"
                  @change="toggleAll"
                  class="w-4 h-4 rounded border-gray-600 text-primary-600 focus:ring-primary-500 focus:ring-offset-gray-900"
                />
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Task
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Category
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Priority
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Due Date
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-24">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <TaskCard
              v-for="task in filteredTasks"
              :key="task.id"
              :task="task"
              @toggle="handleToggle"
              @edit="handleEdit"
              @delete="handleDelete"
            />
          </tbody>
        </table>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="card text-center py-12">
      <svg class="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
      <h3 class="text-xl font-bold text-white mb-2">No tasks found</h3>
      <p class="text-gray-400 mb-6">
        {{ hasActiveFilters ? 'Try adjusting your filters' : 'Create your first task to get started' }}
      </p>
      <button
        v-if="!hasActiveFilters"
        @click="showForm = true"
        class="inline-flex items-center space-x-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span>Create First Task</span>
      </button>
    </div>

    <!-- Task Form Modal -->
    <TaskForm
      v-if="showForm"
      :task="editingTask"
      :categories="taskStore.categories"
      @close="closeForm"
      @submit="handleSubmit"
    />

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteConfirm"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      @click.self="showDeleteConfirm = false"
    >
      <div class="bg-gray-800 rounded-xl p-6 max-w-md w-full">
        <h3 class="text-xl font-bold text-white mb-4">Delete Task?</h3>
        <p class="text-gray-300 mb-6">
          Are you sure you want to delete this task? This action cannot be undone.
        </p>
        <div class="flex justify-end space-x-3">
          <button
            @click="showDeleteConfirm = false"
            class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            @click="confirmDelete"
            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useTaskStore } from '../store/tasks'
import type { Task } from '../store/tasks'
import TaskCard from '../components/TaskCard.vue'
import TaskForm from '../components/TaskForm.vue'

const taskStore = useTaskStore()

const showForm = ref(false)
const editingTask = ref<Task | undefined>()
const showDeleteConfirm = ref(false)
const deletingTaskId = ref<string | null>(null)

const statusOptions = [
  { label: 'All', value: 'all' },
  { label: 'To Do', value: 'TODO' },
  { label: 'In Progress', value: 'IN_PROGRESS' },
  { label: 'Done', value: 'DONE' }
]

const filteredTasks = computed(() => taskStore.filteredTasks)

const hasActiveFilters = computed(() => {
  return taskStore.statusFilter !== 'all' ||
         taskStore.priorityFilter !== 'all' ||
         taskStore.categoryFilter !== 'all' ||
         taskStore.searchQuery !== ''
})

const handleToggle = async (id: string) => {
  const task = taskStore.tasks.find(t => t.id === id)
  if (task) {
    await taskStore.toggleTaskStatus(id, task.status !== 'DONE')
  }
}

const handleEdit = (task: Task) => {
  editingTask.value = task
  showForm.value = true
}

const handleDelete = (id: string) => {
  deletingTaskId.value = id
  showDeleteConfirm.value = true
}

const confirmDelete = async () => {
  if (deletingTaskId.value) {
    await taskStore.deleteTask(deletingTaskId.value)
    showDeleteConfirm.value = false
    deletingTaskId.value = null
  }
}

const handleSubmit = async (data: Partial<Task>) => {
  if (editingTask.value) {
    await taskStore.updateTask(editingTask.value.id, data)
  } else {
    await taskStore.createTask(data)
  }
  closeForm()
}

const closeForm = () => {
  showForm.value = false
  editingTask.value = undefined
}

const toggleAll = (event: Event) => {
  const checked = (event.target as HTMLInputElement).checked
  // TODO: Implement bulk toggle
  console.log('Toggle all:', checked)
}

onMounted(async () => {
  await taskStore.fetchCategories()
  await taskStore.fetchTasks()
})
</script>
