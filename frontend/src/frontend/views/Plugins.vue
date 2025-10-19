<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <h1 class="text-xl font-semibold text-gray-900">Publisher Dashboard</h1>
            </div>
            <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
              <router-link
                to="/dashboard"
                class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Dashboard
              </router-link>
              <router-link
                to="/plugins"
                class="border-primary-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Plugins
              </router-link>
              <router-link
                to="/analytics"
                class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Analytics
              </router-link>
            </div>
          </div>
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <button
                @click="logout"
                class="btn btn-secondary text-sm"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main content -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <!-- Header -->
        <div class="mb-6 flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">My Plugins</h1>
            <p class="mt-1 text-sm text-gray-600">
              Manage your plugin portfolio
            </p>
          </div>
          <button
            @click="showCreateModal = true"
            class="btn btn-primary"
          >
            Create New Plugin
          </button>
        </div>

        <!-- Plugins Grid -->
        <div v-if="loading" class="text-center py-12">
          <svg class="animate-spin h-8 w-8 text-primary-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="mt-2 text-gray-600">Loading plugins...</p>
        </div>

        <div v-else-if="plugins.length === 0" class="text-center py-12">
          <div class="mx-auto h-12 w-12 text-gray-400">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No plugins</h3>
          <p class="mt-1 text-sm text-gray-500">Get started by creating a new plugin.</p>
          <div class="mt-6">
            <button
              @click="showCreateModal = true"
              class="btn btn-primary"
            >
              Create New Plugin
            </button>
          </div>
        </div>

        <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="plugin in plugins"
            :key="plugin.id"
            class="card hover:shadow-md transition-shadow"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <h3 class="text-lg font-medium text-gray-900">{{ plugin.name }}</h3>
                <p class="text-sm text-gray-500 mt-1">Version {{ plugin.version }}</p>
              </div>
              <span
                :class="getStatusClass(plugin.status)"
                class="px-2 py-1 text-xs font-medium rounded-full"
              >
                {{ plugin.status }}
              </span>
            </div>
            
            <p class="mt-3 text-sm text-gray-600 line-clamp-2">{{ plugin.description }}</p>
            
            <div class="mt-4 flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-900">${{ plugin.price }}</p>
                <p class="text-xs text-gray-500">{{ plugin.category }}</p>
              </div>
              <div class="flex space-x-2">
                <button
                  @click="editPlugin(plugin)"
                  class="text-primary-600 hover:text-primary-800 text-sm font-medium"
                >
                  Edit
                </button>
                <button
                  @click="deletePlugin(plugin.id)"
                  class="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Create/Edit Modal -->
    <div v-if="showCreateModal || editingPlugin" class="fixed z-10 inset-0 overflow-y-auto">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" @click="closeModal">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form @submit.prevent="handleSubmit">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <h3 class="text-lg font-medium text-gray-900 mb-4">
                {{ editingPlugin ? 'Edit Plugin' : 'Create New Plugin' }}
              </h3>
              
              <div class="space-y-4">
                <div>
                  <label for="name" class="label">Plugin Name</label>
                  <input
                    id="name"
                    v-model="form.name"
                    type="text"
                    required
                    class="input"
                    placeholder="My Awesome Plugin"
                  />
                </div>
                
                <div>
                  <label for="description" class="label">Description</label>
                  <textarea
                    id="description"
                    v-model="form.description"
                    rows="3"
                    required
                    class="input"
                    placeholder="Describe what your plugin does..."
                  ></textarea>
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label for="version" class="label">Version</label>
                    <input
                      id="version"
                      v-model="form.version"
                      type="text"
                      required
                      class="input"
                      placeholder="1.0.0"
                    />
                  </div>
                  
                  <div>
                    <label for="category" class="label">Category</label>
                    <select
                      id="category"
                      v-model="form.category"
                      required
                      class="input"
                    >
                      <option value="">Select category</option>
                      <option value="productivity">Productivity</option>
                      <option value="development">Development</option>
                      <option value="design">Design</option>
                      <option value="marketing">Marketing</option>
                      <option value="analytics">Analytics</option>
                      <option value="utility">Utility</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label for="price" class="label">Price ($)</label>
                  <input
                    id="price"
                    v-model.number="form.price"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    class="input"
                    placeholder="9.99"
                  />
                </div>
              </div>
            </div>
            
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                :disabled="submitting"
                class="w-full inline-flex justify-center btn btn-primary sm:ml-3 sm:w-auto"
              >
                <span v-if="submitting">Saving...</span>
                <span v-else>{{ editingPlugin ? 'Update' : 'Create' }}</span>
              </button>
              <button
                type="button"
                @click="closeModal"
                class="mt-3 w-full inline-flex justify-center btn btn-secondary sm:mt-0 sm:ml-3 sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { pluginsAPI } from '@/services/api'

export default {
  name: 'Plugins',
  data() {
    return {
      plugins: [],
      loading: false,
      showCreateModal: false,
      editingPlugin: null,
      submitting: false,
      form: {
        name: '',
        description: '',
        version: '1.0.0',
        category: '',
        price: 0
      }
    }
  },
  async mounted() {
    await this.loadPlugins()
  },
  methods: {
    async loadPlugins() {
      this.loading = true
      try {
        const response = await pluginsAPI.getAll()
        if (response.success) {
          this.plugins = response.plugins
        }
      } catch (error) {
        console.error('Failed to load plugins:', error)
      } finally {
        this.loading = false
      }
    },
    
    async handleSubmit() {
      this.submitting = true
      
      try {
        if (this.editingPlugin) {
          const response = await pluginsAPI.update(this.editingPlugin.id, this.form)
          if (response.success) {
            await this.loadPlugins()
            this.closeModal()
          }
        } else {
          const response = await pluginsAPI.create(this.form)
          if (response.success) {
            await this.loadPlugins()
            this.closeModal()
          }
        }
      } catch (error) {
        console.error('Failed to save plugin:', error)
      } finally {
        this.submitting = false
      }
    },
    
    editPlugin(plugin) {
      this.editingPlugin = plugin
      this.form = {
        name: plugin.name,
        description: plugin.description,
        version: plugin.version,
        category: plugin.category,
        price: plugin.price
      }
    },
    
    async deletePlugin(pluginId) {
      if (!confirm('Are you sure you want to delete this plugin?')) return
      
      try {
        const response = await pluginsAPI.delete(pluginId)
        if (response.success) {
          await this.loadPlugins()
        }
      } catch (error) {
        console.error('Failed to delete plugin:', error)
      }
    },
    
    closeModal() {
      this.showCreateModal = false
      this.editingPlugin = null
      this.form = {
        name: '',
        description: '',
        version: '1.0.0',
        category: '',
        price: 0
      }
    },
    
    getStatusClass(status) {
      switch (status) {
        case 'approved':
          return 'bg-green-100 text-green-800'
        case 'pending':
          return 'bg-yellow-100 text-yellow-800'
        case 'rejected':
          return 'bg-red-100 text-red-800'
        default:
          return 'bg-gray-100 text-gray-800'
      }
    },
    
    logout() {
      localStorage.removeItem('publisher_token')
      localStorage.removeItem('publisher_user')
      this.$router.push('/login')
    }
  }
}
</script>