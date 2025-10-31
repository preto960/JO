<template>
  <div class="space-y-4">
    <!-- Page Title -->
    <div class="mb-4">
      <h1 class="text-xl font-bold text-gray-900 dark:text-white">Settings</h1>
      <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">Configure system preferences</p>
    </div>

    <!-- Settings Layout with Sidebar -->
    <div class="flex gap-4">
      <!-- Sidebar -->
      <div class="w-64 flex-shrink-0">
        <div class="card space-y-1">
          <button
            v-for="section in sections"
            :key="section.id"
            @click="activeSection = section.id"
            class="w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-colors"
            :class="activeSection === section.id 
              ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' 
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'"
          >
            <component :is="section.icon" class="w-5 h-5 flex-shrink-0" />
            <span>{{ section.name }}</span>
          </button>
        </div>
      </div>

      <!-- Content Area -->
      <div class="flex-1">
        
        <!-- General Settings -->
        <div v-if="activeSection === 'general'" class="card">
          <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-4">General Settings</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">Site Name</p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">The name of your application</p>
              </div>
              <input 
                v-model="generalSettings.siteName" 
                type="text" 
                class="input-field w-64 text-sm py-2"
              />
            </div>

            <div class="p-3 border-b border-gray-200 dark:border-gray-700">
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-900 dark:text-white">Site Logo</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Upload SVG or PNG (max 512x512px, 2MB)
                  </p>
                </div>
                <div class="w-80 space-y-3">
                  <!-- File Upload -->
                  <div class="flex gap-2">
                    <label class="flex-1 cursor-pointer">
                      <input 
                        type="file" 
                        accept=".svg,.png,image/svg+xml,image/png"
                        @change="handleLogoUpload"
                        class="hidden"
                        ref="logoFileInput"
                      />
                      <div class="btn-secondary text-sm w-full text-center py-2">
                        <span v-if="!uploadingLogo">Choose File</span>
                        <span v-else>Uploading...</span>
                      </div>
                    </label>
                    <button 
                      v-if="generalSettings.siteLogo"
                      @click="clearLogo"
                      class="px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                      title="Remove logo"
                    >
                      ✕
                    </button>
                  </div>

                  <!-- OR Divider -->
                  <div class="flex items-center gap-2">
                    <div class="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
                    <span class="text-xs text-gray-500 dark:text-gray-400">OR</span>
                    <div class="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
                  </div>

                  <!-- URL Input -->
                  <input 
                    v-model="generalSettings.siteLogo" 
                    type="url" 
                    placeholder="https://example.com/logo.png"
                    class="input-field w-full text-sm py-2"
                  />

                  <!-- Preview -->
                  <div v-if="generalSettings.siteLogo" class="flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-700/30 rounded border border-gray-200 dark:border-gray-600">
                    <img 
                      :src="generalSettings.siteLogo" 
                      alt="Logo preview" 
                      class="max-h-16 max-w-full object-contain" 
                      @error="handleLogoError"
                      @load="handleLogoLoad"
                    />
                  </div>

                  <!-- File Info -->
                  <div v-if="logoFileInfo" class="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                    <p>📄 {{ logoFileInfo.name }}</p>
                    <p>📐 {{ logoFileInfo.dimensions }}</p>
                    <p>💾 {{ logoFileInfo.size }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">Show Logo Only</p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Hide site name and show only the logo</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer toggle-switch">
                <input type="checkbox" v-model="generalSettings.useLogoOnly" class="sr-only peer">
                <div class="toggle-track">
                  <div class="toggle-thumb"></div>
                </div>
              </label>
            </div>

            <div class="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">Language</p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Default system language</p>
              </div>
              <select v-model="generalSettings.language" class="input-field w-64 text-sm py-2">
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>
            </div>

            <div class="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">Timezone</p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">System timezone</p>
              </div>
              <select v-model="generalSettings.timezone" class="input-field w-64 text-sm py-2">
                <option value="UTC">UTC</option>
                <option value="America/New_York">America/New York</option>
                <option value="Europe/London">Europe/London</option>
              </select>
            </div>

            <div class="flex justify-end pt-2">
              <button @click="saveGeneralSettings" class="btn-primary text-sm">
                Save Changes
              </button>
            </div>
          </div>
        </div>

        <!-- Plugins Settings -->
        <div v-if="activeSection === 'plugins'" class="card">
          <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-4">Plugin Settings</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">Auto-update Plugins</p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Automatically update plugins when new versions are available</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer toggle-switch">
                <input type="checkbox" v-model="pluginSettings.autoUpdate" class="sr-only peer">
                <div class="toggle-track">
                  <div class="toggle-thumb"></div>
                </div>
              </label>
            </div>

            <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">Plugin Hot Reload</p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Enable hot reload for plugin development</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer toggle-switch">
                <input type="checkbox" v-model="pluginSettings.hotReload" class="sr-only peer">
                <div class="toggle-track">
                  <div class="toggle-thumb"></div>
                </div>
              </label>
            </div>

            <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">Allow External Plugins</p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Allow installation of plugins from external sources</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer toggle-switch">
                <input type="checkbox" v-model="pluginSettings.allowExternal" class="sr-only peer">
                <div class="toggle-track">
                  <div class="toggle-thumb"></div>
                </div>
              </label>
            </div>

            <div class="flex justify-end pt-2">
              <button @click="savePluginSettings" class="btn-primary text-sm">
                Save Changes
              </button>
            </div>
          </div>
        </div>

        <!-- Security Settings -->
        <div v-if="activeSection === 'security'" class="card">
          <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-4">Security Settings</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">Two-Factor Authentication</p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Require 2FA for all users</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer toggle-switch">
                <input type="checkbox" v-model="securitySettings.twoFactor" class="sr-only peer">
                <div class="toggle-track">
                  <div class="toggle-thumb"></div>
                </div>
              </label>
            </div>

            <div class="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">Session Timeout</p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Automatic logout after inactivity (minutes)</p>
              </div>
              <input 
                v-model="securitySettings.sessionTimeout" 
                type="number" 
                min="5"
                max="1440"
                class="input-field w-32 text-sm py-2"
              />
            </div>

            <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">Password Expiration</p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Force password change every 90 days</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer toggle-switch">
                <input type="checkbox" v-model="securitySettings.passwordExpiration" class="sr-only peer">
                <div class="toggle-track">
                  <div class="toggle-thumb"></div>
                </div>
              </label>
            </div>

            <div class="flex justify-end pt-2">
              <button @click="saveSecuritySettings" class="btn-primary text-sm">
                Save Changes
              </button>
            </div>
          </div>
        </div>

        <!-- Permissions Settings -->
        <div v-if="activeSection === 'permissions'">
          <PermissionsMatrix />
        </div>

        <!-- Notifications Settings -->
        <div v-if="activeSection === 'notifications'" class="card">
          <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-4">Notification Settings</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">Email Notifications</p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Receive email notifications for system events</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer toggle-switch">
                <input type="checkbox" v-model="notificationSettings.email" class="sr-only peer">
                <div class="toggle-track">
                  <div class="toggle-thumb"></div>
                </div>
              </label>
            </div>

            <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">Browser Notifications</p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Show browser push notifications</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer toggle-switch">
                <input type="checkbox" v-model="notificationSettings.browser" class="sr-only peer">
                <div class="toggle-track">
                  <div class="toggle-thumb"></div>
                </div>
              </label>
            </div>

            <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">Plugin Updates</p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Notify when plugin updates are available</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer toggle-switch">
                <input type="checkbox" v-model="notificationSettings.pluginUpdates" class="sr-only peer">
                <div class="toggle-track">
                  <div class="toggle-thumb"></div>
                </div>
              </label>
            </div>

            <div class="flex justify-end pt-2">
              <button @click="saveNotificationSettings" class="btn-primary text-sm">
                Save Changes
              </button>
            </div>
          </div>
        </div>

        <!-- Advanced Settings -->
        <div v-if="activeSection === 'advanced'" class="card">
          <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-4">Advanced Settings</h3>
          <div class="space-y-4">
            <div class="p-4 border border-yellow-200 dark:border-yellow-900/50 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div class="flex items-start space-x-3">
                <AlertTriangle class="w-5 h-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">Warning</p>
                  <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">These settings can affect system stability. Change with caution.</p>
                </div>
              </div>
            </div>

            <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">Debug Mode</p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Enable detailed logging and error messages</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer toggle-switch">
                <input type="checkbox" v-model="advancedSettings.debugMode" class="sr-only peer">
                <div class="toggle-track">
                  <div class="toggle-thumb"></div>
                </div>
              </label>
            </div>

            <div class="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">Cache Duration</p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Cache lifetime in seconds</p>
              </div>
              <input 
                v-model="advancedSettings.cacheDuration" 
                type="number" 
                min="0"
                class="input-field w-32 text-sm py-2"
              />
            </div>

            <div class="space-y-3 pt-2">
              <button @click="clearCache" class="w-full px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-sm rounded-md transition-colors">
                Clear System Cache
              </button>
              
              <button @click="resetSettings" class="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md transition-colors">
                Reset All Settings to Default
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Settings as SettingsIcon, Puzzle, Shield, Bell, Sliders, AlertTriangle, Lock } from 'lucide-vue-next'
import { useToast } from 'vue-toastification'
import { useSettingsStore } from '@/stores/settings'
import PermissionsMatrix from '@/components/PermissionsMatrix.vue'

