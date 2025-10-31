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
import { ref } from 'vue'
import { Settings as SettingsIcon, Puzzle, Shield, Bell, Sliders, AlertTriangle, Lock } from 'lucide-vue-next'
import { useToast } from 'vue-toastification'
import PermissionsMatrix from '@/components/PermissionsMatrix.vue'

const toast = useToast()

const sections = [
  { id: 'general', name: 'General', icon: SettingsIcon },
  { id: 'plugins', name: 'Plugins', icon: Puzzle },
  { id: 'security', name: 'Security', icon: Shield },
  { id: 'permissions', name: 'Permissions', icon: Lock },
  { id: 'notifications', name: 'Notifications', icon: Bell },
  { id: 'advanced', name: 'Advanced', icon: Sliders }
]

const activeSection = ref('general')

const generalSettings = ref({
  siteName: 'Admin Panel',
  language: 'en',
  timezone: 'UTC'
})

const pluginSettings = ref({
  autoUpdate: true,
  hotReload: true,
  allowExternal: false
})

const securitySettings = ref({
  twoFactor: false,
  sessionTimeout: 30,
  passwordExpiration: false
})

const notificationSettings = ref({
  email: true,
  browser: true,
  pluginUpdates: true
})

const advancedSettings = ref({
  debugMode: false,
  cacheDuration: 3600
})

const saveGeneralSettings = () => {
  toast.success('General settings saved successfully')
}

const savePluginSettings = () => {
  toast.success('Plugin settings saved successfully')
}

const saveSecuritySettings = () => {
  toast.success('Security settings saved successfully')
}

const saveNotificationSettings = () => {
  toast.success('Notification settings saved successfully')
}

const clearCache = () => {
  if (confirm('Are you sure you want to clear the system cache?')) {
    toast.success('System cache cleared successfully')
  }
}

const resetSettings = () => {
  if (confirm('Are you sure you want to reset all settings to default? This action cannot be undone.')) {
    toast.success('Settings reset to default values')
  }
}
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
