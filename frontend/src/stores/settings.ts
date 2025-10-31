import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'

export interface Settings {
  general: {
    siteName: string
    siteLogo: string
    useLogoOnly: boolean
    language: string
    timezone: string
  }
  plugins: {
    autoUpdate: boolean
    hotReload: boolean
    allowExternal: boolean
  }
  security: {
    twoFactor: boolean
    sessionTimeout: number
    passwordExpiration: boolean
  }
  notifications: {
    emailNotifications: boolean
    browserNotifications: boolean
    pluginUpdateNotifications: boolean
  }
  advanced: {
    debugMode: boolean
    cacheDuration: number
  }
}

export const useSettingsStore = defineStore('settings', () => {
  // Load initial settings from localStorage if available
  const loadFromStorage = (): Settings => {
    try {
      const stored = localStorage.getItem('app_settings')
      if (stored) {
        return JSON.parse(stored)
      }
    } catch (error) {
      console.error('Error loading settings from storage:', error)
    }
    
    // Default settings
    return {
      general: {
        siteName: 'Admin Panel',
        siteLogo: '',
        useLogoOnly: false,
        language: 'en',
        timezone: 'UTC'
      },
      plugins: {
        autoUpdate: true,
        hotReload: true,
        allowExternal: false
      },
      security: {
        twoFactor: false,
        sessionTimeout: 30,
        passwordExpiration: false
      },
      notifications: {
        emailNotifications: true,
        browserNotifications: true,
        pluginUpdateNotifications: true
      },
      advanced: {
        debugMode: false,
        cacheDuration: 3600
      }
    }
  }

  const settings = ref<Settings>(loadFromStorage())

  const loading = ref(false)
  const error = ref<string | null>(null)
  const lastFetch = ref<number>(0)
  const CACHE_DURATION = 5000 // 5 seconds cache
  
  // Save settings to localStorage
  const saveToStorage = () => {
    try {
      localStorage.setItem('app_settings', JSON.stringify(settings.value))
    } catch (error) {
      console.error('Error saving settings to storage:', error)
    }
  }

  // Fetch all settings
  const fetchSettings = async (publicOnly = false, forceRefresh = false) => {
    // Check if we have recent data and don't need to refresh
    const now = Date.now()
    if (!forceRefresh && (now - lastFetch.value) < CACHE_DURATION && lastFetch.value > 0) {
      console.log('⚡ Using cached settings')
      return
    }

    loading.value = true
    error.value = null
    try {
      // Use public endpoint if not authenticated or publicOnly flag is true
      const endpoint = publicOnly ? '/settings/public' : '/settings'
      const response = await api.get(endpoint)
      const data = response.data.settings
      
      lastFetch.value = now

      // Parse settings from backend format
      if (data.general) {
        settings.value.general = {
          siteName: data.general.siteName || 'Admin Panel',
          siteLogo: data.general.siteLogo || '',
          useLogoOnly: data.general.useLogoOnly === 'true',
          language: data.general.language || 'en',
          timezone: data.general.timezone || 'UTC'
        }
      }

      if (data.plugins) {
        settings.value.plugins = {
          autoUpdate: data.plugins.autoUpdate === 'true',
          hotReload: data.plugins.hotReload === 'true',
          allowExternal: data.plugins.allowExternal === 'true'
        }
      }

      if (data.security) {
        settings.value.security = {
          twoFactor: data.security.twoFactor === 'true',
          sessionTimeout: parseInt(data.security.sessionTimeout) || 30,
          passwordExpiration: data.security.passwordExpiration === 'true'
        }
      }

      if (data.notifications) {
        settings.value.notifications = {
          emailNotifications: data.notifications.emailNotifications === 'true',
          browserNotifications: data.notifications.browserNotifications === 'true',
          pluginUpdateNotifications: data.notifications.pluginUpdateNotifications === 'true'
        }
      }

      if (data.advanced) {
        settings.value.advanced = {
          debugMode: data.advanced.debugMode === 'true',
          cacheDuration: parseInt(data.advanced.cacheDuration) || 3600
        }
      }
      
      // Save to localStorage after successful fetch
      saveToStorage()
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch settings'
      console.error('Error fetching settings:', err)
      // Don't throw error, just log it - use default values
    } finally {
      loading.value = false
    }
  }

  // Update settings (bulk)
  const updateSettings = async (category: keyof Settings, categorySettings: any) => {
    loading.value = true
    error.value = null
    try {
      // Convert settings to backend format (all values as strings)
      const settingsToUpdate: Record<string, string> = {}

      Object.entries(categorySettings).forEach(([key, value]) => {
        settingsToUpdate[key] = String(value)
      })

      await api.put('/settings/bulk', { settings: settingsToUpdate })

      // Update local state
      settings.value[category] = { ...categorySettings }
      
      // Save to localStorage
      saveToStorage()

      return { success: true }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update settings'
      console.error('Error updating settings:', err)
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  // Reset settings to default
  const resetSettings = async () => {
    loading.value = true
    error.value = null
    try {
      await api.post('/settings/reset')
      await fetchSettings(false, true) // Force refresh
      return { success: true }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to reset settings'
      console.error('Error resetting settings:', err)
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }
  
  // Clear settings from storage (useful for logout)
  const clearStorage = () => {
    try {
      localStorage.removeItem('app_settings')
    } catch (error) {
      console.error('Error clearing settings from storage:', error)
    }
  }

  // Computed: Site name for display
  const siteName = computed(() => settings.value.general.siteName)

  // Computed: Site logo URL
  const siteLogo = computed(() => settings.value.general.siteLogo)

  // Computed: Use logo only (without name)
  const useLogoOnly = computed(() => settings.value.general.useLogoOnly)

  // Computed: Current language
  const language = computed(() => settings.value.general.language)

  // Computed: Is debug mode enabled
  const isDebugMode = computed(() => settings.value.advanced.debugMode)

  return {
    settings,
    loading,
    error,
    siteName,
    siteLogo,
    useLogoOnly,
    language,
    isDebugMode,
    fetchSettings,
    updateSettings,
    resetSettings,
    clearStorage
  }
})

