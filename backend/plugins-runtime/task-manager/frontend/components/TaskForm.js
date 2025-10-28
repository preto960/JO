
import { defineComponent as _defineComponent } from 'vue'
import { ref, computed, onMounted } from 'vue'
interface Props {
  task?: Task
  categories: TaskCategory[]
}


export default /*@__PURE__*/_defineComponent({
  __name: 'TaskForm',
  props: {
    task: { type: null, required: false },
    categories: { type: Array, required: true }
  },
  emits: ["close", "submit"],
  setup(__props: any, { expose: __expose, emit: __emit }) {
  __expose();

const props = __props

const emit = __emit

const loading = ref(false)
const isEdit = computed(() => !!props.task)

const form = ref({
  title: '',
  description: '',
  status: 'TODO' as Task['status'],
  priority: 'MEDIUM' as Task['priority'],
  categoryId: '',
  dueDate: '',
  estimatedHours: 0
})

onMounted(() => {
  if (props.task) {
    form.value = {
      title: props.task.title,
      description: props.task.description || '',
      status: props.task.status,
      priority: props.task.priority,
      categoryId: props.task.categoryId || '',
      dueDate: props.task.dueDate ? props.task.dueDate.split('T')[0] : '',
      estimatedHours: props.task.estimatedHours
    }
  }
})

const handleSubmit = () => {
  loading.value = true
  
  const data: Partial<Task> = {
    title: form.value.title,
    description: form.value.description || undefined,
    status: form.value.status,
    priority: form.value.priority,
    categoryId: form.value.categoryId || undefined,
    dueDate: form.value.dueDate || undefined,
    estimatedHours: form.value.estimatedHours
  }

  emit('submit', data)
}

const __returned__ = { props, emit, loading, isEdit, form, handleSubmit }
Object.defineProperty(__returned__, '__isScriptSetup', { enumerable: false, value: true })
return __returned__
}

})

import { createCommentVNode as _createCommentVNode, toDisplayString as _toDisplayString, createElementVNode as _createElementVNode, openBlock as _openBlock, createElementBlock as _createElementBlock, createTextVNode as _createTextVNode, vModelText as _vModelText, withDirectives as _withDirectives, renderList as _renderList, Fragment as _Fragment, vModelSelect as _vModelSelect, withModifiers as _withModifiers } from "vue"

const _hoisted_1 = { class: "bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" }
const _hoisted_2 = { class: "flex items-center justify-between p-6 border-b border-gray-700" }
const _hoisted_3 = { class: "text-xl font-bold text-white" }
const _hoisted_4 = { class: "grid grid-cols-2 gap-4" }
const _hoisted_5 = ["value"]
const _hoisted_6 = { class: "grid grid-cols-2 gap-4" }
const _hoisted_7 = { class: "flex justify-end space-x-3 pt-4" }
const _hoisted_8 = ["disabled"]

