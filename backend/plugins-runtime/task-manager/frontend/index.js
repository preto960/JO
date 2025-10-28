// Este archivo será el punto de entrada del plugin en el frontend
// El sistema de plugins lo cargará dinámicamente
export { useTaskStore } from './store/tasks';
export { default as TaskCard } from './components/TaskCard.js';
export { default as TaskForm } from './components/TaskForm.js';
export { default as TaskFilters } from './components/TaskFilters.js';
export { default as TaskList } from './views/TaskList.js';
export { default as TaskBoard } from './views/TaskBoard.js';
export { default as TaskCalendar } from './views/TaskCalendar.js';
// Plugin metadata
export const pluginInfo = {
    name: 'Task Manager',
    version: '1.0.0',
    author: 'NJO Team'
};
console.log('📋 Task Manager Plugin loaded');
