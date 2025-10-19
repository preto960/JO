<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8 flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">My Plugins</h1>
        <p class="text-gray-600 mt-2">Manage your published plugins</p>
      </div>
      <button
        @click="showCreateModal = true"
        class="btn-primary"
      >
        + New Plugin
      </button>
    </div>

    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      <p class="mt-2 text-gray-600">Loading your plugins...</p>
    </div>

    <div v-else-if="plugins.length > 0" class="space-y-6">
      <div 
        v-for="plugin in plugins" 
        :key="plugin.id"
        class="card"
      >
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-gray-900">{{ plugin.name }}</h3>
            <p class="text-gray-600 mb-2">{{ plugin.description }}</p>
            <div class="flex items-center space-x-4 text-sm text-gray-500">
              <span class="bg-gray-100 px-2 py-1 rounded">{{ plugin.category }}</span>
              <span>Version {{ plugin.version }}</span>
              <span>${{ plugin.price }}</span>
              <span>📥 {{ plugin._count.downloads }} downloads</span>
              <span :class="[
                'px-2 py-1 rounded text-xs font-medium',
                plugin.status === 'approved' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              ]">
                {{ plugin.status }}
              </span>
            </div>
          </div>
          
          <div class="flex items-center space-x-2">
            <button
              @click="editPlugin(plugin)"
              class="btn-secondary text-sm"
            >
              Edit
            </button>
            <button
              @click="viewAnalytics(plugin.id)"
              class="btn-secondary text-sm"
            >
              Analytics
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-12">
      <div class="text-gray-400 text-6xl mb-4">📦</div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">No plugins published</h3>
      <p class="text-gray-600 mb-6">Start by creating your first plugin</p>
      <button
        @click="showCreateModal = true"
        class="btn-primary"
      >
        Create Your First Plugin
      </button>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg max-w-md w-full p-6">
        <h3 class="text-lg font-semibold mb-4">
          {{ editingPlugin ? 'Edit Plugin' : 'Create New Plugin' }}
        </h3>
        
        <form @submit.prevent="savePlugin">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                v-model="pluginForm.name"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                v-model="pluginForm.description"
                required
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Version</label>
                <input
                  v-model="pluginForm.version"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Price</label>
                <input
                  v-model.number="pluginForm.price"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                v-model="pluginForm.category"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Select a category</option>
                <option value="Analytics">Analytics</option>
                <option value="SEO">SEO</option>
                <option value="Social Media">Social Media</option>
                <option value="Productivity">Productivity</option>
                <option value="Marketing">Marketing</option>
              </select>
            </div>
          </div>

          <div v-if="error" class="mt-4 text-red-600 text-sm">
            {{ error }}
          </div>

          <div class="mt-6 flex space-x-3">
            <button
              type="submit"
              :disabled="saving"
              class="flex-1 btn-primary disabled:opacity-50"
            >
              {{ saving ? 'Saving...' : (editingPlugin ? 'Update' : 'Create') }}
            </button>
            <button
              type="button"
              @click="closeModal"
              class="flex-1 btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/services/api'

interface Plugin {
  id: string
  name: string
  description: string
  version: string
  category: string
  price: number
  status: string
  _count: { downloads: number }
}

const plugins = ref<Plugin[]>([])
const loading = ref(true)
const showCreateModal = ref(false)
const editingPlugin = ref<Plugin | null>(null)
const saving = ref(false)
const error = ref('')

const pluginForm = ref({
  name: '',
  description: '',
  version: '1.0.0',
  category: '',
  price: 0
})

const fetchPlugins = async () => {
  try {
    const response = await api.get('/plugins')
    plugins.value = response.data
  } catch (error) {
    console.error('Error fetching plugins:', error)
  } finally {
    loading.value = false
  }
}

const editPlugin = (plugin: Plugin) => {
  editingPlugin.value = plugin
  pluginForm.value = {
    name: plugin.name,
    description: plugin.description,
    version: plugin.version,
    category: plugin.category,
    price: plugin.price
  }
  showCreateModal.value = true
}

const savePlugin = async () => {
  try {
    saving.value = true
    error.value = ''
    
    if (editingPlugin.value) {
      await api.put(`/plugins/${editingPlugin.value.id}`, pluginForm.value)
    } else {
      await api.post('/plugins', pluginForm.value)
    }
    
    await fetchPlugins()
    closeModal()
  } catch (error: any) {
    error.value = error.response?.data?.error || 'Failed to save plugin'
  } finally {
    saving.value = false
  }
}

const closeModal = () => {
  showCreateModal.value = false
  editingPlugin.value = null
  pluginForm.value = {
    name: '',
    description: '',
    version: '1.0.0',
    category: '',
    price: 0
  }
  error.value = ''
}

const viewAnalytics = (pluginId: string) => {
  // Navigate to analytics with plugin filter
  console.log('View analytics for plugin:', pluginId)
}

onMounted(() => {
  fetchPlugins()
})
</script>