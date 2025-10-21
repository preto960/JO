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
  
  const updateGeneralSettings = (settings: {
    siteName: string
    siteUrl: string
    siteDescription: string
    defaultLanguage: string
  }) => {
    siteName.value = settings.siteName
    siteUrl.value = settings.siteUrl
    siteDescription.value = settings.siteDescription
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
      
      // Load general settings
      const savedGeneralSettings = localStorage.getItem('generalSettings')
      if (savedGeneralSettings) {
        const general = JSON.parse(savedGeneralSettings)
        siteName.value = general.siteName ?? 'Plugin Marketplace'
        siteUrl.value = general.siteUrl ?? 'https://plugins.example.com'
        siteDescription.value = general.siteDescription ?? 'A marketplace for discovering and sharing amazing plugins'
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
    siteUrl,
    siteDescription,
    defaultLanguage,
    loading,
    
    // Computed
    isRegistrationAllowed,
    
    // Actions
    updateSecuritySettings,
    updateGeneralSettings,
    loadSettings
  }
})