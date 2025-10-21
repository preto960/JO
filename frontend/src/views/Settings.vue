<template>
  <SidebarLayout>
    <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
      <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Settings</h2>
      <p class="text-lg text-gray-600 dark:text-gray-400 mb-8">Manage your application preferences and configurations</p>
      
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Settings Sidebar -->
        <div class="lg:col-span-1">
          <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-6">Categories</h3>
            <nav class="space-y-2">
              <button
                @click="activeTab = 'general'"
                :class="[
                  'w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300',
                  activeTab === 'general'
                    ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 border-l-4 border-indigo-600'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600'
                ]"
              >
                General
              </button>
              <button
                @click="activeTab = 'security'"
                :class="[
                  'w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300',
                  activeTab === 'security'
                    ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 border-l-4 border-indigo-600'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600'
                ]"
              >
                Security
              </button>
              <button
                @click="activeTab = 'notifications'"
                :class="[
                  'w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300',
                  activeTab === 'notifications'
                    ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 border-l-4 border-indigo-600'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600'
                ]"
              >
                Notifications
              </button>
            </nav>
          </div>
        </div>

        <!-- Settings Content -->
        <div class="lg:col-span-3">
          <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8">
            <!-- General Settings -->
            <div v-if="activeTab === 'general'">
              <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">General Settings</h3>
              
              <div class="space-y-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Application Name</label>
                  <input
                    v-model="settings.appName"
                    type="text"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Language</label>
                  <select
                    v-model="settings.language"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Timezone</label>
                  <select
                    v-model="settings.timezone"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">Eastern Time</option>
                    <option value="America/Los_Angeles">Pacific Time</option>
                  </select>
                </div>

                <div class="flex items-center">
                  <input
                    v-model="settings.darkMode"
                    type="checkbox"
                    class="w-4 h-4 text-indigo-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-indigo-500"
                  />
                  <label class="ml-3 text-sm text-gray-700 dark:text-gray-300">Enable Dark Mode</label>
                </div>
              </div>
            </div>

            <!-- Security Settings -->
            <div v-if="activeTab === 'security'">
              <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Security Settings</h3>
              
              <div class="space-y-6">
                <div class="flex items-center">
                  <input
                    v-model="settings.twoFactorAuth"
                    type="checkbox"
                    class="w-4 h-4 text-indigo-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-indigo-500"
                  />
                  <label class="ml-3 text-sm text-gray-700 dark:text-gray-300">Enable Two-Factor Authentication</label>
                </div>

                <div>
                  <button class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200">
                    Change Password
                  </button>
                </div>
              </div>
            </div>

            <!-- Notification Settings -->
            <div v-if="activeTab === 'notifications'">
              <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Notification Settings</h3>
              
              <div class="space-y-6">
                <div class="flex items-center">
                  <input
                    v-model="settings.emailNotifications"
                    type="checkbox"
                    class="w-4 h-4 text-indigo-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-indigo-500"
                  />
                  <label class="ml-3 text-sm text-gray-700 dark:text-gray-300">Email Notifications</label>
                </div>

                <div class="flex items-center">
                  <input
                    v-model="settings.pushNotifications"
                    type="checkbox"
                    class="w-4 h-4 text-indigo-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-indigo-500"
                  />
                  <label class="ml-3 text-sm text-gray-700 dark:text-gray-300">Push Notifications</label>
                </div>

                <div class="flex items-center">
                  <input
                    v-model="settings.pluginUpdates"
                    type="checkbox"
                    class="w-4 h-4 text-indigo-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-indigo-500"
                  />
                  <label class="ml-3 text-sm text-gray-700 dark:text-gray-300">Plugin Update Notifications</label>
                </div>
              </div>
            </div>

            <!-- Save Button -->
            <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors duration-200">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </SidebarLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import SidebarLayout from '@/layouts/SidebarLayout.vue'

const router = useRouter()
const authStore = useAuthStore()

const user = computed(() => authStore.user)
const activeTab = ref('general')

const settings = ref({
  appName: 'Plugin Marketplace',
  language: 'en',
  timezone: 'UTC',
  darkMode: false,
  twoFactorAuth: false,
  emailNotifications: true,
  pushNotifications: true,
  pluginUpdates: true
})

const logout = () => {
  authStore.logout()
  router.push('/login')
}
</script>