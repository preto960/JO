
import { defineComponent as _defineComponent } from 'vue'
import { ref, computed, onMounted } from 'vue'
import { useTaskStore } from '../store/tasks'
import TaskForm from '../components/TaskForm.js'


export default /*@__PURE__*/_defineComponent({
  __name: 'TaskCalendar',
  setup(__props, { expose: __expose }) {
  __expose();

const taskStore = useTaskStore()
const showForm = ref(false)

const upcomingTasks = computed(() => {
  return taskStore.tasks
    .filter(t => t.dueDate && !t.isArchived && t.status !== 'DONE')
    .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
    .slice(0, 10)
})

const formatDate = (date: string) => {
  const d = new Date(date)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  if (d.toDateString() === today.toDateString()) {
    return 'Today'
  } else if (d.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow'
  } else {
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  }
}

const getPriorityClass = (priority: string) => {
  const classes = {
    LOW: 'bg-blue-500/20 text-blue-400',
    MEDIUM: 'bg-yellow-500/20 text-yellow-400',
    HIGH: 'bg-orange-500/20 text-orange-400',
    URGENT: 'bg-red-500/20 text-red-400'
  }
  return classes[priority as keyof typeof classes] || classes.MEDIUM
}

const handleSubmit = async (data: Partial<Task>) => {
  await taskStore.createTask(data)
  showForm.value = false
}

onMounted(async () => {
  await taskStore.fetchCategories()
  await taskStore.fetchTasks()
})

const __returned__ = { taskStore, showForm, upcomingTasks, formatDate, getPriorityClass, handleSubmit, TaskForm }
Object.defineProperty(__returned__, '__isScriptSetup', { enumerable: false, value: true })
return __returned__
}

})

import { createElementVNode as _createElementVNode, openBlock as _openBlock, createElementBlock as _createElementBlock, createCommentVNode as _createCommentVNode, renderList as _renderList, Fragment as _Fragment, toDisplayString as _toDisplayString, normalizeClass as _normalizeClass, resolveComponent as _resolveComponent, createBlock as _createBlock, createStaticVNode as _createStaticVNode } from "vue"

const _hoisted_1 = { class: "space-y-6" }
const _hoisted_2 = { class: "flex items-center justify-between" }
const _hoisted_3 = { class: "card" }
const _hoisted_4 = { class: "border-t border-gray-700 pt-6" }
const _hoisted_5 = { class: "space-y-3" }
const _hoisted_6 = { class: "flex-1" }
const _hoisted_7 = { class: "font-medium text-white" }
const _hoisted_8 = { class: "text-sm text-gray-400" }
const _hoisted_9 = { class: "text-right" }
const _hoisted_10 = { class: "text-sm font-medium text-white" }
const _hoisted_11 = {
  key: 0,
  class: "text-center py-8 text-gray-500"
}

export function render(_ctx, _cache) {
  const _component_TaskForm = _resolveComponent("TaskForm")

  return (_openBlock(), _createElementBlock("div", _hoisted_1, [
    _createElementVNode("div", _hoisted_2, [
      _cache[3] || (_cache[3] = _createElementVNode("h3", { class: "text-2xl font-bold text-white" }, "Task Calendar", -1 /* CACHED */)),
      _createElementVNode("button", {
        onClick: _cache[0] || (_cache[0] = $event => (_ctx.showForm = true)),
        class: "flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
      }, [...(_cache[2] || (_cache[2] = [
        _createElementVNode("svg", {
          class: "w-5 h-5",
          fill: "none",
          stroke: "currentColor",
          viewBox: "0 0 24 24"
        }, [
          _createElementVNode("path", {
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
            "stroke-width": "2",
            d: "M12 4v16m8-8H4"
          })
        ], -1 /* CACHED */),
        _createElementVNode("span", null, "New Task", -1 /* CACHED */)
      ]))])
    ]),
    _createCommentVNode(" Calendar View Placeholder "),
    _createElementVNode("div", _hoisted_3, [
      _cache[5] || (_cache[5] = _createStaticVNode("<div class=\"text-center py-12\"><svg class=\"w-16 h-16 text-gray-600 mx-auto mb-4\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z\"></path></svg><h4 class=\"text-lg font-semibold text-white mb-2\">Calendar View</h4><p class=\"text-gray-400 mb-6\">Full calendar view coming soon</p></div>", 1)),
      _createCommentVNode(" Upcoming Tasks "),
      _createElementVNode("div", _hoisted_4, [
        _cache[4] || (_cache[4] = _createElementVNode("h4", { class: "font-semibold text-white mb-4" }, "Upcoming Tasks", -1 /* CACHED */)),
        _createElementVNode("div", _hoisted_5, [
          (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(_ctx.upcomingTasks, (task) => {
            return (_openBlock(), _createElementBlock("div", {
              key: task.id,
              class: "flex items-center justify-between p-3 bg-gray-800 rounded-lg"
            }, [
              _createElementVNode("div", _hoisted_6, [
                _createElementVNode("h5", _hoisted_7, _toDisplayString(task.title), 1 /* TEXT */),
                _createElementVNode("p", _hoisted_8, _toDisplayString(task.categoryName || 'No category'), 1 /* TEXT */)
              ]),
              _createElementVNode("div", _hoisted_9, [
                _createElementVNode("p", _hoisted_10, _toDisplayString(_ctx.formatDate(task.dueDate!)), 1 /* TEXT */),
                _createElementVNode("span", {
                  class: _normalizeClass(["inline-block px-2 py-0.5 rounded text-xs", _ctx.getPriorityClass(task.priority)])
                }, _toDisplayString(task.priority), 3 /* TEXT, CLASS */)
              ])
            ]))
          }), 128 /* KEYED_FRAGMENT */)),
          (_ctx.upcomingTasks.length === 0)
            ? (_openBlock(), _createElementBlock("div", _hoisted_11, " No upcoming tasks "))
            : _createCommentVNode("v-if", true)
        ])
      ])
    ]),
    _createCommentVNode(" Task Form Modal "),
    (_ctx.showForm)
      ? (_openBlock(), _createBlock(_component_TaskForm, {
          key: 0,
          categories: _ctx.taskStore.categories,
          onClose: _cache[1] || (_cache[1] = $event => (_ctx.showForm = false)),
          onSubmit: _ctx.handleSubmit
        }, null, 8 /* PROPS */, ["categories", "onSubmit"]))
      : _createCommentVNode("v-if", true)
  ]))
}



// Export default component
export default {
  ...script,
  render
};
