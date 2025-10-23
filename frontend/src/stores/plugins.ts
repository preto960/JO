import { defineStore } from 'pinia'
import { ref } from 'vue'
import { pluginsApi } from '@/services/api'
import type { Plugin, PluginsResponse } from '@/types'

export const usePluginStore = defineStore('plugin', () => {
  const plugins = ref<Plugin[]>([])
  const currentPlugin = ref<Plugin | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  })

  const fetchPlugins = async (params: {
    page?: number
    limit?: number
    category?: string
    search?: string
    sortBy?: string
    sortOrder?: string
  } = {}) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await pluginsApi.getPlugins(params)
      plugins.value = response.plugins || response
      if (response.pagination) {
        pagination.value = response.pagination
      }
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to fetch plugins'
    } finally {
      loading.value = false
    }
  }

  const fetchPluginById = async (id: string) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await pluginsApi.getPlugin(id)
      currentPlugin.value = response.plugin || response
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to fetch plugin'
    } finally {
      loading.value = false
    }
  }

  const createPlugin = async (pluginData: Partial<Plugin>) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await pluginsApi.api.post<Plugin>('/plugins', pluginData)
      plugins.value.unshift(response.data)
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to create plugin'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updatePlugin = async (id: string, pluginData: Partial<Plugin>) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await pluginsApi.api.put<Plugin>(`/plugins/${id}`, pluginData)
      const index = plugins.value.findIndex(p => p.id === id)
      if (index !== -1) {
        plugins.value[index] = response.data
      }
      if (currentPlugin.value?.id === id) {
        currentPlugin.value = response.data
      }
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to update plugin'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deletePlugin = async (id: string) => {
    loading.value = true
    error.value = null
    
    try {
      await pluginsApi.api.delete(`/plugins/${id}`)
      plugins.value = plugins.value.filter(p => p.id !== id)
      if (currentPlugin.value?.id === id) {
        currentPlugin.value = null
      }
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to delete plugin'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Nuevos métodos para consumir plugins del publisher
  const fetchPublisherPlugins = async (params: {
    page?: number
    limit?: number
    category?: string
    search?: string
    sortBy?: string
    sortOrder?: string
  } = {}) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await pluginsApi.getPublisherPlugins(params)
      // Transformar los datos del publisher al formato del frontend si es necesario
      const transformedPlugins = (response.plugins || response).map((plugin: any) => ({
        ...plugin,
        // Asegurar que los campos coincidan con el tipo Plugin
        id: plugin.id,
        title: plugin.title || plugin.name,
        description: plugin.description,
        version: plugin.version,
        price: plugin.price || 0,
        category: plugin.category || 'general',
        tags: plugin.tags || [],
        downloadUrl: plugin.downloadUrl,
        demoUrl: plugin.demoUrl,
        githubUrl: plugin.githubUrl,
        documentationUrl: plugin.documentationUrl,
        authorId: plugin.authorId,
        status: plugin.status,
        isActive: plugin.isActive !== false,
        downloadCount: plugin.downloadCount || 0,
        viewCount: plugin.viewCount || 0,
        totalRevenue: plugin.totalRevenue || 0,
        createdAt: plugin.createdAt,
        updatedAt: plugin.updatedAt
      }))
      
      plugins.value = transformedPlugins
      if (response.pagination) {
        pagination.value = response.pagination
      }
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to fetch publisher plugins'
    } finally {
      loading.value = false
    }
  }

  const fetchApprovedPublisherPlugins = async (params: {
    page?: number
    limit?: number
    category?: string
    search?: string
    sortBy?: string
    sortOrder?: string
  } = {}) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await pluginsApi.getApprovedPublisherPlugins(params)
      // Transformar los datos del publisher al formato del frontend
      const transformedPlugins = (response.plugins || response).map((plugin: any) => ({
        ...plugin,
        id: plugin.id,
        title: plugin.title || plugin.name,
        description: plugin.description,
        version: plugin.version,
        price: plugin.price || 0,
        category: plugin.category || 'general',
        tags: plugin.tags || [],
        downloadUrl: plugin.downloadUrl,
        demoUrl: plugin.demoUrl,
        githubUrl: plugin.githubUrl,
        documentationUrl: plugin.documentationUrl,
        authorId: plugin.authorId,
        status: plugin.status,
        isActive: plugin.isActive !== false,
        downloadCount: plugin.downloadCount || 0,
        viewCount: plugin.viewCount || 0,
        totalRevenue: plugin.totalRevenue || 0,
        createdAt: plugin.createdAt,
        updatedAt: plugin.updatedAt
      }))
      
      plugins.value = transformedPlugins
      if (response.pagination) {
        pagination.value = response.pagination
      }
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to fetch approved publisher plugins'
    } finally {
      loading.value = false
    }
  }

  return {
    plugins,
    currentPlugin,
    loading,
    error,
    pagination,
    fetchPlugins,
    fetchPluginById,
    createPlugin,
    updatePlugin,
    deletePlugin,
    fetchPublisherPlugins,
    fetchApprovedPublisherPlugins
  }
})