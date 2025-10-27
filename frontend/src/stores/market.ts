import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'

interface MarketPlugin {
  id: string
  name: string
  slug: string
  description: string
  longDescription?: string
  version: string
  price?: number
  downloadCount: number
  rating: number
  category: string
  tags?: string[]
  icon?: string
  screenshots?: string[]
  developer: {
    id: string
    firstName: string
    lastName: string
  }
}

export const useMarketStore = defineStore('market', () => {
  const availablePlugins = ref<MarketPlugin[]>([])
  const currentPlugin = ref<MarketPlugin | null>(null)
  const loading = ref(false)
  const pagination = ref({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  })

  const fetchAvailablePlugins = async (params: {
    page?: number
    limit?: number
    category?: string
    search?: string
    minPrice?: number
    maxPrice?: number
  } = {}) => {
    loading.value = true
    try {
      const response = await api.get('/market/plugins', { params })
      // El Publisher devuelve directamente el array o un objeto con plugins
      if (Array.isArray(response.data)) {
        availablePlugins.value = response.data
      } else {
        availablePlugins.value = response.data.plugins || response.data.data || []
        if (response.data.pagination) {
          pagination.value = response.data.pagination
        }
      }
    } catch (error) {
      console.error('Failed to fetch available plugins:', error)
      availablePlugins.value = []
    } finally {
      loading.value = false
    }
  }

  const fetchPluginDetail = async (id: string) => {
    loading.value = true
    try {
      const response = await api.get(`/market/plugins/${id}`)
      currentPlugin.value = response.data
      return response.data
    } catch (error) {
      console.error('Failed to fetch plugin detail:', error)
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    availablePlugins,
    currentPlugin,
    loading,
    pagination,
    fetchAvailablePlugins,
    fetchPluginDetail
  }
})

