import { defineStore } from 'pinia'
import { ref } from 'vue'
import { pluginsApi } from '@/services/api'
import type { Plugin } from '@/types'

export const usePluginStore = defineStore('plugin', () => {
  const plugins = ref<Plugin[]>([])
  const currentPlugin = ref<Plugin | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchPlugins = async () => {
    loading.value = true
    error.value = null
    
    try {
      const response = await pluginsApi.getPlugins()
      plugins.value = response.plugins || response
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
      const response = await pluginsApi.createPlugin(pluginData)
      plugins.value.unshift(response)
      return response
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
      const response = await pluginsApi.updatePlugin(id, pluginData)
      const index = plugins.value.findIndex(p => p.id === id)
      if (index !== -1) {
        plugins.value[index] = response
      }
      if (currentPlugin.value?.id === id) {
        currentPlugin.value = response
      }
      return response
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
      await pluginsApi.deletePlugin(id)
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
    fetchPlugins,
    fetchPluginById,
    createPlugin,
    updatePlugin,
    deletePlugin
  }
})