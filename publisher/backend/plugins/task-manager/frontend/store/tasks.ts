import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';

const API_BASE = '/api/plugins/task-manager';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  categoryId?: string;
  category?: TaskCategory;
  assignedToId?: string;
  createdById?: string;
  dueDate?: string;
  startDate?: string;
  completedAt?: string;
  estimatedHours: number;
  actualHours: number;
  tags?: string[];
  position: number;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TaskCategory {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon?: string;
  position: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TaskStats {
  total: number;
  todo: number;
  inProgress: number;
  done: number;
  overdue: number;
}

export const useTaskStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>([]);
  const categories = ref<TaskCategory[]>([]);
  const stats = ref<TaskStats>({
    total: 0,
    todo: 0,
    inProgress: 0,
    done: 0,
    overdue: 0
  });
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Computed
  const tasksByStatus = computed(() => {
    return {
      todo: tasks.value.filter(t => t.status === 'TODO'),
      inProgress: tasks.value.filter(t => t.status === 'IN_PROGRESS'),
      inReview: tasks.value.filter(t => t.status === 'IN_REVIEW'),
      done: tasks.value.filter(t => t.status === 'DONE'),
      cancelled: tasks.value.filter(t => t.status === 'CANCELLED')
    };
  });

  const tasksByPriority = computed(() => {
    return {
      urgent: tasks.value.filter(t => t.priority === 'URGENT'),
      high: tasks.value.filter(t => t.priority === 'HIGH'),
      medium: tasks.value.filter(t => t.priority === 'MEDIUM'),
      low: tasks.value.filter(t => t.priority === 'LOW')
    };
  });

  // Actions
  async function fetchTasks(filters?: any) {
    loading.value = true;
    error.value = null;
    try {
      const params = new URLSearchParams(filters || {});
      const response = await axios.get(`${API_BASE}/tasks?${params}`);
      tasks.value = response.data;
    } catch (err: any) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchTask(id: string) {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.get(`${API_BASE}/tasks/${id}`);
      return response.data;
    } catch (err: any) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function createTask(taskData: Partial<Task>) {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.post(`${API_BASE}/tasks`, taskData);
      tasks.value.unshift(response.data);
      return response.data;
    } catch (err: any) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function updateTask(id: string, taskData: Partial<Task>) {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.put(`${API_BASE}/tasks/${id}`, taskData);
      const index = tasks.value.findIndex(t => t.id === id);
      if (index !== -1) {
        tasks.value[index] = response.data;
      }
      return response.data;
    } catch (err: any) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function deleteTask(id: string) {
    loading.value = true;
    error.value = null;
    try {
      await axios.delete(`${API_BASE}/tasks/${id}`);
      tasks.value = tasks.value.filter(t => t.id !== id);
    } catch (err: any) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchCategories() {
    try {
      const response = await axios.get(`${API_BASE}/categories`);
      categories.value = response.data;
    } catch (err: any) {
      error.value = err.message;
      throw err;
    }
  }

  async function createCategory(categoryData: Partial<TaskCategory>) {
    try {
      const response = await axios.post(`${API_BASE}/categories`, categoryData);
      categories.value.push(response.data);
      return response.data;
    } catch (err: any) {
      error.value = err.message;
      throw err;
    }
  }

  async function updateCategory(id: string, categoryData: Partial<TaskCategory>) {
    try {
      const response = await axios.put(`${API_BASE}/categories/${id}`, categoryData);
      const index = categories.value.findIndex(c => c.id === id);
      if (index !== -1) {
        categories.value[index] = response.data;
      }
      return response.data;
    } catch (err: any) {
      error.value = err.message;
      throw err;
    }
  }

  async function deleteCategory(id: string) {
    try {
      await axios.delete(`${API_BASE}/categories/${id}`);
      categories.value = categories.value.filter(c => c.id !== id);
    } catch (err: any) {
      error.value = err.message;
      throw err;
    }
  }

  async function fetchStats() {
    try {
      const response = await axios.get(`${API_BASE}/stats`);
      stats.value = response.data;
    } catch (err: any) {
      error.value = err.message;
      throw err;
    }
  }

  return {
    tasks,
    categories,
    stats,
    loading,
    error,
    tasksByStatus,
    tasksByPriority,
    fetchTasks,
    fetchTask,
    createTask,
    updateTask,
    deleteTask,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    fetchStats
  };
});

