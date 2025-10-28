
import { defineComponent as _defineComponent } from 'vue'
import { ref, computed, onMounted } from 'vue'
import { useTaskStore } from '../store/tasks'
import TaskCard from '../components/TaskCard.js'
import TaskForm from '../components/TaskForm.js'


export default /*@__PURE__*/_defineComponent({
  __name: 'TaskList',
  setup(__props, { expose: __expose }) {
  __expose();

const taskStore = useTaskStore()

const showForm = ref(false)
const editingTask = ref<Task | undefined>()
const showDeleteConfirm = ref(false)
const deletingTaskId = ref<string | null>(null)

const statusOptions = [
  { label: 'All', value: 'all' },
  { label: 'To Do', value: 'TODO' },
  { label: 'In Progress', value: 'IN_PROGRESS' },
  { label: 'Done', value: 'DONE' }
]

const filteredTasks = computed(() => taskStore.filteredTasks)

const hasActiveFilters = computed(() => {
  return taskStore.statusFilter !== 'all' ||
         taskStore.priorityFilter !== 'all' ||
         taskStore.categoryFilter !== 'all' ||
         taskStore.searchQuery !== ''
})

const handleToggle = async (id: string) => {
  const task = taskStore.tasks.find(t => t.id === id)
  if (task) {
    await taskStore.toggleTaskStatus(id, task.status !== 'DONE')
  }
}

const handleEdit = (task: Task) => {
  editingTask.value = task
  showForm.value = true
}

const handleDelete = (id: string) => {
  deletingTaskId.value = id
  showDeleteConfirm.value = true
}

const confirmDelete = async () => {
  if (deletingTaskId.value) {
    await taskStore.deleteTask(deletingTaskId.value)
    showDeleteConfirm.value = false
    deletingTaskId.value = null
  }
}

const handleSubmit = async (data: Partial<Task>) => {
  if (editingTask.value) {
    await taskStore.updateTask(editingTask.value.id, data)
  } else {
    await taskStore.createTask(data)
  }
  closeForm()
}

const closeForm = () => {
  showForm.value = false
  editingTask.value = undefined
}

const toggleAll = (event: Event) => {
  const checked = (event.target as HTMLInputElement).checked
  // TODO: Implement bulk toggle
  console.log('Toggle all:', checked)
}

onMounted(async () => {
  await taskStore.fetchCategories()
  await taskStore.fetchTasks()
})

const __returned__ = { taskStore, showForm, editingTask, showDeleteConfirm, deletingTaskId, statusOptions, filteredTasks, hasActiveFilters, handleToggle, handleEdit, handleDelete, confirmDelete, handleSubmit, closeForm, toggleAll, TaskCard, TaskForm }
Object.defineProperty(__returned__, '__isScriptSetup', { enumerable: false, value: true })
return __returned__
}

})

import { createCommentVNode as _createCommentVNode, createElementVNode as _createElementVNode, toDisplayString as _toDisplayString, openBlock as _openBlock, createElementBlock as _createElementBlock, renderList as _renderList, Fragment as _Fragment, normalizeClass as _normalizeClass, vModelSelect as _vModelSelect, withDirectives as _withDirectives, vModelText as _vModelText, resolveComponent as _resolveComponent, createBlock as _createBlock, withModifiers as _withModifiers, createStaticVNode as _createStaticVNode } from "vue"

const _hoisted_1 = { class: "space-y-6" }
const _hoisted_2 = { class: "flex items-center justify-between" }
const _hoisted_3 = { class: "flex items-center space-x-4" }
const _hoisted_4 = { class: "px-3 py-1 bg-gray-700 rounded-full text-sm text-gray-300" }
const _hoisted_5 = { class: "card" }
const _hoisted_6 = { class: "flex flex-wrap items-center gap-4" }
const _hoisted_7 = { class: "flex items-center space-x-2" }
const _hoisted_8 = { class: "flex space-x-1" }
const _hoisted_9 = ["onClick"]
const _hoisted_10 = { class: "flex items-center space-x-2" }
const _hoisted_11 = ["value"]
const _hoisted_12 = { class: "flex items-center space-x-2" }
const _hoisted_13 = { class: "flex-1 min-w-[200px]" }
const _hoisted_14 = {
  key: 0,
  class: "card text-center py-12"
}
const _hoisted_15 = { class: "card bg-red-500/10 border border-red-500/20" }
const _hoisted_16 = { class: "flex items-center space-x-3" }
const _hoisted_17 = { class: "text-red-400" }
const _hoisted_18 = { class: "card overflow-hidden" }
const _hoisted_19 = { class: "overflow-x-auto" }
const _hoisted_20 = { class: "w-full" }
const _hoisted_21 = { class: "bg-gray-800 border-b border-gray-700" }
const _hoisted_22 = { class: "px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-12" }
const _hoisted_23 = { class: "card text-center py-12" }
const _hoisted_24 = { class: "text-gray-400 mb-6" }
const _hoisted_25 = { class: "bg-gray-800 rounded-xl p-6 max-w-md w-full" }
const _hoisted_26 = { class: "flex justify-end space-x-3" }

