
import { defineComponent as _defineComponent } from 'vue'
import { computed } from 'vue'
interface Props {
  task: Task
}


export default /*@__PURE__*/_defineComponent({
  __name: 'TaskCard',
  props: {
    task: { type: null, required: true }
  },
  emits: ["toggle", "edit", "delete"],
  setup(__props: any, { expose: __expose }) {
  __expose();

const props = __props



const priorityClass = computed(() => {
  const classes = {
    LOW: 'bg-blue-500/20 text-blue-400',
    MEDIUM: 'bg-yellow-500/20 text-yellow-400',
    HIGH: 'bg-orange-500/20 text-orange-400',
    URGENT: 'bg-red-500/20 text-red-400'
  }
  return classes[props.task.priority] || classes.MEDIUM
})

const statusClass = computed(() => {
  const classes = {
    TODO: 'bg-gray-500/20 text-gray-400',
    IN_PROGRESS: 'bg-blue-500/20 text-blue-400',
    IN_REVIEW: 'bg-purple-500/20 text-purple-400',
    DONE: 'bg-green-500/20 text-green-400',
    CANCELLED: 'bg-red-500/20 text-red-400'
  }
  return classes[props.task.status] || classes.TODO
})

const formatStatus = (status: string) => {
  return status.replace('_', ' ')
}

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
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }
}

const __returned__ = { props, priorityClass, statusClass, formatStatus, formatDate }
Object.defineProperty(__returned__, '__isScriptSetup', { enumerable: false, value: true })
return __returned__
}

})

import { createCommentVNode as _createCommentVNode, createElementVNode as _createElementVNode, toDisplayString as _toDisplayString, normalizeClass as _normalizeClass, openBlock as _openBlock, createElementBlock as _createElementBlock, normalizeStyle as _normalizeStyle } from "vue"

const _hoisted_1 = { class: "border-b border-gray-700 hover:bg-gray-800/50 transition-colors" }
const _hoisted_2 = { class: "px-4 py-3" }
const _hoisted_3 = ["checked"]
const _hoisted_4 = { class: "px-4 py-3" }
const _hoisted_5 = {
  key: 0,
  class: "text-sm text-gray-400 mt-1 line-clamp-1"
}
const _hoisted_6 = { class: "px-4 py-3" }
const _hoisted_7 = { class: "px-4 py-3" }
const _hoisted_8 = { class: "px-4 py-3" }
const _hoisted_9 = { class: "px-4 py-3 text-sm text-gray-400" }
const _hoisted_10 = { class: "px-4 py-3" }
const _hoisted_11 = { class: "flex items-center space-x-2" }

export function render(_ctx, _cache) {
  return (_openBlock(), _createElementBlock("tr", _hoisted_1, [
    _createCommentVNode(" Checkbox "),
    _createElementVNode("td", _hoisted_2, [
      _createElementVNode("input", {
        type: "checkbox",
        checked: _ctx.task.status === 'DONE',
        onChange: _cache[0] || (_cache[0] = $event => (_ctx.$emit('toggle', _ctx.task.id))),
        class: "w-4 h-4 rounded border-gray-600 text-primary-600 focus:ring-primary-500 focus:ring-offset-gray-900"
      }, null, 40 /* PROPS, NEED_HYDRATION */, _hoisted_3)
    ]),
    _createCommentVNode(" Title & Description "),
    _createElementVNode("td", _hoisted_4, [
      _createElementVNode("div", null, [
        _createElementVNode("p", {
          class: _normalizeClass(["font-medium", _ctx.task.status === 'DONE' ? 'line-through text-gray-500' : 'text-white'])
        }, _toDisplayString(_ctx.task.title), 3 /* TEXT, CLASS */),
        (_ctx.task.description)
          ? (_openBlock(), _createElementBlock("p", _hoisted_5, _toDisplayString(_ctx.task.description), 1 /* TEXT */))
          : _createCommentVNode("v-if", true)
      ])
    ]),
    _createCommentVNode(" Category "),
    _createElementVNode("td", _hoisted_6, [
      (_ctx.task.categoryName)
        ? (_openBlock(), _createElementBlock("span", {
            key: 0,
            class: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
            style: _normalizeStyle({ 
          backgroundColor: _ctx.task.categoryColor + '20',
          color: _ctx.task.categoryColor 
        })
          }, _toDisplayString(_ctx.task.categoryName), 5 /* TEXT, STYLE */))
        : _createCommentVNode("v-if", true)
    ]),
    _createCommentVNode(" Priority "),
    _createElementVNode("td", _hoisted_7, [
      _createElementVNode("span", {
        class: _normalizeClass(["inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", _ctx.priorityClass])
      }, _toDisplayString(_ctx.task.priority), 3 /* TEXT, CLASS */)
    ]),
    _createCommentVNode(" Status "),
    _createElementVNode("td", _hoisted_8, [
      _createElementVNode("span", {
        class: _normalizeClass(["inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", _ctx.statusClass])
      }, _toDisplayString(_ctx.formatStatus(_ctx.task.status)), 3 /* TEXT, CLASS */)
    ]),
    _createCommentVNode(" Due Date "),
    _createElementVNode("td", _hoisted_9, _toDisplayString(_ctx.task.dueDate ? _ctx.formatDate(_ctx.task.dueDate) : '-'), 1 /* TEXT */),
    _createCommentVNode(" Actions "),
    _createElementVNode("td", _hoisted_10, [
      _createElementVNode("div", _hoisted_11, [
        _createElementVNode("button", {
          onClick: _cache[1] || (_cache[1] = $event => (_ctx.$emit('edit', _ctx.task))),
          class: "p-1.5 text-gray-400 hover:text-primary-400 hover:bg-gray-700 rounded transition-colors",
          title: "Edit"
        }, [...(_cache[3] || (_cache[3] = [
          _createElementVNode("svg", {
            class: "w-4 h-4",
            fill: "none",
            stroke: "currentColor",
            viewBox: "0 0 24 24"
          }, [
            _createElementVNode("path", {
              "stroke-linecap": "round",
              "stroke-linejoin": "round",
              "stroke-width": "2",
              d: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            })
          ], -1 /* CACHED */)
        ]))]),
        _createElementVNode("button", {
          onClick: _cache[2] || (_cache[2] = $event => (_ctx.$emit('delete', _ctx.task.id))),
          class: "p-1.5 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded transition-colors",
          title: "Delete"
        }, [...(_cache[4] || (_cache[4] = [
          _createElementVNode("svg", {
            class: "w-4 h-4",
            fill: "none",
            stroke: "currentColor",
            viewBox: "0 0 24 24"
          }, [
            _createElementVNode("path", {
              "stroke-linecap": "round",
              "stroke-linejoin": "round",
              "stroke-width": "2",
              d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            })
          ], -1 /* CACHED */)
        ]))])
      ])
    ])
  ]))
}



// Export default component
export default {
  ...script,
  render
};
