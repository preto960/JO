<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-white">Tasks</h2>
        <p class="text-gray-400">Manage your tasks and stay organized</p>
      </div>
      <button
        @click="showCreateModal = true"
        class="btn-primary flex items-center"
      >
        <Plus class="w-5 h-5 mr-2" />
        New Task
      </button>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
      <div class="bg-gray-800 border border-gray-700 rounded-lg p-4">
        <p class="text-gray-400 text-sm">Total</p>
        <p class="text-2xl font-bold text-white mt-1">{{ taskStore.stats.total }}</p>
      </div>
      <div class="bg-gray-800 border border-gray-700 rounded-lg p-4">
        <p class="text-gray-400 text-sm">To Do</p>
        <p class="text-2xl font-bold text-blue-400 mt-1">{{ taskStore.stats.todo }}</p>
      </div>
      <div class="bg-gray-800 border border-gray-700 rounded-lg p-4">
        <p class="text-gray-400 text-sm">In Progress</p>
        <p class="text-2xl font-bold text-yellow-400 mt-1">{{ taskStore.stats.inProgress }}</p>
      </div>
      <div class="bg-gray-800 border border-gray-700 rounded-lg p-4">
        <p class="text-gray-400 text-sm">Done</p>
        <p class="text-2xl font-bold text-green-400 mt-1">{{ taskStore.stats.done }}</p>
      </div>
      <div class="bg-gray-800 border border-gray-700 rounded-lg p-4">
        <p class="text-gray-400 text-sm">Overdue</p>
        <p class="text-2xl font-bold text-red-400 mt-1">{{ taskStore.stats.overdue }}</p>
      </div>
    </div>

    <!-- Content -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- Filters Sidebar -->
      <div class="lg:col-span-1">
        <TaskFilters
          v-model="filters"
          :categories="taskStore.categories"
          @apply="loadTasks"
        />
      </div>

      <!-- Tasks List -->
      <div class="lg:col-span-3">
        <!-- Loading -->
        <div v-if="taskStore.loading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          <p class="text-gray-400 mt-4">Loading tasks...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="taskStore.tasks.length === 0" class="bg-gray-800 border border-gray-700 rounded-lg p-12 text-center">
          <CheckSquare class="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 class="text-xl font-bold text-white mb-2">No tasks found</h3>
          <p class="text-gray-400 mb-6">Create your first task to get started</p>
          <button
            @click="showCreateModal = true"
            class="btn-primary"
          >
            <Plus class="w-5 h-5 mr-2 inline" />
            Create Task
          </button>
        </div>

        <!-- Tasks Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TaskCard
            v-for="task in taskStore.tasks"
            :key="task.id"
            :task="task"
            @click="editTask(task)"
          />
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div
      v-if="showCreateModal || selectedTask"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      @click.self="closeModal"
    >
      <div class="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="sticky top-0 bg-gray-800 border-b border-gray-700 p-6 flex items-center justify-between">
          <h2 class="text-2xl font-bold text-white">
            {{ selectedTask ? 'Edit Task' : 'Create Task' }}
          </h2>
          <button @click="closeModal" class="text-gray-400 hover:text-white">
            <X class="w-6 h-6" />
          </button>
        </div>

        <div class="p-6">
          <TaskForm
            :task="selectedTask"
            :categories="taskStore.categories"
            :loading="taskStore.loading"
            @submit="handleSubmit"
            @cancel="closeModal"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Plus, CheckSquare, X } from 'lucide-vue-next';
import { useTaskStore } from '../store/tasks';
import { useToast } from 'vue-toastification';
import TaskCard from '../components/TaskCard.vue';
import TaskForm from '../components/TaskForm.vue';
import TaskFilters from '../components/TaskFilters.vue';
import type { Task } from '../store/tasks';

const taskStore = useTaskStore();
const toast = useToast();

const showCreateModal = ref(false);
const selectedTask = ref<Task | null>(null);
const filters = ref({});

const loadTasks = async () => {
  try {
    await taskStore.fetchTasks(filters.value);
    await taskStore.fetchStats();
  } catch (error: any) {
    toast.error('Failed to load tasks');
  }
};

const editTask = (task: Task) => {
  selectedTask.value = task;
};

const closeModal = () => {
  showCreateModal.value = false;
  selectedTask.value = null;
};

const handleSubmit = async (data: Partial<Task>) => {
  try {
    if (selectedTask.value) {
      await taskStore.updateTask(selectedTask.value.id, data);
      toast.success('Task updated successfully');
    } else {
      await taskStore.createTask(data);
      toast.success('Task created successfully');
    }
    closeModal();
    loadTasks();
  } catch (error: any) {
    toast.error(error.message || 'Failed to save task');
  }
};

onMounted(async () => {
  await taskStore.fetchCategories();
  await loadTasks();
});
</script>