export function render(_ctx, _cache) {
  return (_openBlock(), _createElementBlock("div", {
    class: "fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4",
    onClick: _cache[10] || (_cache[10] = _withModifiers($event => (_ctx.$emit('close')), ["self"]))
  }, [
    _createElementVNode("div", _hoisted_1, [
      _createCommentVNode(" Header "),
      _createElementVNode("div", _hoisted_2, [
        _createElementVNode("h3", _hoisted_3, _toDisplayString(_ctx.isEdit ? 'Edit Task' : 'New Task'), 1 /* TEXT */),
        _createElementVNode("button", {
          onClick: _cache[0] || (_cache[0] = $event => (_ctx.$emit('close'))),
          class: "text-gray-400 hover:text-white"
        }, [...(_cache[11] || (_cache[11] = [
          _createElementVNode("svg", {
            class: "w-6 h-6",
            fill: "none",
            stroke: "currentColor",
            viewBox: "0 0 24 24"
          }, [
            _createElementVNode("path", {
              "stroke-linecap": "round",
              "stroke-linejoin": "round",
              "stroke-width": "2",
              d: "M6 18L18 6M6 6l12 12"
            })
          ], -1 /* CACHED */)
        ]))])
      ]),
      _createCommentVNode(" Form "),
      _createElementVNode("form", {
        onSubmit: _cache[9] || (_cache[9] = _withModifiers((...args) => (_ctx.handleSubmit && _ctx.handleSubmit(...args)), ["prevent"])),
        class: "p-6 space-y-4"
      }, [
        _createCommentVNode(" Title "),
        _createElementVNode("div", null, [
          _cache[12] || (_cache[12] = _createElementVNode("label", { class: "block text-sm font-medium text-gray-300 mb-2" }, [
            _createTextVNode(" Title "),
            _createElementVNode("span", { class: "text-red-400" }, "*")
          ], -1 /* CACHED */)),
          _withDirectives(_createElementVNode("input", {
            "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => ((_ctx.form.title) = $event)),
            type: "text",
            required: "",
            class: "w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
            placeholder: "Enter task title..."
          }, null, 512 /* NEED_PATCH */), [
            [_vModelText, _ctx.form.title]
          ])
        ]),
        _createCommentVNode(" Description "),
        _createElementVNode("div", null, [
          _cache[13] || (_cache[13] = _createElementVNode("label", { class: "block text-sm font-medium text-gray-300 mb-2" }, " Description ", -1 /* CACHED */)),
          _withDirectives(_createElementVNode("textarea", {
            "onUpdate:modelValue": _cache[2] || (_cache[2] = $event => ((_ctx.form.description) = $event)),
            rows: "3",
            class: "w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none",
            placeholder: "Add a description..."
          }, null, 512 /* NEED_PATCH */), [
            [_vModelText, _ctx.form.description]
          ])
        ]),
        _createCommentVNode(" Category & Priority "),
        _createElementVNode("div", _hoisted_4, [
          _createElementVNode("div", null, [
            _cache[15] || (_cache[15] = _createElementVNode("label", { class: "block text-sm font-medium text-gray-300 mb-2" }, " Category ", -1 /* CACHED */)),
            _withDirectives(_createElementVNode("select", {
              "onUpdate:modelValue": _cache[3] || (_cache[3] = $event => ((_ctx.form.categoryId) = $event)),
              class: "w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            }, [
              _cache[14] || (_cache[14] = _createElementVNode("option", { value: "" }, "No category", -1 /* CACHED */)),
              (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(_ctx.categories, (cat) => {
                return (_openBlock(), _createElementBlock("option", {
                  key: cat.id,
                  value: cat.id
                }, _toDisplayString(cat.name), 9 /* TEXT, PROPS */, _hoisted_5))
              }), 128 /* KEYED_FRAGMENT */))
            ], 512 /* NEED_PATCH */), [
              [_vModelSelect, _ctx.form.categoryId]
            ])
          ]),
          _createElementVNode("div", null, [
            _cache[17] || (_cache[17] = _createElementVNode("label", { class: "block text-sm font-medium text-gray-300 mb-2" }, " Priority ", -1 /* CACHED */)),
            _withDirectives(_createElementVNode("select", {
              "onUpdate:modelValue": _cache[4] || (_cache[4] = $event => ((_ctx.form.priority) = $event)),
              class: "w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            }, [...(_cache[16] || (_cache[16] = [
              _createElementVNode("option", { value: "LOW" }, "Low", -1 /* CACHED */),
              _createElementVNode("option", { value: "MEDIUM" }, "Medium", -1 /* CACHED */),
              _createElementVNode("option", { value: "HIGH" }, "High", -1 /* CACHED */),
              _createElementVNode("option", { value: "URGENT" }, "Urgent", -1 /* CACHED */)
            ]))], 512 /* NEED_PATCH */), [
              [_vModelSelect, _ctx.form.priority]
            ])
          ])
        ]),
        _createCommentVNode(" Status & Due Date "),
        _createElementVNode("div", _hoisted_6, [
          _createElementVNode("div", null, [
            _cache[19] || (_cache[19] = _createElementVNode("label", { class: "block text-sm font-medium text-gray-300 mb-2" }, " Status ", -1 /* CACHED */)),
            _withDirectives(_createElementVNode("select", {
              "onUpdate:modelValue": _cache[5] || (_cache[5] = $event => ((_ctx.form.status) = $event)),
              class: "w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            }, [...(_cache[18] || (_cache[18] = [
              _createElementVNode("option", { value: "TODO" }, "To Do", -1 /* CACHED */),
              _createElementVNode("option", { value: "IN_PROGRESS" }, "In Progress", -1 /* CACHED */),
              _createElementVNode("option", { value: "IN_REVIEW" }, "In Review", -1 /* CACHED */),
              _createElementVNode("option", { value: "DONE" }, "Done", -1 /* CACHED */)
            ]))], 512 /* NEED_PATCH */), [
              [_vModelSelect, _ctx.form.status]
            ])
          ]),
          _createElementVNode("div", null, [
            _cache[20] || (_cache[20] = _createElementVNode("label", { class: "block text-sm font-medium text-gray-300 mb-2" }, " Due Date ", -1 /* CACHED */)),
            _withDirectives(_createElementVNode("input", {
              "onUpdate:modelValue": _cache[6] || (_cache[6] = $event => ((_ctx.form.dueDate) = $event)),
              type: "date",
              class: "w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            }, null, 512 /* NEED_PATCH */), [
              [_vModelText, _ctx.form.dueDate]
            ])
          ])
        ]),
        _createCommentVNode(" Estimated Hours "),
        _createElementVNode("div", null, [
          _cache[21] || (_cache[21] = _createElementVNode("label", { class: "block text-sm font-medium text-gray-300 mb-2" }, " Estimated Hours ", -1 /* CACHED */)),
          _withDirectives(_createElementVNode("input", {
            "onUpdate:modelValue": _cache[7] || (_cache[7] = $event => ((_ctx.form.estimatedHours) = $event)),
            type: "number",
            min: "0",
            step: "0.5",
            class: "w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          }, null, 512 /* NEED_PATCH */), [
            [
              _vModelText,
              _ctx.form.estimatedHours,
              void 0,
              { number: true }
            ]
          ])
        ]),
        _createCommentVNode(" Actions "),
        _createElementVNode("div", _hoisted_7, [
          _createElementVNode("button", {
            type: "button",
            onClick: _cache[8] || (_cache[8] = $event => (_ctx.$emit('close'))),
            class: "px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          }, " Cancel "),
          _createElementVNode("button", {
            type: "submit",
            disabled: _ctx.loading,
            class: "px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          }, _toDisplayString(_ctx.loading ? 'Saving...' : (_ctx.isEdit ? 'Update Task' : 'Create Task')), 9 /* TEXT, PROPS */, _hoisted_8)
        ])
      ], 32 /* NEED_HYDRATION */)
    ])
  ]))
}



// Export default component
export default {
  ...script,
  render
};
