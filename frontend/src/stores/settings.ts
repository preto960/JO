import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
  // Security settings
  const allowRegistration = ref(true)
  const requireEmailVerification = ref(false)
  const requirePluginApproval = ref(true)
  
  // General settings
  const siteName = ref('Plugin Marketplace')
  const siteUrl = ref('https://plugins.example.com')
  const siteDescription = ref('A marketplace for discovering and sharing amazing plugins')
  const defaultLanguage = ref('en')
  
  // Loading state
  const loading = ref(false)
  
  // Computed properties
  const isRegistrationAllowed = computed(() => allowRegistration.value)
  
  // Actions
  const updateSecuritySettings = (settings: {
    allowRegistration: boolean
    requireEmailVerification: boolean
    requirePluginApproval: boolean
  }) => {
    allowRegistration.value = settings.allowRegistration
    requireEmailVerification.value = settings.requireEmailVerification
    requirePluginApproval.value = settings.requirePluginApproval
    
    // Save to localStorage for persistence
    localStorage.setItem('securitySettings', JSON.stringify(settings))
  }
  
  const updateSiteSettings = (settings: {
    siteName: string
  }) => {
    siteName.value = settings.siteName
    
    // Save to localStorage for persistence
    localStorage.setItem('siteSettings', JSON.stringify(settings))
  }

  const updateGeneralSettings = (settings: {
    siteName: string
    defaultLanguage: string
  }) => {
    siteName.value = settings.siteName
    defaultLanguage.value = settings.defaultLanguage
    
    // Save to localStorage for persistence
    localStorage.setItem('generalSettings', JSON.stringify(settings))
  }
  
  const loadSettings = () => {
    try {
      // Load security settings
      const savedSecuritySettings = localStorage.getItem('securitySettings')
      if (savedSecuritySettings) {
        const security = JSON.parse(savedSecuritySettings)
        allowRegistration.value = security.allowRegistration ?? true
        requireEmailVerification.value = security.requireEmailVerification ?? false
        requirePluginApproval.value = security.requirePluginApproval ?? true
      }
      
      // Load site settings
      const savedSiteSettings = localStorage.getItem('siteSettings')
      if (savedSiteSettings) {
        const site = JSON.parse(savedSiteSettings)
        siteName.value = site.siteName ?? 'Plugin Marketplace'
      }
      
      // Load general settings
      const savedGeneralSettings = localStorage.getItem('generalSettings')
      if (savedGeneralSettings) {
        const general = JSON.parse(savedGeneralSettings)
        siteName.value = general.siteName ?? 'Plugin Marketplace'
        defaultLanguage.value = general.defaultLanguage ?? 'en'
      }
    } catch (error) {
      console.error('Error loading settings:', error)
    }
  }
  
  return {
    // State
    allowRegistration,
    requireEmailVerification,
    requirePluginApproval,
    siteName,
    defaultLanguage,
    loading,
    
    // Computed
    isRegistrationAllowed,
    
    // Actions
    updateSecuritySettings,
    updateSiteSettings,
    updateGeneralSettings,
    loadSettings
  }
})