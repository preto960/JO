# 📋 Task Manager Plugin

A comprehensive task management plugin for the NJO Plugin System.

## Features

- ✅ **Task Management** - Create, edit, delete, and organize tasks
- 📊 **Multiple Views** - List, Board (Kanban), and Calendar views
- 🏷️ **Categories** - Organize tasks with custom categories
- 🎯 **Priorities** - Set task priorities (Low, Medium, High, Urgent)
- 📅 **Due Dates** - Track deadlines and overdue tasks
- ⏱️ **Time Tracking** - Estimate and track actual hours
- 🏷️ **Tags** - Add multiple tags to tasks
- 📈 **Statistics** - View task stats and progress
- 🔄 **Status Tracking** - TODO, In Progress, In Review, Done, Cancelled
- 🎨 **Custom Categories** - Create categories with colors and icons

## Installation

1. Open the Publisher dashboard
2. Navigate to "Local Plugins"
3. Find "Task Manager" in the list
4. Click "Build & Publish"
5. Open the main admin panel
6. Go to "Plugin Market"
7. Find "Task Manager" and click "Install"
8. Activate the plugin

## Usage

### Creating a Task

1. Navigate to "Tasks" in the sidebar
2. Click "New Task"
3. Fill in the task details:
   - Title (required)
   - Description
   - Status
   - Priority
   - Category
   - Due date
   - Estimated hours
   - Tags
4. Click "Create Task"

### Views

#### List View
- Default view showing all tasks in a grid
- Filter by status, priority, category
- Search tasks by title or description

#### Board View
- Kanban-style board with columns for each status
- Drag and drop support (coming soon)
- Visual workflow management

#### Calendar View
- See tasks organized by due date
- Identify upcoming deadlines
- Full calendar integration (coming soon)

### Categories

1. Navigate to "Tasks"
2. Use the filters sidebar
3. Select a category or create a new one
4. Assign colors and icons to categories

### Filtering

Use the filters sidebar to:
- Search tasks by keyword
- Filter by status
- Filter by priority
- Filter by category
- Show/hide archived tasks

## API Endpoints

The plugin exposes the following API endpoints:

### Tasks
- `GET /api/plugins/task-manager/tasks` - Get all tasks
- `GET /api/plugins/task-manager/tasks/:id` - Get a task
- `POST /api/plugins/task-manager/tasks` - Create a task
- `PUT /api/plugins/task-manager/tasks/:id` - Update a task
- `DELETE /api/plugins/task-manager/tasks/:id` - Delete a task

### Categories
- `GET /api/plugins/task-manager/categories` - Get all categories
- `POST /api/plugins/task-manager/categories` - Create a category
- `PUT /api/plugins/task-manager/categories/:id` - Update a category
- `DELETE /api/plugins/task-manager/categories/:id` - Delete a category

### Stats
- `GET /api/plugins/task-manager/stats` - Get task statistics

## Database Schema

### Task
- `id` - UUID
- `title` - String (required)
- `description` - Text
- `status` - Enum (TODO, IN_PROGRESS, IN_REVIEW, DONE, CANCELLED)
- `priority` - Enum (LOW, MEDIUM, HIGH, URGENT)
- `categoryId` - UUID (foreign key)
- `assignedToId` - UUID
- `createdById` - UUID
- `dueDate` - Timestamp
- `startDate` - Timestamp
- `completedAt` - Timestamp
- `estimatedHours` - Integer
- `actualHours` - Integer
- `tags` - Array of strings
- `position` - Integer
- `isArchived` - Boolean
- `createdAt` - Timestamp
- `updatedAt` - Timestamp

### TaskCategory
- `id` - UUID
- `name` - String (required)
- `description` - String
- `color` - String (hex color)
- `icon` - String (emoji)
- `position` - Integer
- `isActive` - Boolean
- `createdAt` - Timestamp
- `updatedAt` - Timestamp

## Settings

The plugin supports the following settings:

- **Default View** - Choose between List, Board, or Calendar view
- **Enable Notifications** - Receive notifications for task updates
- **Task ID Prefix** - Customize the prefix for task IDs
- **Tasks Per Page** - Number of tasks to display per page

## Permissions

The plugin requires the following permissions:

- `tasks:read` - View tasks
- `tasks:create` - Create new tasks
- `tasks:update` - Update existing tasks
- `tasks:delete` - Delete tasks
- `tasks:assign` - Assign tasks to users

## Lifecycle Hooks

The plugin implements the following lifecycle hooks:

- `onInstall` - Executed when the plugin is installed
- `onActivate` - Executed when the plugin is activated
- `onDeactivate` - Executed when the plugin is deactivated
- `onUpdate` - Executed when the plugin is updated
- `onUninstall` - Executed when the plugin is uninstalled

## Development

### Structure

```
task-manager/
├── manifest.json           # Plugin manifest
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript config
├── backend/               # Backend code
│   ├── models/           # Database models
│   ├── controllers/      # API controllers
│   ├── routes/           # API routes
│   ├── hooks/            # Lifecycle hooks
│   └── index.ts          # Backend entry point
└── frontend/             # Frontend code
    ├── components/       # Vue components
    ├── views/            # Vue views
    ├── store/            # Pinia store
    └── index.ts          # Frontend entry point
```

### Building

```bash
npm install
npm run build
```

### Testing

The plugin automatically integrates with the hot reload system, so changes are reflected immediately during development.

## License

MIT

## Author

NJO Team

## Version

1.0.0