export function render(_ctx, _cache) {
  const _component_TaskCard = _resolveComponent("TaskCard")
  const _component_TaskForm = _resolveComponent("TaskForm")

  return (_openBlock(), _createElementBlock("div", _hoisted_1, [
    _createCommentVNode(" Header with Actions "),
    _createElementVNode("div", _hoisted_2, [
      _createElementVNode("div", _hoisted_3, [
        _cache[10] || (_cache[10] = _createElementVNode("h3", { class: "text-2xl font-bold text-white" }, "Tasks", -1 /* CACHED */)),
        _createElementVNode("span", _hoisted_4, _toDisplayString(_ctx.filteredTasks.length) + " tasks ", 1 /* TEXT */)
      ]),
      _createElementVNode("button", {
        onClick: _cache[0] || (_cache[0] = $event => (_ctx.showForm = true)),
        class: "flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
      }, [...(_cache[11] || (_cache[11] = [
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
    _createCommentVNode(" Filters "),
    _createElementVNode("div", _hoisted_5, [
      _createElementVNode("div", _hoisted_6, [
        _createCommentVNode(" Status Filter "),
        _createElementVNode("div", _hoisted_7, [
          _cache[12] || (_cache[12] = _createElementVNode("span", { class: "text-sm text-gray-400" }, "Status:", -1 /* CACHED */)),
          _createElementVNode("div", _hoisted_8, [
            (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(_ctx.statusOptions, (status) => {
              return (_openBlock(), _createElementBlock("button", {
                key: status.value,
                onClick: $event => (_ctx.taskStore.setStatusFilter(status.value)),
                class: _normalizeClass(["px-3 py-1.5 rounded-lg text-sm font-medium transition-colors", _ctx.taskStore.statusFilter === status.value
                ? 'bg-primary-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'])
              }, _toDisplayString(status.label), 11 /* TEXT, CLASS, PROPS */, _hoisted_9))
            }), 128 /* KEYED_FRAGMENT */))
          ])
        ]),
        _createCommentVNode(" Category Filter "),
        _createElementVNode("div", _hoisted_10, [
          _cache[14] || (_cache[14] = _createElementVNode("span", { class: "text-sm text-gray-400" }, "Category:", -1 /* CACHED */)),
          _withDirectives(_createElementVNode("select", {
            "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => ((_ctx.taskStore.categoryFilter) = $event)),
            class: "px-3 py-1.5 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          }, [
            _cache[13] || (_cache[13] = _createElementVNode("option", { value: "all" }, "All", -1 /* CACHED */)),
            (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(_ctx.taskStore.categories, (cat) => {
              return (_openBlock(), _createElementBlock("option", {
                key: cat.id,
                value: cat.id
              }, _toDisplayString(cat.name), 9 /* TEXT, PROPS */, _hoisted_11))
            }), 128 /* KEYED_FRAGMENT */))
          ], 512 /* NEED_PATCH */), [
            [_vModelSelect, _ctx.taskStore.categoryFilter]
          ])
        ]),
        _createCommentVNode(" Priority Filter "),
        _createElementVNode("div", _hoisted_12, [
          _cache[16] || (_cache[16] = _createElementVNode("span", { class: "text-sm text-gray-400" }, "Priority:", -1 /* CACHED */)),
          _withDirectives(_createElementVNode("select", {
            "onUpdate:modelValue": _cache[2] || (_cache[2] = $event => ((_ctx.taskStore.priorityFilter) = $event)),
            class: "px-3 py-1.5 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          }, [...(_cache[15] || (_cache[15] = [
            _createStaticVNode("<option value=\"all\">All</option><option value=\"LOW\">Low</option><option value=\"MEDIUM\">Medium</option><option value=\"HIGH\">High</option><option value=\"URGENT\">Urgent</option>", 5)
          ]))], 512 /* NEED_PATCH */), [
            [_vModelSelect, _ctx.taskStore.priorityFilter]
          ])
        ]),
        _createCommentVNode(" Search "),
        _createElementVNode("div", _hoisted_13, [
          _withDirectives(_createElementVNode("input", {
            "onUpdate:modelValue": _cache[3] || (_cache[3] = $event => ((_ctx.taskStore.searchQuery) = $event)),
            type: "text",
            placeholder: "Search tasks...",
            class: "w-full px-4 py-1.5 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          }, null, 512 /* NEED_PATCH */), [
            [_vModelText, _ctx.taskStore.searchQuery]
          ])
        ]),
        _createCommentVNode(" Clear Filters "),
        (_ctx.hasActiveFilters)
          ? (_openBlock(), _createElementBlock("button", {
              key: 0,
              onClick: _cache[4] || (_cache[4] = $event => (_ctx.taskStore.clearFilters())),
              class: "px-3 py-1.5 text-sm text-gray-400 hover:text-white transition-colors"
            }, " Clear filters "))
          : _createCommentVNode("v-if", true)
      ])
    ]),
    _createCommentVNode(" Loading State "),
    (_ctx.taskStore.loading)
      ? (_openBlock(), _createElementBlock("div", _hoisted_14, [...(_cache[17] || (_cache[17] = [
          _createElementVNode("div", { class: "inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mb-4" }, null, -1 /* CACHED */),
          _createElementVNode("p", { class: "text-gray-400" }, "Loading tasks...", -1 /* CACHED */)
        ]))]))
      : (_ctx.taskStore.error)
        ? (_openBlock(), _createElementBlock(_Fragment, { key: 1 }, [
            _createCommentVNode(" Error State "),
            _createElementVNode("div", _hoisted_15, [
              _createElementVNode("div", _hoisted_16, [
                _cache[18] || (_cache[18] = _createElementVNode("svg", {
                  class: "w-6 h-6 text-red-400",
                  fill: "none",
                  stroke: "currentColor",
                  viewBox: "0 0 24 24"
                }, [
                  _createElementVNode("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    "stroke-width": "2",
                    d: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  })
                ], -1 /* CACHED */)),
                _createElementVNode("p", _hoisted_17, _toDisplayString(_ctx.taskStore.error), 1 /* TEXT */)
              ])
            ])
          ], 2112 /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */))
        : (_ctx.filteredTasks.length > 0)
          ? (_openBlock(), _createElementBlock(_Fragment, { key: 2 }, [
              _createCommentVNode(" Tasks Table "),
              _createElementVNode("div", _hoisted_18, [
                _createElementVNode("div", _hoisted_19, [
                  _createElementVNode("table", _hoisted_20, [
                    _createElementVNode("thead", _hoisted_21, [
                      _createElementVNode("tr", null, [
                        _createElementVNode("th", _hoisted_22, [
                          _createElementVNode("input", {
                            type: "checkbox",
                            onChange: _cache[5] || (_cache[5] = (...args) => (_ctx.toggleAll && _ctx.toggleAll(...args))),
                            class: "w-4 h-4 rounded border-gray-600 text-primary-600 focus:ring-primary-500 focus:ring-offset-gray-900"
                          }, null, 32 /* NEED_HYDRATION */)
                        ]),
                        _cache[19] || (_cache[19] = _createElementVNode("th", { class: "px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider" }, " Task ", -1 /* CACHED */)),
                        _cache[20] || (_cache[20] = _createElementVNode("th", { class: "px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider" }, " Category ", -1 /* CACHED */)),
                        _cache[21] || (_cache[21] = _createElementVNode("th", { class: "px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider" }, " Priority ", -1 /* CACHED */)),
                        _cache[22] || (_cache[22] = _createElementVNode("th", { class: "px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider" }, " Status ", -1 /* CACHED */)),
                        _cache[23] || (_cache[23] = _createElementVNode("th", { class: "px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider" }, " Due Date ", -1 /* CACHED */)),
                        _cache[24] || (_cache[24] = _createElementVNode("th", { class: "px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-24" }, " Actions ", -1 /* CACHED */))
                      ])
                    ]),
                    _createElementVNode("tbody", null, [
                      (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(_ctx.filteredTasks, (task) => {
                        return (_openBlock(), _createBlock(_component_TaskCard, {
                          key: task.id,
                          task: task,
                          onToggle: _ctx.handleToggle,
                          onEdit: _ctx.handleEdit,
                          onDelete: _ctx.handleDelete
                        }, null, 8 /* PROPS */, ["task", "onToggle", "onEdit", "onDelete"]))
                      }), 128 /* KEYED_FRAGMENT */))
                    ])
                  ])
                ])
              ])
            ], 2112 /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */))
          : (_openBlock(), _createElementBlock(_Fragment, { key: 3 }, [
              _createCommentVNode(" Empty State "),
              _createElementVNode("div", _hoisted_23, [
                _cache[26] || (_cache[26] = _createElementVNode("svg", {
                  class: "w-16 h-16 text-gray-600 mx-auto mb-4",
                  fill: "none",
                  stroke: "currentColor",
                  viewBox: "0 0 24 24"
                }, [
                  _createElementVNode("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    "stroke-width": "2",
                    d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  })
                ], -1 /* CACHED */)),
                _cache[27] || (_cache[27] = _createElementVNode("h3", { class: "text-xl font-bold text-white mb-2" }, "No tasks found", -1 /* CACHED */)),
                _createElementVNode("p", _hoisted_24, _toDisplayString(_ctx.hasActiveFilters ? 'Try adjusting your filters' : 'Create your first task to get started'), 1 /* TEXT */),
                (!_ctx.hasActiveFilters)
                  ? (_openBlock(), _createElementBlock("button", {
                      key: 0,
                      onClick: _cache[6] || (_cache[6] = $event => (_ctx.showForm = true)),
                      class: "inline-flex items-center space-x-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
                    }, [...(_cache[25] || (_cache[25] = [
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
                      _createElementVNode("span", null, "Create First Task", -1 /* CACHED */)
                    ]))]))
                  : _createCommentVNode("v-if", true)
              ])
            ], 2112 /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */)),
    _createCommentVNode(" Task Form Modal "),
    (_ctx.showForm)
      ? (_openBlock(), _createBlock(_component_TaskForm, {
          key: 4,
          task: _ctx.editingTask,
          categories: _ctx.taskStore.categories,
          onClose: _ctx.closeForm,
          onSubmit: _ctx.handleSubmit
        }, null, 8 /* PROPS */, ["task", "categories", "onClose", "onSubmit"]))
      : _createCommentVNode("v-if", true),
    _createCommentVNode(" Delete Confirmation Modal "),
    (_ctx.showDeleteConfirm)
      ? (_openBlock(), _createElementBlock("div", {
          key: 5,
          class: "fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4",
          onClick: _cache[9] || (_cache[9] = _withModifiers($event => (_ctx.showDeleteConfirm = false), ["self"]))
        }, [
          _createElementVNode("div", _hoisted_25, [
            _cache[28] || (_cache[28] = _createElementVNode("h3", { class: "text-xl font-bold text-white mb-4" }, "Delete Task?", -1 /* CACHED */)),
            _cache[29] || (_cache[29] = _createElementVNode("p", { class: "text-gray-300 mb-6" }, " Are you sure you want to delete this task? This action cannot be undone. ", -1 /* CACHED */)),
            _createElementVNode("div", _hoisted_26, [
              _createElementVNode("button", {
                onClick: _cache[7] || (_cache[7] = $event => (_ctx.showDeleteConfirm = false)),
                class: "px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
              }, " Cancel "),
              _createElementVNode("button", {
                onClick: _cache[8] || (_cache[8] = (...args) => (_ctx.confirmDelete && _ctx.confirmDelete(...args))),
                class: "px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
              }, " Delete ")
            ])
          ])
        ]))
      : _createCommentVNode("v-if", true)
  ]))
}



// Export default component
export default {
  ...script,
  render
};
