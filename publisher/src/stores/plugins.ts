import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { pluginsApi } from '@/services/api'
import type { Plugin } from '@/types'
import { useToastStore } from './toast'

export const usePluginStore = defineStore('plugins', () => {
  const plugins = ref<Plugin[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const toastStore = useToastStore()

  const fetchPlugins = async () => {
    loading.value = true
    error.value = null
    
    try {
      const response = await pluginsApi.getPlugins()
      plugins.value = response.plugins || response
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to fetch plugins'
      toastStore.error('Failed to load plugins')
    } finally {
      loading.value = false
    }
  }

  const fetchMyPlugins = async (params?: any) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await pluginsApi.getMyPlugins(params)
      return response.plugins || response
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to fetch my plugins'
      toastStore.error('Failed to load my plugins')
      return []
    } finally {
      loading.value = false
    }
  }

  const getPlugin = async (id: string) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await pluginsApi.getPlugin(id)
      return response.data?.plugin || response.plugin || response
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to fetch plugin'
      toastStore.error('Failed to load plugin details')
      return null
    } finally {
      loading.value = false
    }
  }

  const createPlugin = async (pluginData: Partial<Plugin>) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await pluginsApi.createPlugin(pluginData)
      const newPlugin = response.data?.plugin || response.plugin || response
      
      plugins.value.push(newPlugin)
      toastStore.success('Plugin created successfully!')
      return newPlugin
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to create plugin'
      toastStore.error(error.value || 'Failed to create plugin')
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
      const updatedPlugin = response.data?.plugin || response.plugin || response
      
      const index = plugins.value.findIndex(p => p.id === id)
      if (index > -1) {
        plugins.value[index] = updatedPlugin
      }
      
      toastStore.success('Plugin updated successfully!')
      return updatedPlugin
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to update plugin'
      toastStore.error(error.value || 'Failed to update plugin')
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
      
      const index = plugins.value.findIndex(p => p.id === id)
      if (index > -1) {
        plugins.value.splice(index, 1)
      }
      
      toastStore.success('Plugin deleted successfully!')
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to delete plugin'
      toastStore.error(error.value || 'Failed to delete plugin')
      throw err
    } finally {
      loading.value = false
    }
  }

  const getMyPlugins = (userId: string) => {
    return computed(() => {
      return plugins.value.filter(plugin => plugin.author.id === userId)
    })
  }

  const getPluginById = (id: string) => {
    return computed(() => {
      return plugins.value.find(plugin => plugin.id === id)
    })
  }

  return {
    plugins,
    loading,
    error,
    fetchPlugins,
    fetchMyPlugins,
    getPlugin,
    createPlugin,
    updatePlugin,
    deletePlugin,
    getMyPlugins,
    getPluginById
  }
})