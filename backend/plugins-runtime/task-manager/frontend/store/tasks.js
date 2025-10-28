import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';
export const useTaskStore = defineStore('tasks', () => {
    // State
    const tasks = ref([]);
    const categories = ref([]);
    const loading = ref(false);
    const error = ref(null);
    // Filters
    const statusFilter = ref('all');
    const priorityFilter = ref('all');
    const categoryFilter = ref('all');
    const searchQuery = ref('');
    // Computed
    const filteredTasks = computed(() => {
        let filtered = tasks.value.filter(t => !t.isArchived);
        if (statusFilter.value !== 'all') {
            filtered = filtered.filter(t => t.status === statusFilter.value);
        }
        if (priorityFilter.value !== 'all') {
            filtered = filtered.filter(t => t.priority === priorityFilter.value);
        }
        if (categoryFilter.value !== 'all') {
            filtered = filtered.filter(t => t.categoryId === categoryFilter.value);
        }
        if (searchQuery.value) {
            const query = searchQuery.value.toLowerCase();
            filtered = filtered.filter(t => t.title.toLowerCase().includes(query) ||
                t.description?.toLowerCase().includes(query));
        }
        return filtered;
    });
    const tasksByStatus = computed(() => {
        return {
            TODO: tasks.value.filter(t => t.status === 'TODO' && !t.isArchived),
            IN_PROGRESS: tasks.value.filter(t => t.status === 'IN_PROGRESS' && !t.isArchived),
            IN_REVIEW: tasks.value.filter(t => t.status === 'IN_REVIEW' && !t.isArchived),
            DONE: tasks.value.filter(t => t.status === 'DONE' && !t.isArchived)
        };
    });
    // Actions
    async function fetchTasks() {
        loading.value = true;
        error.value = null;
        try {
            const response = await axios.get('/api/plugin-api/task-manager/tasks');
            tasks.value = response.data;
        }
        catch (err) {
            error.value = err.response?.data?.message || 'Failed to fetch tasks';
            console.error('Error fetching tasks:', err);
        }
        finally {
            loading.value = false;
        }
    }
    async function fetchCategories() {
        try {
            const response = await axios.get('/api/plugin-api/task-manager/categories');
            categories.value = response.data;
        }
        catch (err) {
            console.error('Error fetching categories:', err);
        }
    }
    async function createTask(taskData) {
        loading.value = true;
        error.value = null;
        try {
            const response = await axios.post('/api/plugin-api/task-manager/tasks', taskData);
            tasks.value.push(response.data);
            return { success: true, task: response.data };
        }
        catch (err) {
            error.value = err.response?.data?.message || 'Failed to create task';
            return { success: false, error: error.value };
        }
        finally {
            loading.value = false;
        }
    }
    async function updateTask(id, updates) {
        loading.value = true;
        error.value = null;
        try {
            const response = await axios.patch(`/api/plugin-api/task-manager/tasks/${id}`, updates);
            const index = tasks.value.findIndex(t => t.id === id);
            if (index !== -1) {
                tasks.value[index] = response.data;
            }
            return { success: true, task: response.data };
        }
        catch (err) {
            error.value = err.response?.data?.message || 'Failed to update task';
            return { success: false, error: error.value };
        }
        finally {
            loading.value = false;
        }
    }
    async function deleteTask(id) {
        loading.value = true;
        error.value = null;
        try {
            await axios.delete(`/api/plugin-api/task-manager/tasks/${id}`);
            tasks.value = tasks.value.filter(t => t.id !== id);
            return { success: true };
        }
        catch (err) {
            error.value = err.response?.data?.message || 'Failed to delete task';
            return { success: false, error: error.value };
        }
        finally {
            loading.value = false;
        }
    }
    async function toggleTaskStatus(id, completed) {
        const status = completed ? 'DONE' : 'TODO';
        const completedAt = completed ? new Date().toISOString() : null;
        return updateTask(id, { status, completedAt });
    }
    function setStatusFilter(status) {
        statusFilter.value = status;
    }
    function setPriorityFilter(priority) {
        priorityFilter.value = priority;
    }
    function setCategoryFilter(categoryId) {
        categoryFilter.value = categoryId;
    }
    function setSearchQuery(query) {
        searchQuery.value = query;
    }
    function clearFilters() {
        statusFilter.value = 'all';
        priorityFilter.value = 'all';
        categoryFilter.value = 'all';
        searchQuery.value = '';
    }
    return {
        // State
        tasks,
        categories,
        loading,
        error,
        statusFilter,
        priorityFilter,
        categoryFilter,
        searchQuery,
        // Computed
        filteredTasks,
        tasksByStatus,
        // Actions
        fetchTasks,
        fetchCategories,
        createTask,
        updateTask,
        deleteTask,
        toggleTaskStatus,
        setStatusFilter,
        setPriorityFilter,
        setCategoryFilter,
        setSearchQuery,
        clearFilters
    };
});