const toast = useToast()
const settingsStore = useSettingsStore()

const sections = [
  { id: 'general', name: 'General', icon: SettingsIcon },
  { id: 'plugins', name: 'Plugins', icon: Puzzle },
  { id: 'security', name: 'Security', icon: Shield },
  { id: 'permissions', name: 'Permissions', icon: Lock },
  { id: 'notifications', name: 'Notifications', icon: Bell },
  { id: 'advanced', name: 'Advanced', icon: Sliders }
]

const activeSection = ref('general')

// Use computed properties to sync with store
const generalSettings = computed({
  get: () => settingsStore.settings.general,
  set: (value) => { settingsStore.settings.general = value }
})

const pluginSettings = computed({
  get: () => settingsStore.settings.plugins,
  set: (value) => { settingsStore.settings.plugins = value }
})

const securitySettings = computed({
  get: () => settingsStore.settings.security,
  set: (value) => { settingsStore.settings.security = value }
})

const notificationSettings = computed({
  get: () => ({
    email: settingsStore.settings.notifications.emailNotifications,
    browser: settingsStore.settings.notifications.browserNotifications,
    pluginUpdates: settingsStore.settings.notifications.pluginUpdateNotifications
  }),
  set: (value) => {
    settingsStore.settings.notifications = {
      emailNotifications: value.email,
      browserNotifications: value.browser,
      pluginUpdateNotifications: value.pluginUpdates
    }
  }
})

