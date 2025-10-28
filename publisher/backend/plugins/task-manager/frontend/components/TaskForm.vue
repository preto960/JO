<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <!-- Title -->
    <div>
      <label class="block text-sm font-medium text-gray-300 mb-2">
        Title <span class="text-red-400">*</span>
      </label>
      <input
        v-model="formData.title"
        type="text"
        required
        class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
        placeholder="Enter task title"
      />
    </div>

    <!-- Description -->
    <div>
      <label class="block text-sm font-medium text-gray-300 mb-2">
        Description
      </label>
      <textarea
        v-model="formData.description"
        rows="3"
        class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
        placeholder="Enter task description"
      ></textarea>
    </div>

    <!-- Status and Priority -->
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">
          Status
        </label>
        <select
          v-model="formData.status"
          class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
        >
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="IN_REVIEW">In Review</option>
          <option value="DONE">Done</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">
          Priority
        </label>
        <select
          v-model="formData.priority"
          class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
        >
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="URGENT">Urgent</option>
        </select>
      </div>
    </div>

    <!-- Category -->
    <div>
      <label class="block text-sm font-medium text-gray-300 mb-2">
        Category
      </label>
      <select
        v-model="formData.categoryId"
        class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
      >
        <option :value="null">No category</option>
        <option v-for="category in categories" :key="category.id" :value="category.id">
          {{ category.icon }} {{ category.name }}
        </option>
      </select>
    </div>

    <!-- Dates -->
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">
          Start Date
        </label>
        <input
          v-model="formData.startDate"
          type="date"
          class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">
          Due Date
        </label>
        <input
          v-model="formData.dueDate"
          type="date"
          class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
        />
      </div>
    </div>

    <!-- Hours -->
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">
          Estimated Hours
        </label>
        <input
          v-model.number="formData.estimatedHours"
          type="number"
          min="0"
          step="0.5"
          class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">
          Actual Hours
        </label>
        <input
          v-model.number="formData.actualHours"
          type="number"
          min="0"
          step="0.5"
          class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
        />
      </div>
    </div>

    <!-- Tags -->
    <div>
      <label class="block text-sm font-medium text-gray-300 mb-2">
        Tags (comma separated)
      </label>
      <input
        v-model="tagsInput"
        type="text"
        class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
        placeholder="e.g., bug, feature, urgent"
      />
    </div>

    <!-- Actions -->
    <div class="flex justify-end space-x-3 pt-4">
      <button
        type="button"
        @click="$emit('cancel')"
        class="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
      >
        Cancel
      </button>
      <button
        type="submit"
        :disabled="loading"
        class="px-6 py-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-lg hover:from-primary-700 hover:to-accent-700 transition-all disabled:opacity-50"
      >
        {{ loading ? 'Saving...' : (task ? 'Update Task' : 'Create Task') }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import type { Task, TaskCategory } from '../store/tasks';

const props = defineProps<{
  task?: Task | null
  categories: TaskCategory[]
  loading?: boolean
}>();

const emit = defineEmits<{
  submit: [data: Partial<Task>]
  cancel: []
}>();

const formData = ref<Partial<Task>>({
  title: '',
  description: '',
  status: 'TODO',
  priority: 'MEDIUM',
  categoryId: null,
  startDate: null,
  dueDate: null,
  estimatedHours: 0,
  actualHours: 0,
  tags: [],
  position: 0,
  isArchived: false
});

const tagsInput = ref('');

// Watch for task changes (edit mode)
watch(() => props.task, (newTask) => {
  if (newTask) {
    formData.value = { ...newTask };
    tagsInput.value = newTask.tags?.join(', ') || '';
  }
}, { immediate: true });

const handleSubmit = () => {
  // Parse tags
  if (tagsInput.value) {
    formData.value.tags = tagsInput.value.split(',').map(t => t.trim()).filter(Boolean);
  } else {
    formData.value.tags = [];
  }

  emit('submit', formData.value);
};
</script>

