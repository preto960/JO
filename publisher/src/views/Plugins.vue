<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">My Plugins</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2">Manage your plugin portfolio</p>
      </div>
      <button
        @click="showCreateModal = true"
        class="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 font-medium shadow-lg"
      >
        Create New Plugin
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
      <div class="flex flex-wrap gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
          <select
            v-model="statusFilter"
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
          >
            <option value="">All Status</option>
            <option value="DRAFT">Draft</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
          <select
            v-model="categoryFilter"
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
          >
            <option value="">All Categories</option>
            <option value="productivity">Productivity</option>
            <option value="development">Development</option>
            <option value="design">Design</option>
            <option value="marketing">Marketing</option>
            <option value="analytics">Analytics</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Plugins Grid -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>

    <div v-else-if="error" class="text-center py-12 text-red-600 dark:text-red-400">
      {{ error }}
    </div>

    <div v-else-if="filteredPlugins.length === 0" class="text-center py-12 text-gray-500 dark:text-gray-400">
      <div class="mb-4">
        <svg class="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No plugins found</h3>
      <p class="text-gray-500 dark:text-gray-400 mb-4">No plugins found matching your criteria.</p>
      <button
        @click="showCreateModal = true"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Create your first plugin
      </button>
    </div>

    <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="plugin in filteredPlugins" 
        :key="plugin.id"
        class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200 overflow-hidden group"
      >
        <div class="p-6">
          <div class="flex justify-between items-start mb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{{ plugin.title }}</h3>
            <span class="inline-block px-3 py-1 text-xs font-medium rounded-full"
                  :class="getStatusClass(plugin.status)">
              {{ plugin.status }}
            </span>
          </div>
          
          <p class="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{{ plugin.description }}</p>
          
          <div class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
            <span class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">{{ plugin.category }}</span>
            <span class="font-semibold text-green-600 dark:text-green-400">${{ plugin.price }}</span>
          </div>
          
          <div class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
            <div class="flex items-center">
              <svg class="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
              {{ plugin.avgRating.toFixed(1) }}
            </div>
            <span>{{ plugin._count.purchases }} sold</span>
          </div>
          
          <div class="flex space-x-2">
            <button
              @click="editPlugin(plugin)"
              class="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
            >
              Edit
            </button>
            <button
              @click="viewAnalytics(plugin)"
              class="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium text-sm"
            >
              Analytics
            </button>
            <button
              @click="deletePlugin(plugin.id)"
              class="bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-3 py-2 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Plugin Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-2xl max-h-screen overflow-y-auto border border-gray-200 dark:border-gray-700">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          {{ editingPlugin ? 'Edit Plugin' : 'Create New Plugin' }}
        </h2>
        
        <form @submit.prevent="savePlugin" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title</label>
            <input
              v-model="pluginForm.title"
              type="text"
              required
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
            <textarea
              v-model="pluginForm.description"
              rows="4"
              required
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all resize-none"
            ></textarea>
          </div>
          
          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Price</label>
              <input
                v-model="pluginForm.price"
                type="number"
                step="0.01"
                required
                class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
              <select
                v-model="pluginForm.category"
                required
                class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
              >
                <option value="">Select a category</option>
                <option value="productivity">Productivity</option>
                <option value="development">Development</option>
                <option value="design">Design</option>
                <option value="marketing">Marketing</option>
                <option value="analytics">Analytics</option>
              </select>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tags (comma-separated)</label>
            <input
              v-model="pluginForm.tagsString"
              type="text"
              placeholder="tag1, tag2, tag3"
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
            />
          </div>
          
          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Demo URL</label>
              <input
                v-model="pluginForm.demoUrl"
                type="url"
                class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">GitHub URL</label>
              <input
                v-model="pluginForm.githubUrl"
                type="url"
                class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
              />
            </div>
          </div>
          
          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="closeModal"
              class="px-6 py-3 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="saving"
              class="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all transform hover:scale-105 font-medium shadow-lg"
            >
              <span v-if="saving" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
              <span v-else>{{ editingPlugin ? 'Update' : 'Create' }} Plugin</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { usePluginStore } from '@/stores/plugins'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import type { Plugin } from '@/types'

const pluginStore = usePluginStore()
const authStore = useAuthStore()
const toastStore = useToastStore()

const user = computed(() => authStore.user)

const showCreateModal = ref(false)
const editingPlugin = ref<Plugin | null>(null)
const saving = ref(false)
const statusFilter = ref('')
const categoryFilter = ref('')

const pluginForm = ref({
  title: '',
  description: '',
  price: '',
  category: '',
  tagsString: '',
  demoUrl: '',
  githubUrl: ''
})

const loading = computed(() => pluginStore.loading)
const error = computed(() => pluginStore.error)
const plugins = computed(() => pluginStore.plugins)

const myPlugins = computed(() => {
  return plugins.value.filter(plugin => plugin.author.id === authStore.user?.id)
})

const filteredPlugins = computed(() => {
  let filtered = myPlugins.value
  
  if (statusFilter.value) {
    filtered = filtered.filter(plugin => plugin.status === statusFilter.value)
  }
  
  if (categoryFilter.value) {
    filtered = filtered.filter(plugin => plugin.category === categoryFilter.value)
  }
  
  return filtered
})

const getStatusClass = (status: string) => {
  switch (status) {
    case 'APPROVED':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
    case 'REJECTED':
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
  }
}

const editPlugin = (plugin: Plugin) => {
  editingPlugin.value = plugin
  pluginForm.value = {
    title: plugin.title,
    description: plugin.description,
    price: plugin.price.toString(),
    category: plugin.category,
    tagsString: plugin.tags.join(', '),
    demoUrl: plugin.demoUrl || '',
    githubUrl: plugin.githubUrl || ''
  }
  showCreateModal.value = true
}

const viewAnalytics = (plugin: Plugin) => {
  // TODO: Navigate to analytics for specific plugin
  console.log('View analytics for:', plugin.title)
}

const deletePlugin = async (pluginId: string) => {
  if (confirm('Are you sure you want to delete this plugin?')) {
    try {
      await pluginStore.deletePlugin(pluginId)
    } catch (error) {
      console.error('Failed to delete plugin:', error)
    }
  }
}

const savePlugin = async () => {
  saving.value = true
  
  try {
    const pluginData = {
      title: pluginForm.value.title,
      description: pluginForm.value.description,
      price: parseFloat(pluginForm.value.price),
      category: pluginForm.value.category,
      tags: pluginForm.value.tagsString.split(',').map(tag => tag.trim()).filter(Boolean),
      demoUrl: pluginForm.value.demoUrl || undefined,
      githubUrl: pluginForm.value.githubUrl || undefined,
      authorId: authStore.user!.id
    }

    if (editingPlugin.value) {
      await pluginStore.updatePlugin(editingPlugin.value.id, pluginData)
    } else {
      await pluginStore.createPlugin(pluginData)
    }
    
    closeModal()
  } catch (error) {
    console.error('Failed to save plugin:', error)
  } finally {
    saving.value = false
  }
}

const closeModal = () => {
  showCreateModal.value = false
  editingPlugin.value = null
  pluginForm.value = {
    title: '',
    description: '',
    price: '',
    category: '',
    tagsString: '',
    demoUrl: '',
    githubUrl: ''
  }
}

onMounted(async () => {
  await pluginStore.fetchPlugins()
})
</script>