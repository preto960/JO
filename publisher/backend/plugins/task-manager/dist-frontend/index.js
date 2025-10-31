var task_manager = (function(pinia, vue, axios2) {
  "use strict";
  const useTaskStore = pinia.defineStore("tasks", () => {
    const tasks = vue.ref([]);
    const categories = vue.ref([]);
    const loading = vue.ref(false);
    const error = vue.ref(null);
    const statusFilter = vue.ref("all");
    const priorityFilter = vue.ref("all");
    const categoryFilter = vue.ref("all");
    const searchQuery = vue.ref("");
    const filteredTasks = vue.computed(() => {
      let filtered = tasks.value.filter((t) => !t.isArchived);
      if (statusFilter.value !== "all") {
        filtered = filtered.filter((t) => t.status === statusFilter.value);
      }
      if (priorityFilter.value !== "all") {
        filtered = filtered.filter((t) => t.priority === priorityFilter.value);
      }
      if (categoryFilter.value !== "all") {
        filtered = filtered.filter((t) => t.categoryId === categoryFilter.value);
      }
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter(
          (t) => t.title.toLowerCase().includes(query) || t.description?.toLowerCase().includes(query)
        );
      }
      return filtered;
    });
    const tasksByStatus = vue.computed(() => {
      return {
        TODO: tasks.value.filter((t) => t.status === "TODO" && !t.isArchived),
        IN_PROGRESS: tasks.value.filter((t) => t.status === "IN_PROGRESS" && !t.isArchived),
        IN_REVIEW: tasks.value.filter((t) => t.status === "IN_REVIEW" && !t.isArchived),
        DONE: tasks.value.filter((t) => t.status === "DONE" && !t.isArchived)
      };
    });
    async function fetchTasks() {
      loading.value = true;
      error.value = null;
      try {
        const response = await axios2.get("/api/plugin-api/task-manager/tasks");
        tasks.value = response.data;
      } catch (err) {
        error.value = err.response?.data?.message || "Failed to fetch tasks";
        console.error("Error fetching tasks:", err);
      } finally {
        loading.value = false;
      }
    }
    async function fetchCategories() {
      try {
        const response = await axios2.get("/api/plugin-api/task-manager/categories");
        categories.value = response.data;
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    }
    async function createTask(taskData) {
      loading.value = true;
      error.value = null;
      try {
        const response = await axios2.post("/api/plugin-api/task-manager/tasks", taskData);
        tasks.value.push(response.data);
        return { success: true, task: response.data };
      } catch (err) {
        error.value = err.response?.data?.message || "Failed to create task";
        return { success: false, error: error.value };
      } finally {
        loading.value = false;
      }
    }
    async function updateTask(id, updates) {
      loading.value = true;
      error.value = null;
      try {
        const response = await axios2.patch(`/api/plugin-api/task-manager/tasks/${id}`, updates);
        const index2 = tasks.value.findIndex((t) => t.id === id);
        if (index2 !== -1) {
          tasks.value[index2] = response.data;
        }
        return { success: true, task: response.data };
      } catch (err) {
        error.value = err.response?.data?.message || "Failed to update task";
        return { success: false, error: error.value };
      } finally {
        loading.value = false;
      }
    }
    async function deleteTask(id) {
      loading.value = true;
      error.value = null;
      try {
        await axios2.delete(`/api/plugin-api/task-manager/tasks/${id}`);
        tasks.value = tasks.value.filter((t) => t.id !== id);
        return { success: true };
      } catch (err) {
        error.value = err.response?.data?.message || "Failed to delete task";
        return { success: false, error: error.value };
      } finally {
        loading.value = false;
      }
    }
    async function toggleTaskStatus(id, completed) {
      const status = completed ? "DONE" : "TODO";
      const completedAt = completed ? (/* @__PURE__ */ new Date()).toISOString() : null;
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
      statusFilter.value = "all";
      priorityFilter.value = "all";
      categoryFilter.value = "all";
      searchQuery.value = "";
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
  const _hoisted_1$5 = { class: "border-b border-gray-700 hover:bg-gray-800/50 transition-colors" };
  const _hoisted_2$5 = { class: "px-4 py-3" };
  const _hoisted_3$5 = ["checked"];
  const _hoisted_4$4 = { class: "px-4 py-3" };
  const _hoisted_5$4 = {
    key: 0,
    class: "text-sm text-gray-400 mt-1 line-clamp-1"
  };
  const _hoisted_6$4 = { class: "px-4 py-3" };
  const _hoisted_7$4 = { class: "px-4 py-3" };
  const _hoisted_8$4 = { class: "px-4 py-3" };
  const _hoisted_9$3 = { class: "px-4 py-3 text-sm text-gray-400" };
  const _hoisted_10$3 = { class: "px-4 py-3" };
  const _hoisted_11$3 = { class: "flex items-center space-x-2" };
  const _sfc_main$5 = /* @__PURE__ */ vue.defineComponent({
    __name: "TaskCard",
    props: {
      task: {}
    },
    emits: ["toggle", "edit", "delete"],
    setup(__props) {
      const props = __props;
      const priorityClass = vue.computed(() => {
        const classes = {
          LOW: "bg-blue-500/20 text-blue-400",
          MEDIUM: "bg-yellow-500/20 text-yellow-400",
          HIGH: "bg-orange-500/20 text-orange-400",
          URGENT: "bg-red-500/20 text-red-400"
        };
        return classes[props.task.priority] || classes.MEDIUM;
      });
      const statusClass = vue.computed(() => {
        const classes = {
          TODO: "bg-gray-500/20 text-gray-400",
          IN_PROGRESS: "bg-blue-500/20 text-blue-400",
          IN_REVIEW: "bg-purple-500/20 text-purple-400",
          DONE: "bg-green-500/20 text-green-400",
          CANCELLED: "bg-red-500/20 text-red-400"
        };
        return classes[props.task.status] || classes.TODO;
      });
      const formatStatus = (status) => {
        return status.replace("_", " ");
      };
      const formatDate = (date) => {
        const d = new Date(date);
        const today = /* @__PURE__ */ new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        if (d.toDateString() === today.toDateString()) {
          return "Today";
        } else if (d.toDateString() === tomorrow.toDateString()) {
          return "Tomorrow";
        } else {
          return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        }
      };
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("tr", _hoisted_1$5, [
          vue.createElementVNode("td", _hoisted_2$5, [
            vue.createElementVNode("input", {
              type: "checkbox",
              checked: __props.task.status === "DONE",
              onChange: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("toggle", __props.task.id)),
              class: "w-4 h-4 rounded border-gray-600 text-primary-600 focus:ring-primary-500 focus:ring-offset-gray-900"
            }, null, 40, _hoisted_3$5)
          ]),
          vue.createElementVNode("td", _hoisted_4$4, [
            vue.createElementVNode("div", null, [
              vue.createElementVNode("p", {
                class: vue.normalizeClass(["font-medium", __props.task.status === "DONE" ? "line-through text-gray-500" : "text-white"])
              }, vue.toDisplayString(__props.task.title), 3),
              __props.task.description ? (vue.openBlock(), vue.createElementBlock("p", _hoisted_5$4, vue.toDisplayString(__props.task.description), 1)) : vue.createCommentVNode("", true)
            ])
          ]),
          vue.createElementVNode("td", _hoisted_6$4, [
            __props.task.categoryName ? (vue.openBlock(), vue.createElementBlock("span", {
              key: 0,
              class: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
              style: vue.normalizeStyle({
                backgroundColor: __props.task.categoryColor + "20",
                color: __props.task.categoryColor
              })
            }, vue.toDisplayString(__props.task.categoryName), 5)) : vue.createCommentVNode("", true)
          ]),
          vue.createElementVNode("td", _hoisted_7$4, [
            vue.createElementVNode("span", {
              class: vue.normalizeClass(["inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", priorityClass.value])
            }, vue.toDisplayString(__props.task.priority), 3)
          ]),
          vue.createElementVNode("td", _hoisted_8$4, [
            vue.createElementVNode("span", {
              class: vue.normalizeClass(["inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", statusClass.value])
            }, vue.toDisplayString(formatStatus(__props.task.status)), 3)
          ]),
          vue.createElementVNode("td", _hoisted_9$3, vue.toDisplayString(__props.task.dueDate ? formatDate(__props.task.dueDate) : "-"), 1),
          vue.createElementVNode("td", _hoisted_10$3, [
            vue.createElementVNode("div", _hoisted_11$3, [
              vue.createElementVNode("button", {
                onClick: _cache[1] || (_cache[1] = ($event) => _ctx.$emit("edit", __props.task)),
                class: "p-1.5 text-gray-400 hover:text-primary-400 hover:bg-gray-700 rounded transition-colors",
                title: "Edit"
              }, [..._cache[3] || (_cache[3] = [
                vue.createElementVNode("svg", {
                  class: "w-4 h-4",
                  fill: "none",
                  stroke: "currentColor",
                  viewBox: "0 0 24 24"
                }, [
                  vue.createElementVNode("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    "stroke-width": "2",
                    d: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  })
                ], -1)
              ])]),
              vue.createElementVNode("button", {
                onClick: _cache[2] || (_cache[2] = ($event) => _ctx.$emit("delete", __props.task.id)),
                class: "p-1.5 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded transition-colors",
                title: "Delete"
              }, [..._cache[4] || (_cache[4] = [
                vue.createElementVNode("svg", {
                  class: "w-4 h-4",
                  fill: "none",
                  stroke: "currentColor",
                  viewBox: "0 0 24 24"
                }, [
                  vue.createElementVNode("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    "stroke-width": "2",
                    d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  })
                ], -1)
              ])])
            ])
          ])
        ]);
      };
    }
  });
  const _hoisted_1$4 = { class: "bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" };
  const _hoisted_2$4 = { class: "flex items-center justify-between p-6 border-b border-gray-700" };
  const _hoisted_3$4 = { class: "text-xl font-bold text-white" };
  const _hoisted_4$3 = { class: "grid grid-cols-2 gap-4" };
  const _hoisted_5$3 = ["value"];
  const _hoisted_6$3 = { class: "grid grid-cols-2 gap-4" };
  const _hoisted_7$3 = { class: "flex justify-end space-x-3 pt-4" };
  const _hoisted_8$3 = ["disabled"];
  const _sfc_main$4 = /* @__PURE__ */ vue.defineComponent({
    __name: "TaskForm",
    props: {
      task: {},
      categories: {}
    },
    emits: ["close", "submit"],
    setup(__props, { emit: __emit }) {
      const props = __props;
      const emit = __emit;
      const loading = vue.ref(false);
      const isEdit = vue.computed(() => !!props.task);
      const form = vue.ref({
        title: "",
        description: "",
        status: "TODO",
        priority: "MEDIUM",
        categoryId: "",
        dueDate: "",
        estimatedHours: 0
      });
      vue.onMounted(() => {
        if (props.task) {
          form.value = {
            title: props.task.title,
            description: props.task.description || "",
            status: props.task.status,
            priority: props.task.priority,
            categoryId: props.task.categoryId || "",
            dueDate: props.task.dueDate ? props.task.dueDate.split("T")[0] : "",
            estimatedHours: props.task.estimatedHours
          };
        }
      });
      const handleSubmit = () => {
        loading.value = true;
        const data = {
          title: form.value.title,
          description: form.value.description || void 0,
          status: form.value.status,
          priority: form.value.priority,
          categoryId: form.value.categoryId || void 0,
          dueDate: form.value.dueDate || void 0,
          estimatedHours: form.value.estimatedHours
        };
        emit("submit", data);
      };
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", {
          class: "fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4",
          onClick: _cache[9] || (_cache[9] = vue.withModifiers(($event) => _ctx.$emit("close"), ["self"]))
        }, [
          vue.createElementVNode("div", _hoisted_1$4, [
            vue.createElementVNode("div", _hoisted_2$4, [
              vue.createElementVNode("h3", _hoisted_3$4, vue.toDisplayString(isEdit.value ? "Edit Task" : "New Task"), 1),
              vue.createElementVNode("button", {
                onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("close")),
                class: "text-gray-400 hover:text-white"
              }, [..._cache[10] || (_cache[10] = [
                vue.createElementVNode("svg", {
                  class: "w-6 h-6",
                  fill: "none",
                  stroke: "currentColor",
                  viewBox: "0 0 24 24"
                }, [
                  vue.createElementVNode("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    "stroke-width": "2",
                    d: "M6 18L18 6M6 6l12 12"
                  })
                ], -1)
              ])])
            ]),
            vue.createElementVNode("form", {
              onSubmit: vue.withModifiers(handleSubmit, ["prevent"]),
              class: "p-6 space-y-4"
            }, [
              vue.createElementVNode("div", null, [
                _cache[11] || (_cache[11] = vue.createElementVNode("label", { class: "block text-sm font-medium text-gray-300 mb-2" }, [
                  vue.createTextVNode(" Title "),
                  vue.createElementVNode("span", { class: "text-red-400" }, "*")
                ], -1)),
                vue.withDirectives(vue.createElementVNode("input", {
                  "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => form.value.title = $event),
                  type: "text",
                  required: "",
                  class: "w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
                  placeholder: "Enter task title..."
                }, null, 512), [
                  [vue.vModelText, form.value.title]
                ])
              ]),
              vue.createElementVNode("div", null, [
                _cache[12] || (_cache[12] = vue.createElementVNode("label", { class: "block text-sm font-medium text-gray-300 mb-2" }, " Description ", -1)),
                vue.withDirectives(vue.createElementVNode("textarea", {
                  "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => form.value.description = $event),
                  rows: "3",
                  class: "w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none",
                  placeholder: "Add a description..."
                }, null, 512), [
                  [vue.vModelText, form.value.description]
                ])
              ]),
              vue.createElementVNode("div", _hoisted_4$3, [
                vue.createElementVNode("div", null, [
                  _cache[14] || (_cache[14] = vue.createElementVNode("label", { class: "block text-sm font-medium text-gray-300 mb-2" }, " Category ", -1)),
                  vue.withDirectives(vue.createElementVNode("select", {
                    "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => form.value.categoryId = $event),
                    class: "w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  }, [
                    _cache[13] || (_cache[13] = vue.createElementVNode("option", { value: "" }, "No category", -1)),
                    (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(__props.categories, (cat) => {
                      return vue.openBlock(), vue.createElementBlock("option", {
                        key: cat.id,
                        value: cat.id
                      }, vue.toDisplayString(cat.name), 9, _hoisted_5$3);
                    }), 128))
                  ], 512), [
                    [vue.vModelSelect, form.value.categoryId]
                  ])
                ]),
                vue.createElementVNode("div", null, [
                  _cache[16] || (_cache[16] = vue.createElementVNode("label", { class: "block text-sm font-medium text-gray-300 mb-2" }, " Priority ", -1)),
                  vue.withDirectives(vue.createElementVNode("select", {
                    "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => form.value.priority = $event),
                    class: "w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  }, [..._cache[15] || (_cache[15] = [
                    vue.createElementVNode("option", { value: "LOW" }, "Low", -1),
                    vue.createElementVNode("option", { value: "MEDIUM" }, "Medium", -1),
                    vue.createElementVNode("option", { value: "HIGH" }, "High", -1),
                    vue.createElementVNode("option", { value: "URGENT" }, "Urgent", -1)
                  ])], 512), [
                    [vue.vModelSelect, form.value.priority]
                  ])
                ])
              ]),
              vue.createElementVNode("div", _hoisted_6$3, [
                vue.createElementVNode("div", null, [
                  _cache[18] || (_cache[18] = vue.createElementVNode("label", { class: "block text-sm font-medium text-gray-300 mb-2" }, " Status ", -1)),
                  vue.withDirectives(vue.createElementVNode("select", {
                    "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => form.value.status = $event),
                    class: "w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  }, [..._cache[17] || (_cache[17] = [
                    vue.createElementVNode("option", { value: "TODO" }, "To Do", -1),
                    vue.createElementVNode("option", { value: "IN_PROGRESS" }, "In Progress", -1),
                    vue.createElementVNode("option", { value: "IN_REVIEW" }, "In Review", -1),
                    vue.createElementVNode("option", { value: "DONE" }, "Done", -1)
                  ])], 512), [
                    [vue.vModelSelect, form.value.status]
                  ])
                ]),
                vue.createElementVNode("div", null, [
                  _cache[19] || (_cache[19] = vue.createElementVNode("label", { class: "block text-sm font-medium text-gray-300 mb-2" }, " Due Date ", -1)),
                  vue.withDirectives(vue.createElementVNode("input", {
                    "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => form.value.dueDate = $event),
                    type: "date",
                    class: "w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  }, null, 512), [
                    [vue.vModelText, form.value.dueDate]
                  ])
                ])
              ]),
              vue.createElementVNode("div", null, [
                _cache[20] || (_cache[20] = vue.createElementVNode("label", { class: "block text-sm font-medium text-gray-300 mb-2" }, " Estimated Hours ", -1)),
                vue.withDirectives(vue.createElementVNode("input", {
                  "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => form.value.estimatedHours = $event),
                  type: "number",
                  min: "0",
                  step: "0.5",
                  class: "w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                }, null, 512), [
                  [
                    vue.vModelText,
                    form.value.estimatedHours,
                    void 0,
                    { number: true }
                  ]
                ])
              ]),
              vue.createElementVNode("div", _hoisted_7$3, [
                vue.createElementVNode("button", {
                  type: "button",
                  onClick: _cache[8] || (_cache[8] = ($event) => _ctx.$emit("close")),
                  class: "px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                }, " Cancel "),
                vue.createElementVNode("button", {
                  type: "submit",
                  disabled: loading.value,
                  class: "px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                }, vue.toDisplayString(loading.value ? "Saving..." : isEdit.value ? "Update Task" : "Create Task"), 9, _hoisted_8$3)
              ])
            ], 32)
          ])
        ]);
      };
    }
  });
  const _hoisted_1$3 = { class: "bg-gray-800 border border-gray-700 rounded-lg p-4 space-y-4" };
  const _hoisted_2$3 = ["value"];
  const _hoisted_3$3 = { class: "flex items-center" };
  const _sfc_main$3 = /* @__PURE__ */ vue.defineComponent({
    __name: "TaskFilters",
    props: {
      categories: {},
      modelValue: {}
    },
    emits: ["update:modelValue", "apply"],
    setup(__props, { emit: __emit }) {
      const props = __props;
      const emit = __emit;
      const filters = vue.ref({
        search: "",
        status: "",
        priority: "",
        categoryId: "",
        isArchived: false
      });
      vue.watch(() => props.modelValue, (newValue) => {
        if (newValue) {
          filters.value = { ...newValue };
        }
      }, { immediate: true });
      const applyFilters = () => {
        const cleanFilters = Object.fromEntries(
          Object.entries(filters.value).filter(([_, value]) => value !== "" && value !== false)
        );
        emit("update:modelValue", cleanFilters);
        emit("apply", cleanFilters);
      };
      const resetFilters = () => {
        filters.value = {
          search: "",
          status: "",
          priority: "",
          categoryId: "",
          isArchived: false
        };
        applyFilters();
      };
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$3, [
          _cache[13] || (_cache[13] = vue.createElementVNode("h3", { class: "text-white font-semibold mb-4" }, "Filters", -1)),
          vue.createElementVNode("div", null, [
            _cache[5] || (_cache[5] = vue.createElementVNode("label", { class: "block text-sm font-medium text-gray-300 mb-2" }, " Search ", -1)),
            vue.withDirectives(vue.createElementVNode("input", {
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => filters.value.search = $event),
              type: "text",
              class: "w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500",
              placeholder: "Search tasks..."
            }, null, 512), [
              [vue.vModelText, filters.value.search]
            ])
          ]),
          vue.createElementVNode("div", null, [
            _cache[7] || (_cache[7] = vue.createElementVNode("label", { class: "block text-sm font-medium text-gray-300 mb-2" }, " Status ", -1)),
            vue.withDirectives(vue.createElementVNode("select", {
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => filters.value.status = $event),
              class: "w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500"
            }, [..._cache[6] || (_cache[6] = [
              vue.createStaticVNode('<option value="">All Statuses</option><option value="TODO">To Do</option><option value="IN_PROGRESS">In Progress</option><option value="IN_REVIEW">In Review</option><option value="DONE">Done</option><option value="CANCELLED">Cancelled</option>', 6)
            ])], 512), [
              [vue.vModelSelect, filters.value.status]
            ])
          ]),
          vue.createElementVNode("div", null, [
            _cache[9] || (_cache[9] = vue.createElementVNode("label", { class: "block text-sm font-medium text-gray-300 mb-2" }, " Priority ", -1)),
            vue.withDirectives(vue.createElementVNode("select", {
              "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => filters.value.priority = $event),
              class: "w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500"
            }, [..._cache[8] || (_cache[8] = [
              vue.createStaticVNode('<option value="">All Priorities</option><option value="URGENT">Urgent</option><option value="HIGH">High</option><option value="MEDIUM">Medium</option><option value="LOW">Low</option>', 5)
            ])], 512), [
              [vue.vModelSelect, filters.value.priority]
            ])
          ]),
          vue.createElementVNode("div", null, [
            _cache[11] || (_cache[11] = vue.createElementVNode("label", { class: "block text-sm font-medium text-gray-300 mb-2" }, " Category ", -1)),
            vue.withDirectives(vue.createElementVNode("select", {
              "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => filters.value.categoryId = $event),
              class: "w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500"
            }, [
              _cache[10] || (_cache[10] = vue.createElementVNode("option", { value: "" }, "All Categories", -1)),
              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(__props.categories, (category) => {
                return vue.openBlock(), vue.createElementBlock("option", {
                  key: category.id,
                  value: category.id
                }, vue.toDisplayString(category.icon) + " " + vue.toDisplayString(category.name), 9, _hoisted_2$3);
              }), 128))
            ], 512), [
              [vue.vModelSelect, filters.value.categoryId]
            ])
          ]),
          vue.createElementVNode("div", _hoisted_3$3, [
            vue.withDirectives(vue.createElementVNode("input", {
              "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => filters.value.isArchived = $event),
              type: "checkbox",
              id: "archived",
              class: "w-4 h-4 text-primary-600 bg-gray-700 border-gray-600 rounded focus:ring-primary-500"
            }, null, 512), [
              [vue.vModelCheckbox, filters.value.isArchived]
            ]),
            _cache[12] || (_cache[12] = vue.createElementVNode("label", {
              for: "archived",
              class: "ml-2 text-sm text-gray-300"
            }, " Show Archived ", -1))
          ]),
          vue.createElementVNode("div", { class: "flex space-x-2 pt-4" }, [
            vue.createElementVNode("button", {
              onClick: applyFilters,
              class: "flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700 transition-colors"
            }, " Apply "),
            vue.createElementVNode("button", {
              onClick: resetFilters,
              class: "px-4 py-2 bg-gray-700 text-white rounded-lg text-sm hover:bg-gray-600 transition-colors"
            }, " Reset ")
          ])
        ]);
      };
    }
  });
  const _hoisted_1$2 = { class: "space-y-6" };
  const _hoisted_2$2 = { class: "flex items-center justify-between" };
  const _hoisted_3$2 = { class: "flex items-center space-x-4" };
  const _hoisted_4$2 = { class: "px-3 py-1 bg-gray-700 rounded-full text-sm text-gray-300" };
  const _hoisted_5$2 = { class: "card" };
  const _hoisted_6$2 = { class: "flex flex-wrap items-center gap-4" };
  const _hoisted_7$2 = { class: "flex items-center space-x-2" };
  const _hoisted_8$2 = { class: "flex space-x-1" };
  const _hoisted_9$2 = ["onClick"];
  const _hoisted_10$2 = { class: "flex items-center space-x-2" };
  const _hoisted_11$2 = ["value"];
  const _hoisted_12$1 = { class: "flex items-center space-x-2" };
  const _hoisted_13$1 = { class: "flex-1 min-w-[200px]" };
  const _hoisted_14$1 = {
    key: 0,
    class: "card text-center py-12"
  };
  const _hoisted_15$1 = {
    key: 1,
    class: "card bg-red-500/10 border border-red-500/20"
  };
  const _hoisted_16$1 = { class: "flex items-center space-x-3" };
  const _hoisted_17$1 = { class: "text-red-400" };
  const _hoisted_18$1 = {
    key: 2,
    class: "card overflow-hidden"
  };
  const _hoisted_19$1 = { class: "overflow-x-auto" };
  const _hoisted_20$1 = { class: "w-full" };
  const _hoisted_21$1 = { class: "bg-gray-800 border-b border-gray-700" };
  const _hoisted_22$1 = { class: "px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-12" };
  const _hoisted_23$1 = {
    key: 3,
    class: "card text-center py-12"
  };
  const _hoisted_24$1 = { class: "text-gray-400 mb-6" };
  const _hoisted_25$1 = { class: "bg-gray-800 rounded-xl p-6 max-w-md w-full" };
  const _hoisted_26$1 = { class: "flex justify-end space-x-3" };
  const _sfc_main$2 = /* @__PURE__ */ vue.defineComponent({
    __name: "TaskList",
    setup(__props) {
      const taskStore = useTaskStore();
      const showForm = vue.ref(false);
      const editingTask = vue.ref();
      const showDeleteConfirm = vue.ref(false);
      const deletingTaskId = vue.ref(null);
      const statusOptions = [
        { label: "All", value: "all" },
        { label: "To Do", value: "TODO" },
        { label: "In Progress", value: "IN_PROGRESS" },
        { label: "Done", value: "DONE" }
      ];
      const filteredTasks = vue.computed(() => taskStore.filteredTasks);
      const hasActiveFilters = vue.computed(() => {
        return taskStore.statusFilter !== "all" || taskStore.priorityFilter !== "all" || taskStore.categoryFilter !== "all" || taskStore.searchQuery !== "";
      });
      const handleToggle = async (id) => {
        const task = taskStore.tasks.find((t) => t.id === id);
        if (task) {
          await taskStore.toggleTaskStatus(id, task.status !== "DONE");
        }
      };
      const handleEdit = (task) => {
        editingTask.value = task;
        showForm.value = true;
      };
      const handleDelete = (id) => {
        deletingTaskId.value = id;
        showDeleteConfirm.value = true;
      };
      const confirmDelete = async () => {
        if (deletingTaskId.value) {
          await taskStore.deleteTask(deletingTaskId.value);
          showDeleteConfirm.value = false;
          deletingTaskId.value = null;
        }
      };
      const handleSubmit = async (data) => {
        if (editingTask.value) {
          await taskStore.updateTask(editingTask.value.id, data);
        } else {
          await taskStore.createTask(data);
        }
        closeForm();
      };
      const closeForm = () => {
        showForm.value = false;
        editingTask.value = void 0;
      };
      const toggleAll = (event) => {
        const checked = event.target.checked;
        console.log("Toggle all:", checked);
      };
      vue.onMounted(async () => {
        await taskStore.fetchCategories();
        await taskStore.fetchTasks();
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$2, [
          vue.createElementVNode("div", _hoisted_2$2, [
            vue.createElementVNode("div", _hoisted_3$2, [
              _cache[8] || (_cache[8] = vue.createElementVNode("h3", { class: "text-2xl font-bold text-white" }, "Tasks", -1)),
              vue.createElementVNode("span", _hoisted_4$2, vue.toDisplayString(filteredTasks.value.length) + " tasks ", 1)
            ]),
            vue.createElementVNode("button", {
              onClick: _cache[0] || (_cache[0] = ($event) => showForm.value = true),
              class: "flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
            }, [..._cache[9] || (_cache[9] = [
              vue.createElementVNode("svg", {
                class: "w-5 h-5",
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24"
              }, [
                vue.createElementVNode("path", {
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round",
                  "stroke-width": "2",
                  d: "M12 4v16m8-8H4"
                })
              ], -1),
              vue.createElementVNode("span", null, "New Task", -1)
            ])])
          ]),
          vue.createElementVNode("div", _hoisted_5$2, [
            vue.createElementVNode("div", _hoisted_6$2, [
              vue.createElementVNode("div", _hoisted_7$2, [
                _cache[10] || (_cache[10] = vue.createElementVNode("span", { class: "text-sm text-gray-400" }, "Status:", -1)),
                vue.createElementVNode("div", _hoisted_8$2, [
                  (vue.openBlock(), vue.createElementBlock(vue.Fragment, null, vue.renderList(statusOptions, (status) => {
                    return vue.createElementVNode("button", {
                      key: status.value,
                      onClick: ($event) => vue.unref(taskStore).setStatusFilter(status.value),
                      class: vue.normalizeClass(["px-3 py-1.5 rounded-lg text-sm font-medium transition-colors", vue.unref(taskStore).statusFilter === status.value ? "bg-primary-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"])
                    }, vue.toDisplayString(status.label), 11, _hoisted_9$2);
                  }), 64))
                ])
              ]),
              vue.createElementVNode("div", _hoisted_10$2, [
                _cache[12] || (_cache[12] = vue.createElementVNode("span", { class: "text-sm text-gray-400" }, "Category:", -1)),
                vue.withDirectives(vue.createElementVNode("select", {
                  "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => vue.unref(taskStore).categoryFilter = $event),
                  class: "px-3 py-1.5 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                }, [
                  _cache[11] || (_cache[11] = vue.createElementVNode("option", { value: "all" }, "All", -1)),
                  (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(taskStore).categories, (cat) => {
                    return vue.openBlock(), vue.createElementBlock("option", {
                      key: cat.id,
                      value: cat.id
                    }, vue.toDisplayString(cat.name), 9, _hoisted_11$2);
                  }), 128))
                ], 512), [
                  [vue.vModelSelect, vue.unref(taskStore).categoryFilter]
                ])
              ]),
              vue.createElementVNode("div", _hoisted_12$1, [
                _cache[14] || (_cache[14] = vue.createElementVNode("span", { class: "text-sm text-gray-400" }, "Priority:", -1)),
                vue.withDirectives(vue.createElementVNode("select", {
                  "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => vue.unref(taskStore).priorityFilter = $event),
                  class: "px-3 py-1.5 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                }, [..._cache[13] || (_cache[13] = [
                  vue.createStaticVNode('<option value="all">All</option><option value="LOW">Low</option><option value="MEDIUM">Medium</option><option value="HIGH">High</option><option value="URGENT">Urgent</option>', 5)
                ])], 512), [
                  [vue.vModelSelect, vue.unref(taskStore).priorityFilter]
                ])
              ]),
              vue.createElementVNode("div", _hoisted_13$1, [
                vue.withDirectives(vue.createElementVNode("input", {
                  "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => vue.unref(taskStore).searchQuery = $event),
                  type: "text",
                  placeholder: "Search tasks...",
                  class: "w-full px-4 py-1.5 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                }, null, 512), [
                  [vue.vModelText, vue.unref(taskStore).searchQuery]
                ])
              ]),
              hasActiveFilters.value ? (vue.openBlock(), vue.createElementBlock("button", {
                key: 0,
                onClick: _cache[4] || (_cache[4] = ($event) => vue.unref(taskStore).clearFilters()),
                class: "px-3 py-1.5 text-sm text-gray-400 hover:text-white transition-colors"
              }, " Clear filters ")) : vue.createCommentVNode("", true)
            ])
          ]),
          vue.unref(taskStore).loading ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_14$1, [..._cache[15] || (_cache[15] = [
            vue.createElementVNode("div", { class: "inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mb-4" }, null, -1),
            vue.createElementVNode("p", { class: "text-gray-400" }, "Loading tasks...", -1)
          ])])) : vue.unref(taskStore).error ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_15$1, [
            vue.createElementVNode("div", _hoisted_16$1, [
              _cache[16] || (_cache[16] = vue.createElementVNode("svg", {
                class: "w-6 h-6 text-red-400",
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24"
              }, [
                vue.createElementVNode("path", {
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round",
                  "stroke-width": "2",
                  d: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                })
              ], -1)),
              vue.createElementVNode("p", _hoisted_17$1, vue.toDisplayString(vue.unref(taskStore).error), 1)
            ])
          ])) : filteredTasks.value.length > 0 ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_18$1, [
            vue.createElementVNode("div", _hoisted_19$1, [
              vue.createElementVNode("table", _hoisted_20$1, [
                vue.createElementVNode("thead", _hoisted_21$1, [
                  vue.createElementVNode("tr", null, [
                    vue.createElementVNode("th", _hoisted_22$1, [
                      vue.createElementVNode("input", {
                        type: "checkbox",
                        onChange: toggleAll,
                        class: "w-4 h-4 rounded border-gray-600 text-primary-600 focus:ring-primary-500 focus:ring-offset-gray-900"
                      }, null, 32)
                    ]),
                    _cache[17] || (_cache[17] = vue.createElementVNode("th", { class: "px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider" }, " Task ", -1)),
                    _cache[18] || (_cache[18] = vue.createElementVNode("th", { class: "px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider" }, " Category ", -1)),
                    _cache[19] || (_cache[19] = vue.createElementVNode("th", { class: "px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider" }, " Priority ", -1)),
                    _cache[20] || (_cache[20] = vue.createElementVNode("th", { class: "px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider" }, " Status ", -1)),
                    _cache[21] || (_cache[21] = vue.createElementVNode("th", { class: "px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider" }, " Due Date ", -1)),
                    _cache[22] || (_cache[22] = vue.createElementVNode("th", { class: "px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-24" }, " Actions ", -1))
                  ])
                ]),
                vue.createElementVNode("tbody", null, [
                  (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(filteredTasks.value, (task) => {
                    return vue.openBlock(), vue.createBlock(_sfc_main$5, {
                      key: task.id,
                      task,
                      onToggle: handleToggle,
                      onEdit: handleEdit,
                      onDelete: handleDelete
                    }, null, 8, ["task"]);
                  }), 128))
                ])
              ])
            ])
          ])) : (vue.openBlock(), vue.createElementBlock("div", _hoisted_23$1, [
            _cache[24] || (_cache[24] = vue.createElementVNode("svg", {
              class: "w-16 h-16 text-gray-600 mx-auto mb-4",
              fill: "none",
              stroke: "currentColor",
              viewBox: "0 0 24 24"
            }, [
              vue.createElementVNode("path", {
                "stroke-linecap": "round",
                "stroke-linejoin": "round",
                "stroke-width": "2",
                d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              })
            ], -1)),
            _cache[25] || (_cache[25] = vue.createElementVNode("h3", { class: "text-xl font-bold text-white mb-2" }, "No tasks found", -1)),
            vue.createElementVNode("p", _hoisted_24$1, vue.toDisplayString(hasActiveFilters.value ? "Try adjusting your filters" : "Create your first task to get started"), 1),
            !hasActiveFilters.value ? (vue.openBlock(), vue.createElementBlock("button", {
              key: 0,
              onClick: _cache[5] || (_cache[5] = ($event) => showForm.value = true),
              class: "inline-flex items-center space-x-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
            }, [..._cache[23] || (_cache[23] = [
              vue.createElementVNode("svg", {
                class: "w-5 h-5",
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24"
              }, [
                vue.createElementVNode("path", {
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round",
                  "stroke-width": "2",
                  d: "M12 4v16m8-8H4"
                })
              ], -1),
              vue.createElementVNode("span", null, "Create First Task", -1)
            ])])) : vue.createCommentVNode("", true)
          ])),
          showForm.value ? (vue.openBlock(), vue.createBlock(_sfc_main$4, {
            key: 4,
            task: editingTask.value,
            categories: vue.unref(taskStore).categories,
            onClose: closeForm,
            onSubmit: handleSubmit
          }, null, 8, ["task", "categories"])) : vue.createCommentVNode("", true),
          showDeleteConfirm.value ? (vue.openBlock(), vue.createElementBlock("div", {
            key: 5,
            class: "fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4",
            onClick: _cache[7] || (_cache[7] = vue.withModifiers(($event) => showDeleteConfirm.value = false, ["self"]))
          }, [
            vue.createElementVNode("div", _hoisted_25$1, [
              _cache[26] || (_cache[26] = vue.createElementVNode("h3", { class: "text-xl font-bold text-white mb-4" }, "Delete Task?", -1)),
              _cache[27] || (_cache[27] = vue.createElementVNode("p", { class: "text-gray-300 mb-6" }, " Are you sure you want to delete this task? This action cannot be undone. ", -1)),
              vue.createElementVNode("div", _hoisted_26$1, [
                vue.createElementVNode("button", {
                  onClick: _cache[6] || (_cache[6] = ($event) => showDeleteConfirm.value = false),
                  class: "px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                }, " Cancel "),
                vue.createElementVNode("button", {
                  onClick: confirmDelete,
                  class: "px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                }, " Delete ")
              ])
            ])
          ])) : vue.createCommentVNode("", true)
        ]);
      };
    }
  });
  const _hoisted_1$1 = { class: "space-y-6" };
  const _hoisted_2$1 = { class: "flex items-center justify-between" };
  const _hoisted_3$1 = { class: "grid grid-cols-1 md:grid-cols-4 gap-4" };
  const _hoisted_4$1 = { class: "card" };
  const _hoisted_5$1 = { class: "flex items-center justify-between mb-4" };
  const _hoisted_6$1 = { class: "px-2 py-1 bg-gray-700 rounded text-xs text-gray-300" };
  const _hoisted_7$1 = { class: "space-y-3" };
  const _hoisted_8$1 = { class: "font-medium text-white mb-1" };
  const _hoisted_9$1 = {
    key: 0,
    class: "text-sm text-gray-400 mb-2 line-clamp-2"
  };
  const _hoisted_10$1 = { class: "flex items-center justify-between" };
  const _hoisted_11$1 = { class: "text-xs text-gray-500" };
  const _hoisted_12 = {
    key: 0,
    class: "text-center py-8 text-gray-500 text-sm"
  };
  const _hoisted_13 = { class: "card" };
  const _hoisted_14 = { class: "flex items-center justify-between mb-4" };
  const _hoisted_15 = { class: "px-2 py-1 bg-gray-700 rounded text-xs text-gray-300" };
  const _hoisted_16 = { class: "space-y-3" };
  const _hoisted_17 = { class: "font-medium text-white mb-1" };
  const _hoisted_18 = {
    key: 0,
    class: "text-sm text-gray-400 mb-2 line-clamp-2"
  };
  const _hoisted_19 = { class: "flex items-center justify-between" };
  const _hoisted_20 = { class: "text-xs text-gray-500" };
  const _hoisted_21 = {
    key: 0,
    class: "text-center py-8 text-gray-500 text-sm"
  };
  const _hoisted_22 = { class: "card" };
  const _hoisted_23 = { class: "flex items-center justify-between mb-4" };
  const _hoisted_24 = { class: "px-2 py-1 bg-gray-700 rounded text-xs text-gray-300" };
  const _hoisted_25 = { class: "space-y-3" };
  const _hoisted_26 = { class: "font-medium text-white mb-1" };
  const _hoisted_27 = {
    key: 0,
    class: "text-sm text-gray-400 mb-2 line-clamp-2"
  };
  const _hoisted_28 = { class: "flex items-center justify-between" };
  const _hoisted_29 = { class: "text-xs text-gray-500" };
  const _hoisted_30 = {
    key: 0,
    class: "text-center py-8 text-gray-500 text-sm"
  };
  const _hoisted_31 = { class: "card" };
  const _hoisted_32 = { class: "flex items-center justify-between mb-4" };
  const _hoisted_33 = { class: "px-2 py-1 bg-gray-700 rounded text-xs text-gray-300" };
  const _hoisted_34 = { class: "space-y-3" };
  const _hoisted_35 = { class: "font-medium text-white mb-1 line-through" };
  const _hoisted_36 = {
    key: 0,
    class: "text-sm text-gray-400 mb-2 line-clamp-2"
  };
  const _hoisted_37 = { class: "flex items-center justify-between" };
  const _hoisted_38 = { class: "text-xs text-gray-500" };
  const _hoisted_39 = {
    key: 0,
    class: "text-center py-8 text-gray-500 text-sm"
  };
  const _sfc_main$1 = /* @__PURE__ */ vue.defineComponent({
    __name: "TaskBoard",
    setup(__props) {
      const taskStore = useTaskStore();
      const showForm = vue.ref(false);
      const formatDate = (date) => {
        const d = new Date(date);
        return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      };
      const handleSubmit = async (data) => {
        await taskStore.createTask(data);
        showForm.value = false;
      };
      vue.onMounted(async () => {
        await taskStore.fetchCategories();
        await taskStore.fetchTasks();
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$1, [
          vue.createElementVNode("div", _hoisted_2$1, [
            _cache[3] || (_cache[3] = vue.createElementVNode("h3", { class: "text-2xl font-bold text-white" }, "Task Board", -1)),
            vue.createElementVNode("button", {
              onClick: _cache[0] || (_cache[0] = ($event) => showForm.value = true),
              class: "flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
            }, [..._cache[2] || (_cache[2] = [
              vue.createElementVNode("svg", {
                class: "w-5 h-5",
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24"
              }, [
                vue.createElementVNode("path", {
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round",
                  "stroke-width": "2",
                  d: "M12 4v16m8-8H4"
                })
              ], -1),
              vue.createElementVNode("span", null, "New Task", -1)
            ])])
          ]),
          vue.createElementVNode("div", _hoisted_3$1, [
            vue.createElementVNode("div", _hoisted_4$1, [
              vue.createElementVNode("div", _hoisted_5$1, [
                _cache[4] || (_cache[4] = vue.createElementVNode("h4", { class: "font-semibold text-white" }, "To Do", -1)),
                vue.createElementVNode("span", _hoisted_6$1, vue.toDisplayString(vue.unref(taskStore).tasksByStatus.TODO.length), 1)
              ]),
              vue.createElementVNode("div", _hoisted_7$1, [
                (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(taskStore).tasksByStatus.TODO, (task) => {
                  return vue.openBlock(), vue.createElementBlock("div", {
                    key: task.id,
                    class: "p-3 bg-gray-800 rounded-lg border border-gray-700 hover:border-primary-500 transition-colors cursor-pointer"
                  }, [
                    vue.createElementVNode("h5", _hoisted_8$1, vue.toDisplayString(task.title), 1),
                    task.description ? (vue.openBlock(), vue.createElementBlock("p", _hoisted_9$1, vue.toDisplayString(task.description), 1)) : vue.createCommentVNode("", true),
                    vue.createElementVNode("div", _hoisted_10$1, [
                      task.categoryName ? (vue.openBlock(), vue.createElementBlock("span", {
                        key: 0,
                        class: "text-xs px-2 py-0.5 rounded",
                        style: vue.normalizeStyle({ backgroundColor: task.categoryColor + "20", color: task.categoryColor })
                      }, vue.toDisplayString(task.categoryName), 5)) : vue.createCommentVNode("", true),
                      vue.createElementVNode("span", _hoisted_11$1, vue.toDisplayString(task.dueDate ? formatDate(task.dueDate) : ""), 1)
                    ])
                  ]);
                }), 128)),
                vue.unref(taskStore).tasksByStatus.TODO.length === 0 ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_12, " No tasks ")) : vue.createCommentVNode("", true)
              ])
            ]),
            vue.createElementVNode("div", _hoisted_13, [
              vue.createElementVNode("div", _hoisted_14, [
                _cache[5] || (_cache[5] = vue.createElementVNode("h4", { class: "font-semibold text-white" }, "In Progress", -1)),
                vue.createElementVNode("span", _hoisted_15, vue.toDisplayString(vue.unref(taskStore).tasksByStatus.IN_PROGRESS.length), 1)
              ]),
              vue.createElementVNode("div", _hoisted_16, [
                (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(taskStore).tasksByStatus.IN_PROGRESS, (task) => {
                  return vue.openBlock(), vue.createElementBlock("div", {
                    key: task.id,
                    class: "p-3 bg-gray-800 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors cursor-pointer"
                  }, [
                    vue.createElementVNode("h5", _hoisted_17, vue.toDisplayString(task.title), 1),
                    task.description ? (vue.openBlock(), vue.createElementBlock("p", _hoisted_18, vue.toDisplayString(task.description), 1)) : vue.createCommentVNode("", true),
                    vue.createElementVNode("div", _hoisted_19, [
                      task.categoryName ? (vue.openBlock(), vue.createElementBlock("span", {
                        key: 0,
                        class: "text-xs px-2 py-0.5 rounded",
                        style: vue.normalizeStyle({ backgroundColor: task.categoryColor + "20", color: task.categoryColor })
                      }, vue.toDisplayString(task.categoryName), 5)) : vue.createCommentVNode("", true),
                      vue.createElementVNode("span", _hoisted_20, vue.toDisplayString(task.dueDate ? formatDate(task.dueDate) : ""), 1)
                    ])
                  ]);
                }), 128)),
                vue.unref(taskStore).tasksByStatus.IN_PROGRESS.length === 0 ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_21, " No tasks ")) : vue.createCommentVNode("", true)
              ])
            ]),
            vue.createElementVNode("div", _hoisted_22, [
              vue.createElementVNode("div", _hoisted_23, [
                _cache[6] || (_cache[6] = vue.createElementVNode("h4", { class: "font-semibold text-white" }, "In Review", -1)),
                vue.createElementVNode("span", _hoisted_24, vue.toDisplayString(vue.unref(taskStore).tasksByStatus.IN_REVIEW.length), 1)
              ]),
              vue.createElementVNode("div", _hoisted_25, [
                (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(taskStore).tasksByStatus.IN_REVIEW, (task) => {
                  return vue.openBlock(), vue.createElementBlock("div", {
                    key: task.id,
                    class: "p-3 bg-gray-800 rounded-lg border border-gray-700 hover:border-purple-500 transition-colors cursor-pointer"
                  }, [
                    vue.createElementVNode("h5", _hoisted_26, vue.toDisplayString(task.title), 1),
                    task.description ? (vue.openBlock(), vue.createElementBlock("p", _hoisted_27, vue.toDisplayString(task.description), 1)) : vue.createCommentVNode("", true),
                    vue.createElementVNode("div", _hoisted_28, [
                      task.categoryName ? (vue.openBlock(), vue.createElementBlock("span", {
                        key: 0,
                        class: "text-xs px-2 py-0.5 rounded",
                        style: vue.normalizeStyle({ backgroundColor: task.categoryColor + "20", color: task.categoryColor })
                      }, vue.toDisplayString(task.categoryName), 5)) : vue.createCommentVNode("", true),
                      vue.createElementVNode("span", _hoisted_29, vue.toDisplayString(task.dueDate ? formatDate(task.dueDate) : ""), 1)
                    ])
                  ]);
                }), 128)),
                vue.unref(taskStore).tasksByStatus.IN_REVIEW.length === 0 ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_30, " No tasks ")) : vue.createCommentVNode("", true)
              ])
            ]),
            vue.createElementVNode("div", _hoisted_31, [
              vue.createElementVNode("div", _hoisted_32, [
                _cache[7] || (_cache[7] = vue.createElementVNode("h4", { class: "font-semibold text-white" }, "Done", -1)),
                vue.createElementVNode("span", _hoisted_33, vue.toDisplayString(vue.unref(taskStore).tasksByStatus.DONE.length), 1)
              ]),
              vue.createElementVNode("div", _hoisted_34, [
                (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(taskStore).tasksByStatus.DONE, (task) => {
                  return vue.openBlock(), vue.createElementBlock("div", {
                    key: task.id,
                    class: "p-3 bg-gray-800 rounded-lg border border-gray-700 hover:border-green-500 transition-colors cursor-pointer opacity-75"
                  }, [
                    vue.createElementVNode("h5", _hoisted_35, vue.toDisplayString(task.title), 1),
                    task.description ? (vue.openBlock(), vue.createElementBlock("p", _hoisted_36, vue.toDisplayString(task.description), 1)) : vue.createCommentVNode("", true),
                    vue.createElementVNode("div", _hoisted_37, [
                      task.categoryName ? (vue.openBlock(), vue.createElementBlock("span", {
                        key: 0,
                        class: "text-xs px-2 py-0.5 rounded",
                        style: vue.normalizeStyle({ backgroundColor: task.categoryColor + "20", color: task.categoryColor })
                      }, vue.toDisplayString(task.categoryName), 5)) : vue.createCommentVNode("", true),
                      vue.createElementVNode("span", _hoisted_38, vue.toDisplayString(task.completedAt ? formatDate(task.completedAt) : ""), 1)
                    ])
                  ]);
                }), 128)),
                vue.unref(taskStore).tasksByStatus.DONE.length === 0 ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_39, " No tasks ")) : vue.createCommentVNode("", true)
              ])
            ])
          ]),
          showForm.value ? (vue.openBlock(), vue.createBlock(_sfc_main$4, {
            key: 0,
            categories: vue.unref(taskStore).categories,
            onClose: _cache[1] || (_cache[1] = ($event) => showForm.value = false),
            onSubmit: handleSubmit
          }, null, 8, ["categories"])) : vue.createCommentVNode("", true)
        ]);
      };
    }
  });
  const _hoisted_1 = { class: "space-y-6" };
  const _hoisted_2 = { class: "flex items-center justify-between" };
  const _hoisted_3 = { class: "card" };
  const _hoisted_4 = { class: "border-t border-gray-700 pt-6" };
  const _hoisted_5 = { class: "space-y-3" };
  const _hoisted_6 = { class: "flex-1" };
  const _hoisted_7 = { class: "font-medium text-white" };
  const _hoisted_8 = { class: "text-sm text-gray-400" };
  const _hoisted_9 = { class: "text-right" };
  const _hoisted_10 = { class: "text-sm font-medium text-white" };
  const _hoisted_11 = {
    key: 0,
    class: "text-center py-8 text-gray-500"
  };
  const _sfc_main = /* @__PURE__ */ vue.defineComponent({
    __name: "TaskCalendar",
    setup(__props) {
      const taskStore = useTaskStore();
      const showForm = vue.ref(false);
      const upcomingTasks = vue.computed(() => {
        return taskStore.tasks.filter((t) => t.dueDate && !t.isArchived && t.status !== "DONE").sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()).slice(0, 10);
      });
      const formatDate = (date) => {
        const d = new Date(date);
        const today = /* @__PURE__ */ new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        if (d.toDateString() === today.toDateString()) {
          return "Today";
        } else if (d.toDateString() === tomorrow.toDateString()) {
          return "Tomorrow";
        } else {
          return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
        }
      };
      const getPriorityClass = (priority) => {
        const classes = {
          LOW: "bg-blue-500/20 text-blue-400",
          MEDIUM: "bg-yellow-500/20 text-yellow-400",
          HIGH: "bg-orange-500/20 text-orange-400",
          URGENT: "bg-red-500/20 text-red-400"
        };
        return classes[priority] || classes.MEDIUM;
      };
      const handleSubmit = async (data) => {
        await taskStore.createTask(data);
        showForm.value = false;
      };
      vue.onMounted(async () => {
        await taskStore.fetchCategories();
        await taskStore.fetchTasks();
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1, [
          vue.createElementVNode("div", _hoisted_2, [
            _cache[3] || (_cache[3] = vue.createElementVNode("h3", { class: "text-2xl font-bold text-white" }, "Task Calendar", -1)),
            vue.createElementVNode("button", {
              onClick: _cache[0] || (_cache[0] = ($event) => showForm.value = true),
              class: "flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
            }, [..._cache[2] || (_cache[2] = [
              vue.createElementVNode("svg", {
                class: "w-5 h-5",
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24"
              }, [
                vue.createElementVNode("path", {
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round",
                  "stroke-width": "2",
                  d: "M12 4v16m8-8H4"
                })
              ], -1),
              vue.createElementVNode("span", null, "New Task", -1)
            ])])
          ]),
          vue.createElementVNode("div", _hoisted_3, [
            _cache[5] || (_cache[5] = vue.createStaticVNode('<div class="text-center py-12"><svg class="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg><h4 class="text-lg font-semibold text-white mb-2">Calendar View</h4><p class="text-gray-400 mb-6">Full calendar view coming soon</p></div>', 1)),
            vue.createElementVNode("div", _hoisted_4, [
              _cache[4] || (_cache[4] = vue.createElementVNode("h4", { class: "font-semibold text-white mb-4" }, "Upcoming Tasks", -1)),
              vue.createElementVNode("div", _hoisted_5, [
                (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(upcomingTasks.value, (task) => {
                  return vue.openBlock(), vue.createElementBlock("div", {
                    key: task.id,
                    class: "flex items-center justify-between p-3 bg-gray-800 rounded-lg"
                  }, [
                    vue.createElementVNode("div", _hoisted_6, [
                      vue.createElementVNode("h5", _hoisted_7, vue.toDisplayString(task.title), 1),
                      vue.createElementVNode("p", _hoisted_8, vue.toDisplayString(task.categoryName || "No category"), 1)
                    ]),
                    vue.createElementVNode("div", _hoisted_9, [
                      vue.createElementVNode("p", _hoisted_10, vue.toDisplayString(formatDate(task.dueDate)), 1),
                      vue.createElementVNode("span", {
                        class: vue.normalizeClass(["inline-block px-2 py-0.5 rounded text-xs", getPriorityClass(task.priority)])
                      }, vue.toDisplayString(task.priority), 3)
                    ])
                  ]);
                }), 128)),
                upcomingTasks.value.length === 0 ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_11, " No upcoming tasks ")) : vue.createCommentVNode("", true)
              ])
            ])
          ]),
          showForm.value ? (vue.openBlock(), vue.createBlock(_sfc_main$4, {
            key: 0,
            categories: vue.unref(taskStore).categories,
            onClose: _cache[1] || (_cache[1] = ($event) => showForm.value = false),
            onSubmit: handleSubmit
          }, null, 8, ["categories"])) : vue.createCommentVNode("", true)
        ]);
      };
    }
  });
  const pluginInfo = {
    name: "Task Manager",
    version: "4.0.0",
    author: "NJO Team",
    slug: "task-manager",
    description: "Complete task management system"
  };
  const routes = [
    {
      path: "/tasks",
      name: "Tasks",
      component: "TaskList",
      meta: {
        title: "Tasks",
        icon: "CheckSquare",
        requiresAuth: true
      }
    },
    {
      path: "/tasks/board",
      name: "TaskBoard",
      component: "TaskBoard",
      meta: {
        title: "Task Board",
        icon: "Kanban",
        requiresAuth: true
      }
    },
    {
      path: "/tasks/calendar",
      name: "TaskCalendar",
      component: "TaskCalendar",
      meta: {
        title: "Calendar",
        icon: "Calendar",
        requiresAuth: true
      }
    }
  ];
  console.log("📋 Task Manager Plugin loaded");
  const index = {
    pluginInfo,
    routes,
    useTaskStore,
    TaskCard: _sfc_main$5,
    TaskForm: _sfc_main$4,
    TaskFilters: _sfc_main$3,
    TaskList: _sfc_main$2,
    TaskBoard: _sfc_main$1,
    TaskCalendar: _sfc_main
  };
  return index;
})(Pinia, Vue, axios);
