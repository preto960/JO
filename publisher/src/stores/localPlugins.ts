import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'
import type { LocalPlugin, PluginBuildResult } from '@/types/plugin'

export const useLocalPluginsStore = defineStore('localPlugins', () => {
  const plugins = ref<LocalPlugin[]>([])
  const currentPlugin = ref<LocalPlugin | null>(null)
  const loading = ref(false)
  const building = ref(false)
  const pluginsDirectory = ref('')

  /**
   * Detecta y carga todos los plugins locales
   */
  const fetchLocalPlugins = async () => {
    loading.value = true
    try {
      const response = await api.get('/local-plugins')
      plugins.value = response.data.plugins
      pluginsDirectory.value = response.data.pluginsDirectory
      return { success: true }
    } catch (error: any) {
      console.error('Failed to fetch local plugins:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch local plugins'
      }
    } finally {
      loading.value = false
    }
  }

  /**
   * Obtiene detalles de un plugin específico
   */
  const fetchPluginDetails = async (slug: string) => {
    loading.value = true
    try {
      const response = await api.get(`/local-plugins/${slug}`)
      currentPlugin.value = response.data
      return { success: true, plugin: response.data }
    } catch (error: any) {
      console.error('Failed to fetch plugin details:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch plugin details'
      }
    } finally {
      loading.value = false
    }
  }

  /**
   * Construye un plugin
   */
  const buildPlugin = async (slug: string): Promise<{ success: boolean; message?: string; result?: PluginBuildResult }> => {
    building.value = true
    try {
      const response = await api.post(`/local-plugins/${slug}/build`)
      return {
        success: true,
        result: response.data.result
      }
    } catch (error: any) {
      console.error('Failed to build plugin:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to build plugin'
      }
    } finally {
      building.value = false
    }
  }

  /**
   * Construye y publica un plugin en un solo paso
   */
  const buildAndPublish = async (slug: string): Promise<{ success: boolean; message?: string; data?: any }> => {
    building.value = true
    try {
      const response = await api.post(`/local-plugins/${slug}/build-and-publish`)
      
      // Recargar la lista de plugins
      await fetchLocalPlugins()
      
      return {
        success: true,
        message: response.data.message,
        data: response.data
      }
    } catch (error: any) {
      console.error('Failed to build and publish plugin:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to build and publish plugin'
      }
    } finally {
      building.value = false
    }
  }

  /**
   * Construye para sandbox (testing)
   */
  const buildForSandbox = async (slug: string): Promise<{ success: boolean; message?: string; sandboxUrl?: string }> => {
    building.value = true
    try {
      const response = await api.post(`/local-plugins/${slug}/sandbox`)
      return {
        success: true,
        message: response.data.message,
        sandboxUrl: response.data.sandboxUrl
      }
    } catch (error: any) {
      console.error('Failed to build for sandbox:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to build for sandbox'
      }
    } finally {
      building.value = false
    }
  }

  /**
   * Obtiene plugins válidos
   */
  const getValidPlugins = () => {
    return plugins.value.filter(p => p.isValid)
  }

  /**
   * Obtiene plugins con errores
   */
  const getInvalidPlugins = () => {
    return plugins.value.filter(p => !p.isValid)
  }

  return {
    plugins,
    currentPlugin,
    loading,
    building,
    pluginsDirectory,
    fetchLocalPlugins,
    fetchPluginDetails,
    buildPlugin,
    buildAndPublish,
    buildForSandbox,
    getValidPlugins,
    getInvalidPlugins
  }
})


