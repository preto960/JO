<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-white">Task Board</h2>
        <p class="text-gray-400">Kanban-style task management</p>
      </div>
      <button
        @click="showCreateModal = true"
        class="btn-primary flex items-center"
      >
        <Plus class="w-5 h-5 mr-2" />
        New Task
      </button>
    </div>

    <!-- Kanban Board -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <!-- TO DO Column -->
      <div class="bg-gray-800 border border-gray-700 rounded-lg p-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-white font-semibold">To Do</h3>
          <span class="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
            {{ taskStore.tasksByStatus.todo.length }}
          </span>
        </div>
        <div class="space-y-3">
          <TaskCard
            v-for="task in taskStore.tasksByStatus.todo"
            :key="task.id"
            :task="task"
            @click="editTask(task)"
          />
        </div>
      </div>

      <!-- IN PROGRESS Column -->
      <div class="bg-gray-800 border border-gray-700 rounded-lg p-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-white font-semibold">In Progress</h3>
          <span class="px-2 py-1 bg-blue-700 text-blue-200 text-xs rounded">
            {{ taskStore.tasksByStatus.inProgress.length }}
          </span>
        </div>
        <div class="space-y-3">
          <TaskCard
            v-for="task in taskStore.tasksByStatus.inProgress"
            :key="task.id"
            :task="task"
            @click="editTask(task)"
          />
        </div>
      </div>

      <!-- IN REVIEW Column -->
      <div class="bg-gray-800 border border-gray-700 rounded-lg p-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-white font-semibold">In Review</h3>
          <span class="px-2 py-1 bg-purple-700 text-purple-200 text-xs rounded">
            {{ taskStore.tasksByStatus.inReview.length }}
          </span>
        </div>
        <div class="space-y-3">
          <TaskCard
            v-for="task in taskStore.tasksByStatus.inReview"
            :key="task.id"
            :task="task"
            @click="editTask(task)"
          />
        </div>
      </div>

      <!-- DONE Column -->
      <div class="bg-gray-800 border border-gray-700 rounded-lg p-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-white font-semibold">Done</h3>
          <span class="px-2 py-1 bg-green-700 text-green-200 text-xs rounded">
            {{ taskStore.tasksByStatus.done.length }}
          </span>
        </div>
        <div class="space-y-3">
          <TaskCard
            v-for="task in taskStore.tasksByStatus.done"
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
import { Plus, X } from 'lucide-vue-next';
import { useTaskStore } from '../store/tasks';
import { useToast } from 'vue-toastification';
import TaskCard from '../components/TaskCard.vue';
import TaskForm from '../components/TaskForm.vue';
import type { Task } from '../store/tasks';

const taskStore = useTaskStore();
const toast = useToast();

const showCreateModal = ref(false);
const selectedTask = ref<Task | null>(null);

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

onMounted(async () => {
  await taskStore.fetchCategories();
  await loadTasks();
});
</script>

