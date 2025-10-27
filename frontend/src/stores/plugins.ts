import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'

interface InstalledPlugin {
  id: string
  publisherPluginId: string
  name: string
  slug: string
  version: string
  description?: string
  packageUrl?: string
  manifest: any
  config?: any
  status: string
  isActive: boolean
  installedAt: string
  updatedAt: string
}

export const usePluginsStore = defineStore('plugins', () => {
  const installedPlugins = ref<InstalledPlugin[]>([])
  const loading = ref(false)

  const fetchInstalledPlugins = async (filters?: { isActive?: boolean }) => {
    loading.value = true
    try {
      const response = await api.get('/installed-plugins', { params: filters })
      installedPlugins.value = response.data
    } catch (error) {
      console.error('Failed to fetch installed plugins:', error)
    } finally {
      loading.value = false
    }
  }

  const installPlugin = async (publisherPluginId: string) => {
    try {
      const response = await api.post('/installed-plugins/install', { publisherPluginId })
      await fetchInstalledPlugins()
      return { success: true, plugin: response.data }
    } catch (error: any) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to install plugin' 
      }
    }
  }

  const uninstallPlugin = async (id: string) => {
    try {
      await api.delete(`/installed-plugins/${id}`)
      installedPlugins.value = installedPlugins.value.filter(p => p.id !== id)
      return { success: true }
    } catch (error: any) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to uninstall plugin' 
      }
    }
  }

  const togglePlugin = async (id: string, isActive: boolean) => {
    try {
      const response = await api.patch(`/installed-plugins/${id}/toggle`, { isActive })
      const index = installedPlugins.value.findIndex(p => p.id === id)
      if (index !== -1) {
        installedPlugins.value[index] = response.data
      }
      return { success: true }
    } catch (error: any) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to toggle plugin' 
      }
    }
  }

  const updatePlugin = async (id: string) => {
    try {
      const response = await api.post(`/installed-plugins/${id}/update`)
      const index = installedPlugins.value.findIndex(p => p.id === id)
      if (index !== -1) {
        installedPlugins.value[index] = response.data.plugin
      }
      return { success: true, message: response.data.message }
    } catch (error: any) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to update plugin' 
      }
    }
  }

  const updatePluginConfig = async (id: string, config: any) => {
    try {
      const response = await api.patch(`/installed-plugins/${id}/config`, { config })
      const index = installedPlugins.value.findIndex(p => p.id === id)
      if (index !== -1) {
        installedPlugins.value[index] = response.data
      }
      return { success: true }
    } catch (error: any) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to update plugin config' 
      }
    }
  }

  return {
    installedPlugins,
    loading,
    fetchInstalledPlugins,
    installPlugin,
    uninstallPlugin,
    togglePlugin,
    updatePlugin,
    updatePluginConfig
  }
})

