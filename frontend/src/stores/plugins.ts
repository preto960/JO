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

interface OperationStep {
  label: string
  status: 'pending' | 'loading' | 'completed'
}

export const usePluginsStore = defineStore('plugins', () => {
  const installedPlugins = ref<InstalledPlugin[]>([])
  const loading = ref(false)
  
  // Modal state
  const operationModal = ref({
    isOpen: false,
    status: 'loading' as 'loading' | 'success' | 'error',
    operation: 'install' as 'install' | 'update' | 'uninstall',
    pluginName: '',
    steps: [] as OperationStep[]
  })

  const showOperationModal = (operation: 'install' | 'update' | 'uninstall', pluginName: string) => {
    operationModal.value = {
      isOpen: true,
      status: 'loading',
      operation,
      pluginName,
      steps: [
        { label: 'Preparing...', status: 'loading' },
        { label: 'Processing plugin', status: 'pending' },
        { label: 'Finalizing', status: 'pending' }
      ]
    }
  }

  const updateOperationStep = (stepIndex: number, status: 'loading' | 'completed') => {
    if (operationModal.value.steps[stepIndex]) {
      operationModal.value.steps[stepIndex].status = status
      if (status === 'completed' && stepIndex < operationModal.value.steps.length - 1) {
        operationModal.value.steps[stepIndex + 1].status = 'loading'
      }
    }
  }

  const completeOperation = (success: boolean) => {
    operationModal.value.status = success ? 'success' : 'error'
    operationModal.value.steps.forEach(step => {
      if (step.status === 'loading') step.status = 'completed'
    })
  }

  const closeOperationModal = () => {
    operationModal.value.isOpen = false
  }

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
    operationModal,
    fetchInstalledPlugins,
    installPlugin,
    uninstallPlugin,
    togglePlugin,
    updatePlugin,
    updatePluginConfig,
    showOperationModal,
    updateOperationStep,
    completeOperation,
    closeOperationModal
  }
})

