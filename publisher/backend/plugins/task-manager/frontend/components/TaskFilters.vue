<template>
  <div class="bg-gray-800 border border-gray-700 rounded-lg p-4 space-y-4">
    <h3 class="text-white font-semibold mb-4">Filters</h3>

    <!-- Search -->
    <div>
      <label class="block text-sm font-medium text-gray-300 mb-2">
        Search
      </label>
      <input
        v-model="filters.search"
        type="text"
        class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500"
        placeholder="Search tasks..."
      />
    </div>

    <!-- Status -->
    <div>
      <label class="block text-sm font-medium text-gray-300 mb-2">
        Status
      </label>
      <select
        v-model="filters.status"
        class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500"
      >
        <option value="">All Statuses</option>
        <option value="TODO">To Do</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="IN_REVIEW">In Review</option>
        <option value="DONE">Done</option>
        <option value="CANCELLED">Cancelled</option>
      </select>
    </div>

    <!-- Priority -->
    <div>
      <label class="block text-sm font-medium text-gray-300 mb-2">
        Priority
      </label>
      <select
        v-model="filters.priority"
        class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500"
      >
        <option value="">All Priorities</option>
        <option value="URGENT">Urgent</option>
        <option value="HIGH">High</option>
        <option value="MEDIUM">Medium</option>
        <option value="LOW">Low</option>
      </select>
    </div>

    <!-- Category -->
    <div>
      <label class="block text-sm font-medium text-gray-300 mb-2">
        Category
      </label>
      <select
        v-model="filters.categoryId"
        class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500"
      >
        <option value="">All Categories</option>
        <option v-for="category in categories" :key="category.id" :value="category.id">
          {{ category.icon }} {{ category.name }}
        </option>
      </select>
    </div>

    <!-- Archived -->
    <div class="flex items-center">
      <input
        v-model="filters.isArchived"
        type="checkbox"
        id="archived"
        class="w-4 h-4 text-primary-600 bg-gray-700 border-gray-600 rounded focus:ring-primary-500"
      />
      <label for="archived" class="ml-2 text-sm text-gray-300">
        Show Archived
      </label>
    </div>

    <!-- Actions -->
    <div class="flex space-x-2 pt-4">
      <button
        @click="applyFilters"
        class="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700 transition-colors"
      >
        Apply
      </button>
      <button
        @click="resetFilters"
        class="px-4 py-2 bg-gray-700 text-white rounded-lg text-sm hover:bg-gray-600 transition-colors"
      >
        Reset
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { TaskCategory } from '../store/tasks';

const props = defineProps<{
  categories: TaskCategory[]
  modelValue?: any
}>();

const emit = defineEmits<{
  'update:modelValue': [filters: any]
  apply: [filters: any]
}>();

const filters = ref({
  search: '',
  status: '',
  priority: '',
  categoryId: '',
  isArchived: false
});

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    filters.value = { ...newValue };
  }
}, { immediate: true });

const applyFilters = () => {
  const cleanFilters = Object.fromEntries(
    Object.entries(filters.value).filter(([_, value]) => value !== '' && value !== false)
  );
  emit('update:modelValue', cleanFilters);
  emit('apply', cleanFilters);
};

const resetFilters = () => {
  filters.value = {
    search: '',
    status: '',
    priority: '',
    categoryId: '',
    isArchived: false
  };
  applyFilters();
};
</script>

