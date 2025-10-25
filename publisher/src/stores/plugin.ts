import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'

interface Plugin {
  id: string
  name: string
  slug: string
  description: string
  longDescription?: string
  version?: string
  price?: number
  downloadCount: number
  rating: number
  reviewCount: number
  icon?: string
  screenshots?: string[]
  documentationUrl?: string
  supportUrl?: string
  demoUrl?: string
  repositoryUrl?: string
  status: string
  category: string
  tags?: string[]
  aiAnalysis?: any
  seoMetadata?: any
  isPublic: boolean
  featuredAt?: string
  createdAt: string
  updatedAt: string
  developer: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
}

export const usePluginStore = defineStore('plugin', () => {
  const plugins = ref<Plugin[]>([])
  const currentPlugin = ref<Plugin | null>(null)
  const loading = ref(false)
  const pagination = ref({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  })

  const fetchPlugins = async (params: {
    page?: number
    limit?: number
    category?: string
    status?: string
    search?: string
  } = {}) => {
    loading.value = true
    try {
      const response = await api.get('/plugins', { params })
      plugins.value = response.data.plugins
      pagination.value = response.data.pagination
    } catch (error) {
      console.error('Failed to fetch plugins:', error)
    } finally {
      loading.value = false
    }
  }

  const fetchMyPlugins = async (params: {
    page?: number
    limit?: number
    status?: string
  } = {}) => {
    loading.value = true
    try {
      const response = await api.get('/plugins/my/plugins', { params })
      plugins.value = response.data.plugins
      pagination.value = response.data.pagination
    } catch (error) {
      console.error('Failed to fetch my plugins:', error)
    } finally {
      loading.value = false
    }
  }

  const fetchPlugin = async (id: string) => {
    loading.value = true
    try {
      const response = await api.get(`/plugins/${id}`)
      currentPlugin.value = response.data.plugin
      return response.data.plugin
    } catch (error) {
      console.error('Failed to fetch plugin:', error)
      return null
    } finally {
      loading.value = false
    }
  }

  const createPlugin = async (pluginData: Partial<Plugin>) => {
    loading.value = true
    try {
      const response = await api.post('/plugins', pluginData)
      const newPlugin = response.data.plugin
      plugins.value.unshift(newPlugin)
      return { success: true, plugin: newPlugin }
    } catch (error: any) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to create plugin' 
      }
    } finally {
      loading.value = false
    }
  }

  const updatePlugin = async (id: string, pluginData: Partial<Plugin>) => {
    loading.value = true
    try {
      const response = await api.put(`/plugins/${id}`, pluginData)
      const updatedPlugin = response.data.plugin
      
      // Update in plugins array
      const index = plugins.value.findIndex(p => p.id === id)
      if (index !== -1) {
        plugins.value[index] = updatedPlugin
      }
      
      // Update current plugin if it's the same
      if (currentPlugin.value?.id === id) {
        currentPlugin.value = updatedPlugin
      }
      
      return { success: true, plugin: updatedPlugin }
    } catch (error: any) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to update plugin' 
      }
    } finally {
      loading.value = false
    }
  }

  const deletePlugin = async (id: string) => {
    loading.value = true
    try {
      await api.delete(`/plugins/${id}`)
      
      // Remove from plugins array
      plugins.value = plugins.value.filter(p => p.id !== id)
      
      // Clear current plugin if it's the same
      if (currentPlugin.value?.id === id) {
        currentPlugin.value = null
      }
      
      return { success: true }
    } catch (error: any) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to delete plugin' 
      }
    } finally {
      loading.value = false
    }
  }

  const submitForReview = async (id: string) => {
    try {
      const response = await api.post(`/plugins/${id}/submit`)
      const updatedPlugin = response.data.plugin
      
      // Update in plugins array
      const index = plugins.value.findIndex(p => p.id === id)
      if (index !== -1) {
        plugins.value[index] = updatedPlugin
      }
      
      return { success: true, plugin: updatedPlugin }
    } catch (error: any) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to submit plugin for review' 
      }
    }
  }

  return {
    plugins,
    currentPlugin,
    loading,
    pagination,
    fetchPlugins,
    fetchMyPlugins,
    fetchPlugin,
    createPlugin,
    updatePlugin,
    deletePlugin,
    submitForReview
  }
})