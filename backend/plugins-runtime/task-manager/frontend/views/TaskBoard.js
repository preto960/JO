
import { defineComponent as _defineComponent } from 'vue'
import { ref, onMounted } from 'vue'
import { useTaskStore } from '../store/tasks'
import TaskForm from '../components/TaskForm.js'


export default /*@__PURE__*/_defineComponent({
  __name: 'TaskBoard',
  setup(__props, { expose: __expose }) {
  __expose();

const taskStore = useTaskStore()
const showForm = ref(false)

const formatDate = (date: string) => {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const handleSubmit = async (data: Partial<Task>) => {
  await taskStore.createTask(data)
  showForm.value = false
}

onMounted(async () => {
  await taskStore.fetchCategories()
  await taskStore.fetchTasks()
})

const __returned__ = { taskStore, showForm, formatDate, handleSubmit, TaskForm }
Object.defineProperty(__returned__, '__isScriptSetup', { enumerable: false, value: true })
return __returned__
}

})

import { createElementVNode as _createElementVNode, openBlock as _openBlock, createElementBlock as _createElementBlock, createCommentVNode as _createCommentVNode, toDisplayString as _toDisplayString, renderList as _renderList, Fragment as _Fragment, normalizeStyle as _normalizeStyle, resolveComponent as _resolveComponent, createBlock as _createBlock } from "vue"

const _hoisted_1 = { class: "space-y-6" }
const _hoisted_2 = { class: "flex items-center justify-between" }
const _hoisted_3 = { class: "grid grid-cols-1 md:grid-cols-4 gap-4" }
const _hoisted_4 = { class: "card" }
const _hoisted_5 = { class: "flex items-center justify-between mb-4" }
const _hoisted_6 = { class: "px-2 py-1 bg-gray-700 rounded text-xs text-gray-300" }
const _hoisted_7 = { class: "space-y-3" }
const _hoisted_8 = { class: "font-medium text-white mb-1" }
const _hoisted_9 = {
  key: 0,
  class: "text-sm text-gray-400 mb-2 line-clamp-2"
}
const _hoisted_10 = { class: "flex items-center justify-between" }
const _hoisted_11 = { class: "text-xs text-gray-500" }
const _hoisted_12 = {
  key: 0,
  class: "text-center py-8 text-gray-500 text-sm"
}
const _hoisted_13 = { class: "card" }
const _hoisted_14 = { class: "flex items-center justify-between mb-4" }
const _hoisted_15 = { class: "px-2 py-1 bg-gray-700 rounded text-xs text-gray-300" }
const _hoisted_16 = { class: "space-y-3" }
const _hoisted_17 = { class: "font-medium text-white mb-1" }
const _hoisted_18 = {
  key: 0,
  class: "text-sm text-gray-400 mb-2 line-clamp-2"
}
const _hoisted_19 = { class: "flex items-center justify-between" }
const _hoisted_20 = { class: "text-xs text-gray-500" }
const _hoisted_21 = {
  key: 0,
  class: "text-center py-8 text-gray-500 text-sm"
}
const _hoisted_22 = { class: "card" }
const _hoisted_23 = { class: "flex items-center justify-between mb-4" }
const _hoisted_24 = { class: "px-2 py-1 bg-gray-700 rounded text-xs text-gray-300" }
const _hoisted_25 = { class: "space-y-3" }
const _hoisted_26 = { class: "font-medium text-white mb-1" }
const _hoisted_27 = {
  key: 0,
  class: "text-sm text-gray-400 mb-2 line-clamp-2"
}
const _hoisted_28 = { class: "flex items-center justify-between" }
const _hoisted_29 = { class: "text-xs text-gray-500" }
const _hoisted_30 = {
  key: 0,
  class: "text-center py-8 text-gray-500 text-sm"
}
const _hoisted_31 = { class: "card" }
const _hoisted_32 = { class: "flex items-center justify-between mb-4" }
const _hoisted_33 = { class: "px-2 py-1 bg-gray-700 rounded text-xs text-gray-300" }
const _hoisted_34 = { class: "space-y-3" }
const _hoisted_35 = { class: "font-medium text-white mb-1 line-through" }
const _hoisted_36 = {
  key: 0,
  class: "text-sm text-gray-400 mb-2 line-clamp-2"
}
const _hoisted_37 = { class: "flex items-center justify-between" }
const _hoisted_38 = { class: "text-xs text-gray-500" }
const _hoisted_39 = {
  key: 0,
  class: "text-center py-8 text-gray-500 text-sm"
}

export function render(_ctx, _cache) {
  const _component_TaskForm = _resolveComponent("TaskForm")

  return (_openBlock(), _createElementBlock("div", _hoisted_1, [
    _createElementVNode("div", _hoisted_2, [
      _cache[3] || (_cache[3] = _createElementVNode("h3", { class: "text-2xl font-bold text-white" }, "Task Board", -1 /* CACHED */)),
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
    _createCommentVNode(" Kanban Board "),
    _createElementVNode("div", _hoisted_3, [
      _createCommentVNode(" TODO Column "),
      _createElementVNode("div", _hoisted_4, [
        _createElementVNode("div", _hoisted_5, [
          _cache[4] || (_cache[4] = _createElementVNode("h4", { class: "font-semibold text-white" }, "To Do", -1 /* CACHED */)),
          _createElementVNode("span", _hoisted_6, _toDisplayString(_ctx.taskStore.tasksByStatus.TODO.length), 1 /* TEXT */)
        ]),
        _createElementVNode("div", _hoisted_7, [
          (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(_ctx.taskStore.tasksByStatus.TODO, (task) => {
            return (_openBlock(), _createElementBlock("div", {
              key: task.id,
              class: "p-3 bg-gray-800 rounded-lg border border-gray-700 hover:border-primary-500 transition-colors cursor-pointer"
            }, [
              _createElementVNode("h5", _hoisted_8, _toDisplayString(task.title), 1 /* TEXT */),
              (task.description)
                ? (_openBlock(), _createElementBlock("p", _hoisted_9, _toDisplayString(task.description), 1 /* TEXT */))
                : _createCommentVNode("v-if", true),
              _createElementVNode("div", _hoisted_10, [
                (task.categoryName)
                  ? (_openBlock(), _createElementBlock("span", {
                      key: 0,
                      class: "text-xs px-2 py-0.5 rounded",
                      style: _normalizeStyle({ backgroundColor: task.categoryColor + '20', color: task.categoryColor })
                    }, _toDisplayString(task.categoryName), 5 /* TEXT, STYLE */))
                  : _createCommentVNode("v-if", true),
                _createElementVNode("span", _hoisted_11, _toDisplayString(task.dueDate ? _ctx.formatDate(task.dueDate) : ''), 1 /* TEXT */)
              ])
            ]))
          }), 128 /* KEYED_FRAGMENT */)),
          (_ctx.taskStore.tasksByStatus.TODO.length === 0)
            ? (_openBlock(), _createElementBlock("div", _hoisted_12, " No tasks "))
            : _createCommentVNode("v-if", true)
        ])
      ]),
      _createCommentVNode(" IN PROGRESS Column "),
      _createElementVNode("div", _hoisted_13, [
        _createElementVNode("div", _hoisted_14, [
          _cache[5] || (_cache[5] = _createElementVNode("h4", { class: "font-semibold text-white" }, "In Progress", -1 /* CACHED */)),
          _createElementVNode("span", _hoisted_15, _toDisplayString(_ctx.taskStore.tasksByStatus.IN_PROGRESS.length), 1 /* TEXT */)
        ]),
        _createElementVNode("div", _hoisted_16, [
          (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(_ctx.taskStore.tasksByStatus.IN_PROGRESS, (task) => {
            return (_openBlock(), _createElementBlock("div", {
              key: task.id,
              class: "p-3 bg-gray-800 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors cursor-pointer"
            }, [
              _createElementVNode("h5", _hoisted_17, _toDisplayString(task.title), 1 /* TEXT */),
              (task.description)
                ? (_openBlock(), _createElementBlock("p", _hoisted_18, _toDisplayString(task.description), 1 /* TEXT */))
                : _createCommentVNode("v-if", true),
              _createElementVNode("div", _hoisted_19, [
                (task.categoryName)
                  ? (_openBlock(), _createElementBlock("span", {
                      key: 0,
                      class: "text-xs px-2 py-0.5 rounded",
                      style: _normalizeStyle({ backgroundColor: task.categoryColor + '20', color: task.categoryColor })
                    }, _toDisplayString(task.categoryName), 5 /* TEXT, STYLE */))
                  : _createCommentVNode("v-if", true),
                _createElementVNode("span", _hoisted_20, _toDisplayString(task.dueDate ? _ctx.formatDate(task.dueDate) : ''), 1 /* TEXT */)
              ])
            ]))
          }), 128 /* KEYED_FRAGMENT */)),
          (_ctx.taskStore.tasksByStatus.IN_PROGRESS.length === 0)
            ? (_openBlock(), _createElementBlock("div", _hoisted_21, " No tasks "))
            : _createCommentVNode("v-if", true)
        ])
      ]),
      _createCommentVNode(" IN REVIEW Column "),
      _createElementVNode("div", _hoisted_22, [
        _createElementVNode("div", _hoisted_23, [
          _cache[6] || (_cache[6] = _createElementVNode("h4", { class: "font-semibold text-white" }, "In Review", -1 /* CACHED */)),
          _createElementVNode("span", _hoisted_24, _toDisplayString(_ctx.taskStore.tasksByStatus.IN_REVIEW.length), 1 /* TEXT */)
        ]),
        _createElementVNode("div", _hoisted_25, [
          (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(_ctx.taskStore.tasksByStatus.IN_REVIEW, (task) => {
            return (_openBlock(), _createElementBlock("div", {
              key: task.id,
              class: "p-3 bg-gray-800 rounded-lg border border-gray-700 hover:border-purple-500 transition-colors cursor-pointer"
            }, [
              _createElementVNode("h5", _hoisted_26, _toDisplayString(task.title), 1 /* TEXT */),
              (task.description)
                ? (_openBlock(), _createElementBlock("p", _hoisted_27, _toDisplayString(task.description), 1 /* TEXT */))
                : _createCommentVNode("v-if", true),
              _createElementVNode("div", _hoisted_28, [
                (task.categoryName)
                  ? (_openBlock(), _createElementBlock("span", {
                      key: 0,
                      class: "text-xs px-2 py-0.5 rounded",
                      style: _normalizeStyle({ backgroundColor: task.categoryColor + '20', color: task.categoryColor })
                    }, _toDisplayString(task.categoryName), 5 /* TEXT, STYLE */))
                  : _createCommentVNode("v-if", true),
                _createElementVNode("span", _hoisted_29, _toDisplayString(task.dueDate ? _ctx.formatDate(task.dueDate) : ''), 1 /* TEXT */)
              ])
            ]))
          }), 128 /* KEYED_FRAGMENT */)),
          (_ctx.taskStore.tasksByStatus.IN_REVIEW.length === 0)
            ? (_openBlock(), _createElementBlock("div", _hoisted_30, " No tasks "))
            : _createCommentVNode("v-if", true)
        ])
      ]),
      _createCommentVNode(" DONE Column "),
      _createElementVNode("div", _hoisted_31, [
        _createElementVNode("div", _hoisted_32, [
          _cache[7] || (_cache[7] = _createElementVNode("h4", { class: "font-semibold text-white" }, "Done", -1 /* CACHED */)),
          _createElementVNode("span", _hoisted_33, _toDisplayString(_ctx.taskStore.tasksByStatus.DONE.length), 1 /* TEXT */)
        ]),
        _createElementVNode("div", _hoisted_34, [
          (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(_ctx.taskStore.tasksByStatus.DONE, (task) => {
            return (_openBlock(), _createElementBlock("div", {
              key: task.id,
              class: "p-3 bg-gray-800 rounded-lg border border-gray-700 hover:border-green-500 transition-colors cursor-pointer opacity-75"
            }, [
              _createElementVNode("h5", _hoisted_35, _toDisplayString(task.title), 1 /* TEXT */),
              (task.description)
                ? (_openBlock(), _createElementBlock("p", _hoisted_36, _toDisplayString(task.description), 1 /* TEXT */))
                : _createCommentVNode("v-if", true),
              _createElementVNode("div", _hoisted_37, [
                (task.categoryName)
                  ? (_openBlock(), _createElementBlock("span", {
                      key: 0,
                      class: "text-xs px-2 py-0.5 rounded",
                      style: _normalizeStyle({ backgroundColor: task.categoryColor + '20', color: task.categoryColor })
                    }, _toDisplayString(task.categoryName), 5 /* TEXT, STYLE */))
                  : _createCommentVNode("v-if", true),
                _createElementVNode("span", _hoisted_38, _toDisplayString(task.completedAt ? _ctx.formatDate(task.completedAt) : ''), 1 /* TEXT */)
              ])
            ]))
          }), 128 /* KEYED_FRAGMENT */)),
          (_ctx.taskStore.tasksByStatus.DONE.length === 0)
            ? (_openBlock(), _createElementBlock("div", _hoisted_39, " No tasks "))
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
