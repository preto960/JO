<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-white">Task Calendar</h2>
        <p class="text-gray-400">View tasks by due date</p>
      </div>
      <button
        @click="showCreateModal = true"
        class="btn-primary flex items-center"
      >
        <Plus class="w-5 h-5 mr-2" />
        New Task
      </button>
    </div>

    <!-- Calendar View (Simplified) -->
    <div class="bg-gray-800 border border-gray-700 rounded-lg p-6">
      <div class="text-center py-12">
        <Calendar class="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h3 class="text-xl font-bold text-white mb-2">Calendar View</h3>
        <p class="text-gray-400 mb-6">
          Full calendar integration coming soon!<br />
          For now, here are your tasks with due dates:
        </p>
      </div>

      <!-- Tasks with Due Dates -->
      <div class="space-y-4 mt-6">
        <div
          v-for="task in tasksWithDueDates"
          :key="task.id"
          class="flex items-center justify-between p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer"
          @click="editTask(task)"
        >
          <div class="flex-1">
            <h4 class="text-white font-semibold">{{ task.title }}</h4>
            <p class="text-gray-400 text-sm">{{ task.description }}</p>
          </div>
          <div class="text-right">
            <p class="text-gray-300 text-sm">
              {{ formatDate(task.dueDate!) }}
            </p>
            <span
              class="inline-block px-2 py-1 text-xs rounded mt-1"
              :class="getStatusClass(task.status)"
            >
              {{ formatStatus(task.status) }}
            </span>
          </div>
        </div>

        <div v-if="tasksWithDueDates.length === 0" class="text-center py-8">
          <p class="text-gray-400">No tasks with due dates</p>
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
import { ref, computed, onMounted } from 'vue';
import { Plus, Calendar, X } from 'lucide-vue-next';
import { useTaskStore } from '../store/tasks';
import { useToast } from 'vue-toastification';
import TaskForm from '../components/TaskForm.vue';
import type { Task } from '../store/tasks';

const taskStore = useTaskStore();
const toast = useToast();

const showCreateModal = ref(false);
const selectedTask = ref<Task | null>(null);

const tasksWithDueDates = computed(() => {
  return taskStore.tasks
    .filter(task => task.dueDate)
    .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime());
});

const loadTasks = async () => {
  try {
    await taskStore.fetchTasks({ isArchived: false });
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

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const formatStatus = (status: string) => {
  return status.replace('_', ' ');
};

const getStatusClass = (status: string) => {
  switch (status) {
    case 'TODO': return 'bg-gray-600 text-gray-300';
    case 'IN_PROGRESS': return 'bg-blue-600 text-blue-200';
    case 'IN_REVIEW': return 'bg-purple-600 text-purple-200';
    case 'DONE': return 'bg-green-600 text-green-200';
    default: return 'bg-gray-600 text-gray-300';
  }
};

onMounted(async () => {
  await taskStore.fetchCategories();
  await loadTasks();
});
</script>

