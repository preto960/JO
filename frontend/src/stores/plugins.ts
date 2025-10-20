import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'
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
      const response = await api.get<PluginsResponse>('/plugins', { params })
      plugins.value = response.data.plugins
      pagination.value = response.data.pagination
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
      const response = await api.get<{ plugin: Plugin }>(`/plugins/${id}`)
      currentPlugin.value = response.data.plugin
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
      const response = await api.post<Plugin>('/plugins', pluginData)
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
      const response = await api.put<Plugin>(`/plugins/${id}`, pluginData)
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
      await api.delete(`/plugins/${id}`)
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
    deletePlugin
  }
})