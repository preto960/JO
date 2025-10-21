<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-semibold text-gray-900">My Plugins</h1>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-600">Welcome, {{ user?.username }}</span>
            <button 
              @click="logout"
              class="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Navigation -->
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex space-x-8">
          <router-link 
            to="/" 
            class="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
          >
            Dashboard
          </router-link>
          <router-link 
            to="/plugins" 
            class="inline-flex items-center px-1 pt-1 border-b-2 border-blue-500 text-sm font-medium text-gray-900"
          >
            My Plugins
          </router-link>
          <router-link 
            to="/analytics" 
            class="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
          >
            Analytics
          </router-link>
          <router-link 
            to="/settings" 
            class="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
          >
            Settings
          </router-link>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="flex justify-between items-center mb-8">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">My Plugins</h1>
            <p class="text-gray-600 mt-2">Manage your plugin portfolio</p>
          </div>
          <button
            @click="showCreateModal = true"
            class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Create New Plugin
          </button>
        </div>

        <!-- Filters -->
        <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div class="flex flex-wrap gap-4">
            <select
              v-model="statusFilter"
              class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Status</option>
              <option value="DRAFT">Draft</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
            
            <select
              v-model="categoryFilter"
              class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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

        <!-- Plugins Grid -->
        <div v-if="loading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>

        <div v-else-if="error" class="text-center py-12 text-red-600">
          {{ error }}
        </div>

        <div v-else-if="filteredPlugins.length === 0" class="text-center py-12 text-gray-500">
          No plugins found matching your criteria.
        </div>

        <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="plugin in filteredPlugins" 
            :key="plugin.id"
            class="bg-white rounded-lg shadow-sm hover:shadow-md transition"
          >
            <div class="p-6">
              <div class="flex justify-between items-start mb-4">
                <h3 class="text-lg font-semibold">{{ plugin.title }}</h3>
                <span class="inline-block px-2 py-1 text-xs rounded-full"
                      :class="getStatusClass(plugin.status)">
                  {{ plugin.status }}
                </span>
              </div>
              
              <p class="text-gray-600 mb-4 line-clamp-2">{{ plugin.description }}</p>
              
              <div class="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>{{ plugin.category }}</span>
                <span>${{ plugin.price }}</span>
              </div>
              
              <div class="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>★ {{ plugin.avgRating.toFixed(1) }}</span>
                <span>{{ plugin._count.purchases }} sold</span>
              </div>
              
              <div class="flex space-x-2">
                <button
                  @click="editPlugin(plugin)"
                  class="flex-1 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition"
                >
                  Edit
                </button>
                <button
                  @click="viewAnalytics(plugin)"
                  class="flex-1 bg-gray-200 text-gray-700 px-3 py-2 rounded hover:bg-gray-300 transition"
                >
                  Analytics
                </button>
                <button
                  @click="deletePlugin(plugin.id)"
                  class="bg-red-100 text-red-700 px-3 py-2 rounded hover:bg-red-200 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Create/Edit Plugin Modal -->
        <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <h2 class="text-xl font-semibold mb-4">
              {{ editingPlugin ? 'Edit Plugin' : 'Create New Plugin' }}
            </h2>
            
            <form @submit.prevent="savePlugin" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Title</label>
                <input
                  v-model="pluginForm.title"
                  type="text"
                  required
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  v-model="pluginForm.description"
                  rows="4"
                  required
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Price</label>
                  <input
                    v-model="pluginForm.price"
                    type="number"
                    step="0.01"
                    required
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    v-model="pluginForm.category"
                    required
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                <label class="block text-sm font-medium text-gray-700">Tags (comma-separated)</label>
                <input
                  v-model="pluginForm.tagsString"
                  type="text"
                  placeholder="tag1, tag2, tag3"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Demo URL</label>
                  <input
                    v-model="pluginForm.demoUrl"
                    type="url"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700">GitHub URL</label>
                  <input
                    v-model="pluginForm.githubUrl"
                    type="url"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div class="flex justify-end space-x-3">
                <button
                  type="button"
                  @click="closeModal"
                  class="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  :disabled="saving"
                  class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  <span v-if="saving">Saving...</span>
                  <span v-else>{{ editingPlugin ? 'Update' : 'Create' }} Plugin</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePluginStore } from '@/stores/plugins'
import { useAuthStore } from '@/stores/auth'
import type { Plugin } from '@/types'

const router = useRouter()
const pluginStore = usePluginStore()
const authStore = useAuthStore()

const user = computed(() => authStore.user)

const logout = async () => {
  try {
    await authStore.logout()
    router.push('/login')
  } catch (error) {
    console.error('Failed to logout')
  }
}

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
      return 'bg-green-100 text-green-800'
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800'
    case 'REJECTED':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
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