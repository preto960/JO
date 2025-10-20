<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Developer Dashboard</h1>
        <button
          @click="showCreateModal = true"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Create New Plugin
        </button>
      </div>

      <!-- Stats Overview -->
      <div class="grid md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="text-2xl font-bold text-blue-600">{{ stats.totalPlugins }}</div>
          <div class="text-sm text-gray-600">Total Plugins</div>
        </div>
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="text-2xl font-bold text-green-600">${{ stats.totalRevenue }}</div>
          <div class="text-sm text-gray-600">Total Revenue</div>
        </div>
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="text-2xl font-bold text-purple-600">{{ stats.totalSales }}</div>
          <div class="text-sm text-gray-600">Total Sales</div>
        </div>
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="text-2xl font-bold text-orange-600">{{ stats.avgRating }}</div>
          <div class="text-sm text-gray-600">Average Rating</div>
        </div>
      </div>

      <!-- My Plugins -->
      <div class="bg-white rounded-lg shadow-sm">
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-xl font-semibold">My Plugins</h2>
        </div>
        
        <div v-if="loading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>

        <div v-else-if="error" class="text-center py-12 text-red-600">
          {{ error }}
        </div>

        <div v-else-if="myPlugins.length === 0" class="text-center py-12 text-gray-500">
          You haven't created any plugins yet.
        </div>

        <div v-else class="divide-y divide-gray-200">
          <div 
            v-for="plugin in myPlugins" 
            :key="plugin.id"
            class="p-6 hover:bg-gray-50"
          >
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <div class="flex items-center space-x-3">
                  <h3 class="text-lg font-medium">{{ plugin.title }}</h3>
                  <span class="inline-block px-2 py-1 text-xs rounded-full"
                        :class="getStatusClass(plugin.status)">
                    {{ plugin.status }}
                  </span>
                </div>
                <p class="text-gray-600 mt-1">{{ plugin.description }}</p>
                <div class="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  <span>${{ plugin.price }}</span>
                  <span>•</span>
                  <span>{{ plugin._count.purchases }} sold</span>
                  <span>•</span>
                  <span>★ {{ plugin.avgRating.toFixed(1) }}</span>
                </div>
              </div>
              <div class="flex space-x-2 ml-4">
                <button
                  @click="editPlugin(plugin)"
                  class="text-blue-600 hover:text-blue-800"
                >
                  Edit
                </button>
                <button
                  @click="deletePlugin(plugin.id)"
                  class="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>
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
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { usePluginStore } from '@/stores/plugins'
import { useAuthStore } from '@/stores/auth'
import type { Plugin } from '@/types'

const pluginStore = usePluginStore()
const authStore = useAuthStore()

const showCreateModal = ref(false)
const editingPlugin = ref<Plugin | null>(null)
const saving = ref(false)

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

const stats = computed(() => {
  const userPlugins = myPlugins.value
  const totalRevenue = userPlugins.reduce((sum, plugin) => {
    return sum + (plugin.price * plugin._count.purchases)
  }, 0)
  const totalSales = userPlugins.reduce((sum, plugin) => sum + plugin._count.purchases, 0)
  const avgRating = userPlugins.length > 0 
    ? userPlugins.reduce((sum, plugin) => sum + plugin.avgRating, 0) / userPlugins.length 
    : 0

  return {
    totalPlugins: userPlugins.length,
    totalRevenue: totalRevenue.toFixed(2),
    totalSales,
    avgRating: avgRating.toFixed(1)
  }
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