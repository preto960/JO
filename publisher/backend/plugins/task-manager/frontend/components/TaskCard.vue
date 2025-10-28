<template>
  <div 
    class="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-primary-500 transition-all cursor-pointer"
    :class="priorityClass"
    @click="$emit('click', task)"
  >
    <!-- Header -->
    <div class="flex items-start justify-between mb-2">
      <div class="flex-1">
        <h3 class="text-white font-semibold mb-1">{{ task.title }}</h3>
        <p v-if="task.description" class="text-gray-400 text-sm line-clamp-2">
          {{ task.description }}
        </p>
      </div>
      
      <!-- Priority Badge -->
      <span 
        class="px-2 py-1 text-xs rounded-full ml-2"
        :class="priorityBadgeClass"
      >
        {{ task.priority }}
      </span>
    </div>

    <!-- Category -->
    <div v-if="task.category" class="mb-2">
      <span 
        class="inline-flex items-center px-2 py-1 text-xs rounded"
        :style="{ backgroundColor: task.category.color + '20', color: task.category.color }"
      >
        <span v-if="task.category.icon" class="mr-1">{{ task.category.icon }}</span>
        {{ task.category.name }}
      </span>
    </div>

    <!-- Tags -->
    <div v-if="task.tags && task.tags.length > 0" class="flex flex-wrap gap-1 mb-2">
      <span
        v-for="tag in task.tags.slice(0, 3)"
        :key="tag"
        class="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded"
      >
        #{{ tag }}
      </span>
      <span
        v-if="task.tags.length > 3"
        class="px-2 py-1 bg-gray-700 text-gray-400 text-xs rounded"
      >
        +{{ task.tags.length - 3 }}
      </span>
    </div>

    <!-- Footer -->
    <div class="flex items-center justify-between text-xs text-gray-400 mt-3 pt-3 border-t border-gray-700">
      <div class="flex items-center space-x-3">
        <!-- Due Date -->
        <span v-if="task.dueDate" class="flex items-center" :class="{ 'text-red-400': isOverdue }">
          📅 {{ formatDate(task.dueDate) }}
        </span>
        
        <!-- Estimated Hours -->
        <span v-if="task.estimatedHours > 0" class="flex items-center">
          ⏱️ {{ task.estimatedHours }}h
        </span>
      </div>

      <!-- Status Badge -->
      <span 
        class="px-2 py-1 rounded text-xs"
        :class="statusBadgeClass"
      >
        {{ formatStatus(task.status) }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Task } from '../store/tasks';

const props = defineProps<{
  task: Task
}>();

defineEmits<{
  click: [task: Task]
}>();

const isOverdue = computed(() => {
  if (!props.task.dueDate || props.task.status === 'DONE') return false;
  return new Date(props.task.dueDate) < new Date();
});

const priorityClass = computed(() => {
  switch (props.task.priority) {
    case 'URGENT': return 'border-l-4 border-l-red-500';
    case 'HIGH': return 'border-l-4 border-l-orange-500';
    case 'MEDIUM': return 'border-l-4 border-l-yellow-500';
    case 'LOW': return 'border-l-4 border-l-green-500';
    default: return '';
  }
});

const priorityBadgeClass = computed(() => {
  switch (props.task.priority) {
    case 'URGENT': return 'bg-red-500/20 text-red-400';
    case 'HIGH': return 'bg-orange-500/20 text-orange-400';
    case 'MEDIUM': return 'bg-yellow-500/20 text-yellow-400';
    case 'LOW': return 'bg-green-500/20 text-green-400';
    default: return 'bg-gray-500/20 text-gray-400';
  }
});

const statusBadgeClass = computed(() => {
  switch (props.task.status) {
    case 'TODO': return 'bg-gray-600 text-gray-300';
    case 'IN_PROGRESS': return 'bg-blue-600 text-blue-200';
    case 'IN_REVIEW': return 'bg-purple-600 text-purple-200';
    case 'DONE': return 'bg-green-600 text-green-200';
    case 'CANCELLED': return 'bg-red-600 text-red-200';
    default: return 'bg-gray-600 text-gray-300';
  }
});

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const formatStatus = (status: string) => {
  return status.replace('_', ' ');
};
</script>

