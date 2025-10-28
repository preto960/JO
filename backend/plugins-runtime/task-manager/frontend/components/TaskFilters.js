
import { defineComponent as _defineComponent } from 'vue'
import { ref, watch } from 'vue';
export default /*@__PURE__*/_defineComponent({
  __name: 'TaskFilters',
  props: {
    categories: { type: Array, required: true },
    modelValue: { type: null, required: false }
  },
  emits: ["update:modelValue", "apply"],
  setup(__props: any, { expose: __expose, emit: __emit }) {
  __expose();

const props = __props;

const emit = __emit;

const filters = ref({
  search: '',
  status: '',
  priority: '',
  categoryId: '',
  isArchived: false
});

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    filters.value = { ...newValue };
  }
}, { immediate: true });

const applyFilters = () => {
  const cleanFilters = Object.fromEntries(
    Object.entries(filters.value).filter(([_, value]) => value !== '' && value !== false)
  );
  emit('update:modelValue', cleanFilters);
  emit('apply', cleanFilters);
};

const resetFilters = () => {
  filters.value = {
    search: '',
    status: '',
    priority: '',
    categoryId: '',
    isArchived: false
  };
  applyFilters();
};

const __returned__ = { props, emit, filters, applyFilters, resetFilters }
Object.defineProperty(__returned__, '__isScriptSetup', { enumerable: false, value: true })
return __returned__
}

})

import { createElementVNode as _createElementVNode, createCommentVNode as _createCommentVNode, vModelText as _vModelText, withDirectives as _withDirectives, vModelSelect as _vModelSelect, renderList as _renderList, Fragment as _Fragment, openBlock as _openBlock, createElementBlock as _createElementBlock, toDisplayString as _toDisplayString, vModelCheckbox as _vModelCheckbox, createStaticVNode as _createStaticVNode } from "vue"

const _hoisted_1 = { class: "bg-gray-800 border border-gray-700 rounded-lg p-4 space-y-4" }
const _hoisted_2 = ["value"]
const _hoisted_3 = { class: "flex items-center" }
const _hoisted_4 = { class: "flex space-x-2 pt-4" }

export function render(_ctx, _cache) {
  return (_openBlock(), _createElementBlock("div", _hoisted_1, [
    _cache[15] || (_cache[15] = _createElementVNode("h3", { class: "text-white font-semibold mb-4" }, "Filters", -1 /* CACHED */)),
    _createCommentVNode(" Search "),
    _createElementVNode("div", null, [
      _cache[7] || (_cache[7] = _createElementVNode("label", { class: "block text-sm font-medium text-gray-300 mb-2" }, " Search ", -1 /* CACHED */)),
      _withDirectives(_createElementVNode("input", {
        "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => ((_ctx.filters.search) = $event)),
        type: "text",
        class: "w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500",
        placeholder: "Search tasks..."
      }, null, 512 /* NEED_PATCH */), [
        [_vModelText, _ctx.filters.search]
      ])
    ]),
    _createCommentVNode(" Status "),
    _createElementVNode("div", null, [
      _cache[9] || (_cache[9] = _createElementVNode("label", { class: "block text-sm font-medium text-gray-300 mb-2" }, " Status ", -1 /* CACHED */)),
      _withDirectives(_createElementVNode("select", {
        "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => ((_ctx.filters.status) = $event)),
        class: "w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500"
      }, [...(_cache[8] || (_cache[8] = [
        _createStaticVNode("<option value=\"\">All Statuses</option><option value=\"TODO\">To Do</option><option value=\"IN_PROGRESS\">In Progress</option><option value=\"IN_REVIEW\">In Review</option><option value=\"DONE\">Done</option><option value=\"CANCELLED\">Cancelled</option>", 6)
      ]))], 512 /* NEED_PATCH */), [
        [_vModelSelect, _ctx.filters.status]
      ])
    ]),
    _createCommentVNode(" Priority "),
    _createElementVNode("div", null, [
      _cache[11] || (_cache[11] = _createElementVNode("label", { class: "block text-sm font-medium text-gray-300 mb-2" }, " Priority ", -1 /* CACHED */)),
      _withDirectives(_createElementVNode("select", {
        "onUpdate:modelValue": _cache[2] || (_cache[2] = $event => ((_ctx.filters.priority) = $event)),
        class: "w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500"
      }, [...(_cache[10] || (_cache[10] = [
        _createStaticVNode("<option value=\"\">All Priorities</option><option value=\"URGENT\">Urgent</option><option value=\"HIGH\">High</option><option value=\"MEDIUM\">Medium</option><option value=\"LOW\">Low</option>", 5)
      ]))], 512 /* NEED_PATCH */), [
        [_vModelSelect, _ctx.filters.priority]
      ])
    ]),
    _createCommentVNode(" Category "),
    _createElementVNode("div", null, [
      _cache[13] || (_cache[13] = _createElementVNode("label", { class: "block text-sm font-medium text-gray-300 mb-2" }, " Category ", -1 /* CACHED */)),
      _withDirectives(_createElementVNode("select", {
        "onUpdate:modelValue": _cache[3] || (_cache[3] = $event => ((_ctx.filters.categoryId) = $event)),
        class: "w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500"
      }, [
        _cache[12] || (_cache[12] = _createElementVNode("option", { value: "" }, "All Categories", -1 /* CACHED */)),
        (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(_ctx.categories, (category) => {
          return (_openBlock(), _createElementBlock("option", {
            key: category.id,
            value: category.id
          }, _toDisplayString(category.icon) + " " + _toDisplayString(category.name), 9 /* TEXT, PROPS */, _hoisted_2))
        }), 128 /* KEYED_FRAGMENT */))
      ], 512 /* NEED_PATCH */), [
        [_vModelSelect, _ctx.filters.categoryId]
      ])
    ]),
    _createCommentVNode(" Archived "),
    _createElementVNode("div", _hoisted_3, [
      _withDirectives(_createElementVNode("input", {
        "onUpdate:modelValue": _cache[4] || (_cache[4] = $event => ((_ctx.filters.isArchived) = $event)),
        type: "checkbox",
        id: "archived",
        class: "w-4 h-4 text-primary-600 bg-gray-700 border-gray-600 rounded focus:ring-primary-500"
      }, null, 512 /* NEED_PATCH */), [
        [_vModelCheckbox, _ctx.filters.isArchived]
      ]),
      _cache[14] || (_cache[14] = _createElementVNode("label", {
        for: "archived",
        class: "ml-2 text-sm text-gray-300"
      }, " Show Archived ", -1 /* CACHED */))
    ]),
    _createCommentVNode(" Actions "),
    _createElementVNode("div", _hoisted_4, [
      _createElementVNode("button", {
        onClick: _cache[5] || (_cache[5] = (...args) => (_ctx.applyFilters && _ctx.applyFilters(...args))),
        class: "flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700 transition-colors"
      }, " Apply "),
      _createElementVNode("button", {
        onClick: _cache[6] || (_cache[6] = (...args) => (_ctx.resetFilters && _ctx.resetFilters(...args))),
        class: "px-4 py-2 bg-gray-700 text-white rounded-lg text-sm hover:bg-gray-600 transition-colors"
      }, " Reset ")
    ])
  ]))
}



// Export default component
export default {
  ...script,
  render
};
