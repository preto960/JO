<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-semibold text-gray-900">Settings</h1>
          </div>
          <div class="flex items-center space-x-4">
            <router-link 
              to="/dashboard" 
              class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Back to Dashboard
            </router-link>
            <span class="text-sm text-gray-600">Welcome, {{ user?.username }}</span>
            <button 
              @click="logout"
              class="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Navigation -->
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex space-x-8">
          <router-link 
            to="/dashboard" 
            class="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
          >
            Dashboard
          </router-link>
          <router-link 
            to="/marketplace" 
            class="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
          >
            Marketplace
          </router-link>
          <router-link 
            to="/settings" 
            class="inline-flex items-center px-1 pt-1 border-b-2 border-blue-500 text-sm font-medium text-gray-900"
          >
            Settings
          </router-link>
          <router-link 
            to="/profile" 
            class="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
          >
            Profile
          </router-link>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Settings Sidebar -->
          <div class="lg:col-span-1">
            <div class="bg-white shadow rounded-lg">
              <div class="p-6">
                <h3 class="text-lg font-medium text-gray-900 mb-4">Settings Categories</h3>
                <nav class="space-y-1">
                  <button
                    @click="activeTab = 'general'"
                    :class="[
                      'w-full text-left px-3 py-2 rounded-md text-sm font-medium',
                      activeTab === 'general'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    ]"
                  >
                    General
                  </button>
                  <button
                    @click="activeTab = 'security'"
                    :class="[
                      'w-full text-left px-3 py-2 rounded-md text-sm font-medium',
                      activeTab === 'security'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    ]"
                  >
                    Security
                  </button>
                  <button
                    @click="activeTab = 'notifications'"
                    :class="[
                      'w-full text-left px-3 py-2 rounded-md text-sm font-medium',
                      activeTab === 'notifications'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    ]"
                  >
                    Notifications
                  </button>
                  <button
                    @click="activeTab = 'integrations'"
                    :class="[
                      'w-full text-left px-3 py-2 rounded-md text-sm font-medium',
                      activeTab === 'integrations'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    ]"
                  >
                    Integrations
                  </button>
                  <button
                    @click="activeTab = 'advanced'"
                    :class="[
                      'w-full text-left px-3 py-2 rounded-md text-sm font-medium',
                      activeTab === 'advanced'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    ]"
                  >
                    Advanced
                  </button>
                </nav>
              </div>
            </div>
          </div>

          <!-- Settings Content -->
          <div class="lg:col-span-2">
            <div class="bg-white shadow rounded-lg">
              <div class="p-6">
                <!-- General Settings -->
                <div v-if="activeTab === 'general'">
                  <h3 class="text-lg font-medium text-gray-900 mb-4">General Settings</h3>
                  
                  <div class="space-y-6">
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Application Name</label>
                      <input
                        v-model="settings.appName"
                        type="text"
                        class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700">Default Language</label>
                      <select
                        v-model="settings.language"
                        class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      >
                        <option value="en">English</option>
                        <option value="es">Español</option>
                        <option value="fr">Français</option>
                        <option value="de">Deutsch</option>
                      </select>
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700">Timezone</label>
                      <select
                        v-model="settings.timezone"
                        class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      >
                        <option value="UTC">UTC</option>
                        <option value="America/New_York">Eastern Time</option>
                        <option value="America/Chicago">Central Time</option>
                        <option value="America/Denver">Mountain Time</option>
                        <option value="America/Los_Angeles">Pacific Time</option>
                      </select>
                    </div>

                    <div class="flex items-center">
                      <input
                        v-model="settings.darkMode"
                        type="checkbox"
                        class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label class="ml-2 block text-sm text-gray-900">Enable Dark Mode</label>
                    </div>
                  </div>
                </div>

                <!-- Security Settings -->
                <div v-if="activeTab === 'security'">
                  <h3 class="text-lg font-medium text-gray-900 mb-4">Security Settings</h3>
                  
                  <div class="space-y-6">
                    <div class="flex items-center">
                      <input
                        v-model="settings.twoFactorAuth"
                        type="checkbox"
                        class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label class="ml-2 block text-sm text-gray-900">Enable Two-Factor Authentication</label>
                    </div>

                    <div class="flex items-center">
                      <input
                        v-model="settings.sessionTimeout"
                        type="checkbox"
                        class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label class="ml-2 block text-sm text-gray-900">Enable Session Timeout</label>
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700">Session Duration (minutes)</label>
                      <input
                        v-model="settings.sessionDuration"
                        type="number"
                        min="5"
                        max="480"
                        class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>

                    <div class="pt-4">
                      <button class="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition">
                        Change Password
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Notification Settings -->
                <div v-if="activeTab === 'notifications'">
                  <h3 class="text-lg font-medium text-gray-900 mb-4">Notification Settings</h3>
                  
                  <div class="space-y-6">
                    <div class="flex items-center">
                      <input
                        v-model="settings.emailNotifications"
                        type="checkbox"
                        class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label class="ml-2 block text-sm text-gray-900">Email Notifications</label>
                    </div>

                    <div class="flex items-center">
                      <input
                        v-model="settings.pushNotifications"
                        type="checkbox"
                        class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label class="ml-2 block text-sm text-gray-900">Push Notifications</label>
                    </div>

                    <div class="flex items-center">
                      <input
                        v-model="settings.pluginUpdates"
                        type="checkbox"
                        class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label class="ml-2 block text-sm text-gray-900">Plugin Update Notifications</label>
                    </div>

                    <div class="flex items-center">
                      <input
                        v-model="settings.securityAlerts"
                        type="checkbox"
                        class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label class="ml-2 block text-sm text-gray-900">Security Alerts</label>
                    </div>
                  </div>
                </div>

                <!-- Integration Settings -->
                <div v-if="activeTab === 'integrations'">
                  <h3 class="text-lg font-medium text-gray-900 mb-4">Integration Settings</h3>
                  
                  <div class="space-y-6">
                    <div class="border border-gray-200 rounded-lg p-4">
                      <div class="flex items-center justify-between">
                        <div>
                          <h4 class="text-sm font-medium text-gray-900">GitHub Integration</h4>
                          <p class="text-sm text-gray-500">Connect your GitHub account</p>
                        </div>
                        <button class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition">
                          Connect
                        </button>
                      </div>
                    </div>

                    <div class="border border-gray-200 rounded-lg p-4">
                      <div class="flex items-center justify-between">
                        <div>
                          <h4 class="text-sm font-medium text-gray-900">Slack Integration</h4>
                          <p class="text-sm text-gray-500">Send notifications to Slack</p>
                        </div>
                        <button class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition">
                          Connect
                        </button>
                      </div>
                    </div>

                    <div class="border border-gray-200 rounded-lg p-4">
                      <div class="flex items-center justify-between">
                        <div>
                          <h4 class="text-sm font-medium text-gray-900">API Access</h4>
                          <p class="text-sm text-gray-500">Manage API keys and access</p>
                        </div>
                        <button class="bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition">
                          Manage
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Advanced Settings -->
                <div v-if="activeTab === 'advanced'">
                  <h3 class="text-lg font-medium text-gray-900 mb-4">Advanced Settings</h3>
                  
                  <div class="space-y-6">
                    <div class="flex items-center">
                      <input
                        v-model="settings.debugMode"
                        type="checkbox"
                        class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label class="ml-2 block text-sm text-gray-900">Enable Debug Mode</label>
                    </div>

                    <div class="flex items-center">
                      <input
                        v-model="settings.betaFeatures"
                        type="checkbox"
                        class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label class="ml-2 block text-sm text-gray-900">Enable Beta Features</label>
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700">Cache Duration (hours)</label>
                      <input
                        v-model="settings.cacheDuration"
                        type="number"
                        min="1"
                        max="168"
                        class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>

                    <div class="pt-4 border-t border-gray-200">
                      <button class="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition">
                        Clear Cache
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Save Button -->
                <div class="mt-8 pt-6 border-t border-gray-200">
                  <div class="flex justify-end">
                    <button
                      @click="saveSettings"
                      class="bg-blue-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition"
                    >
                      Save Settings
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const activeTab = ref('general')

const user = computed(() => authStore.user)

const settings = ref({
  appName: 'Plugin Admin Panel',
  language: 'en',
  timezone: 'UTC',
  darkMode: false,
  twoFactorAuth: false,
  sessionTimeout: true,
  sessionDuration: 60,
  emailNotifications: true,
  pushNotifications: false,
  pluginUpdates: true,
  securityAlerts: true,
  debugMode: false,
  betaFeatures: false,
  cacheDuration: 24
})

const logout = () => {
  authStore.logout()
  router.push('/login')
}

const saveSettings = () => {
  console.log('Saving settings:', settings.value)
  // TODO: Implement settings save logic
}
</script>