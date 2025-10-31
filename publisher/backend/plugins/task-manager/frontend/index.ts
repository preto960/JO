// Este archivo será el punto de entrada del plugin en el frontend
// El sistema de plugins lo cargará dinámicamente

import { useTaskStore } from './store/tasks';
import TaskCard from './components/TaskCard.vue';
import TaskForm from './components/TaskForm.vue';
import TaskFilters from './components/TaskFilters.vue';
import TaskList from './views/TaskList.vue';
import TaskBoard from './views/TaskBoard.vue';
import TaskCalendar from './views/TaskCalendar.vue';

// Plugin metadata - será sobrescrito por el backend con datos completos
const pluginInfo = {
  name: 'Task Manager',
  version: '4.0.1',
  author: 'NJO Team',
  slug: 'task-manager',
  description: 'Complete task management system'
};

// Rutas del plugin - exportadas para el sistema de routing
const routes = [
  {
    path: '/tasks',
    name: 'Tasks',
    component: 'TaskList',
    meta: {
      title: 'Tasks',
      icon: 'CheckSquare',
      requiresAuth: true
    }
  },
  {
    path: '/tasks/board',
    name: 'TaskBoard',
    component: 'TaskBoard',
    meta: {
      title: 'Task Board',
      icon: 'Kanban',
      requiresAuth: true
    }
  },
  {
    path: '/tasks/calendar',
    name: 'TaskCalendar',
    component: 'TaskCalendar',
    meta: {
      title: 'Calendar',
      icon: 'Calendar',
      requiresAuth: true
    }
  }
];

console.log('📋 Task Manager Plugin loaded');

// Export default para que Vite lo asigne a la variable global en IIFE
export default {
  pluginInfo,
  routes,
  useTaskStore,
  TaskCard,
  TaskForm,
  TaskFilters,
  TaskList,
  TaskBoard,
  TaskCalendar
};