const advancedSettings = computed({
  get: () => settingsStore.settings.advanced,
  set: (value) => { settingsStore.settings.advanced = value }
})

// Save functions
const saveGeneralSettings = async () => {
  const result = await settingsStore.updateSettings('general', generalSettings.value)
  if (result.success) {
    toast.success('General settings saved successfully')
  } else {
    toast.error(result.message || 'Failed to save settings')
  }
}

const savePluginSettings = async () => {
  const result = await settingsStore.updateSettings('plugins', pluginSettings.value)
  if (result.success) {
    toast.success('Plugin settings saved successfully')
  } else {
    toast.error(result.message || 'Failed to save settings')
  }
}

const saveSecuritySettings = async () => {
  const result = await settingsStore.updateSettings('security', securitySettings.value)
  if (result.success) {
    toast.success('Security settings saved successfully')
  } else {
    toast.error(result.message || 'Failed to save settings')
  }
}

const saveNotificationSettings = async () => {
  const notifSettings = {
    emailNotifications: notificationSettings.value.email,
    browserNotifications: notificationSettings.value.browser,
    pluginUpdateNotifications: notificationSettings.value.pluginUpdates
  }
  const result = await settingsStore.updateSettings('notifications', notifSettings)
  if (result.success) {
    toast.success('Notification settings saved successfully')
  } else {
    toast.error(result.message || 'Failed to save settings')
  }
}

const clearCache = () => {
  if (confirm('Are you sure you want to clear the system cache?')) {
    toast.success('System cache cleared successfully')
  }
}

const resetSettings = async () => {
  if (confirm('Are you sure you want to reset all settings to default? This action cannot be undone.')) {
    const result = await settingsStore.resetSettings()
    if (result.success) {
      toast.success('Settings reset to default values')
    } else {
      toast.error(result.message || 'Failed to reset settings')
    }
  }
}

// Logo upload functionality
const uploadingLogo = ref(false)
const logoFileInput = ref<HTMLInputElement | null>(null)
const logoFileInfo = ref<{ name: string; dimensions: string; size: string } | null>(null)

const handleLogoUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) return

  // Validate file type
  const validTypes = ['image/svg+xml', 'image/png']
  if (!validTypes.includes(file.type)) {
    toast.error('Only SVG and PNG files are allowed')
    return
  }

  // Validate file size (2MB max)
  const maxSize = 2 * 1024 * 1024
  if (file.size > maxSize) {
    toast.error('File size must be less than 2MB')
    return
  }

  // For PNG, validate dimensions
  if (file.type === 'image/png') {
    const img = new Image()
    const objectUrl = URL.createObjectURL(file)
    
    img.onload = async () => {
      URL.revokeObjectURL(objectUrl)
      
      if (img.width > 512 || img.height > 512) {
        toast.warning(`Image will be resized from ${img.width}x${img.height} to fit 512x512`)
      }

      // Store file info
      logoFileInfo.value = {
        name: file.name,
        dimensions: `${img.width}x${img.height}`,
        size: formatFileSize(file.size)
      }

      // Upload file
      await uploadLogoFile(file)
    }

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      toast.error('Invalid image file')
    }

    img.src = objectUrl
  } else {
    // SVG - just upload
    logoFileInfo.value = {
      name: file.name,
      dimensions: 'Vector (SVG)',
      size: formatFileSize(file.size)
    }
    await uploadLogoFile(file)
  }
}

const uploadLogoFile = async (file: File) => {
  uploadingLogo.value = true

  try {
    const formData = new FormData()
    formData.append('logo', file)

    const response = await fetch('http://localhost:3001/api/upload/logo', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    })

    const data = await response.json()

    if (response.ok) {
      generalSettings.value.siteLogo = data.url
      toast.success('Logo uploaded successfully')
    } else {
      toast.error(data.message || 'Failed to upload logo')
    }
  } catch (error) {
    console.error('Error uploading logo:', error)
    toast.error('Failed to upload logo')
  } finally {
    uploadingLogo.value = false
    // Reset file input
    if (logoFileInput.value) {
      logoFileInput.value.value = ''
    }
  }
}

const clearLogo = () => {
  generalSettings.value.siteLogo = ''
  logoFileInfo.value = null
  if (logoFileInput.value) {
    logoFileInput.value.value = ''
  }
}

// Handle logo load error
const handleLogoError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.src = '' // Clear broken image
  toast.error('Failed to load logo image')
}

const handleLogoLoad = (event: Event) => {
  const img = event.target as HTMLImageElement
  if (!logoFileInfo.value && generalSettings.value.siteLogo) {
    // For URL-based logos, show dimensions after load
    logoFileInfo.value = {
      name: 'External URL',
      dimensions: `${img.naturalWidth}x${img.naturalHeight}`,
      size: 'N/A'
    }
  }
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

// Load settings on mount
onMounted(async () => {
  await settingsStore.fetchSettings()
})
</script>

<style scoped>
/* Toggle Switch Styles */
.toggle-switch {
  position: relative;
}

.toggle-track {
  position: relative;
  width: 44px;
  height: 24px;
  background-color: #d1d5db;
  border-radius: 12px;
  transition: background-color 0.2s ease;
}

:deep(.dark) .toggle-track {
  background-color: #4b5563;
}

.toggle-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background-color: white;
  border-radius: 50%;
  transition: transform 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* Checked state */
.toggle-switch input:checked ~ .toggle-track {
  background-color: #111827;
}

:deep(.dark) .toggle-switch input:checked ~ .toggle-track {
  background-color: #f9fafb;
}

.toggle-switch input:checked ~ .toggle-track .toggle-thumb {
  transform: translateX(20px);
  background-color: white;
}

:deep(.dark) .toggle-switch input:checked ~ .toggle-track .toggle-thumb {
  background-color: #111827;
}

/* Hover state */
.toggle-switch:hover .toggle-track {
  background-color: #9ca3af;
}

:deep(.dark) .toggle-switch:hover .toggle-track {
  background-color: #6b7280;
}

.toggle-switch input:checked:hover ~ .toggle-track {
  background-color: #1f2937;
}

:deep(.dark) .toggle-switch input:checked:hover ~ .toggle-track {
  background-color: #e5e7eb;
}

/* Focus state */
.toggle-switch input:focus ~ .toggle-track {
  outline: 2px solid #111827;
  outline-offset: 2px;
}

:deep(.dark) .toggle-switch input:focus ~ .toggle-track {
  outline-color: #f9fafb;
}
</style>
