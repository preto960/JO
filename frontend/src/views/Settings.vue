<template>
  <div class="space-y-6">
    <!-- Profile Settings -->
    <div class="card">
      <h3 class="text-xl font-bold text-white mb-6">Profile Settings</h3>
      <form @submit.prevent="saveProfile" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">First Name</label>
            <input v-model="profile.firstName" type="text" class="input-field" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
            <input v-model="profile.lastName" type="text" class="input-field" />
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Email</label>
          <input v-model="profile.email" type="email" class="input-field" />
        </div>

        <button type="submit" class="btn-primary">
          <Save class="w-5 h-5 mr-2" />
          Save Changes
        </button>
      </form>
    </div>

    <!-- System Settings -->
    <div class="card">
      <h3 class="text-xl font-bold text-white mb-6">System Settings</h3>
      <div class="space-y-4">
        <div class="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
          <div>
            <p class="text-white font-medium">Auto-update Plugins</p>
            <p class="text-gray-400 text-sm">Automatically update plugins when new versions are available</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="settings.autoUpdate" class="sr-only peer">
            <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
          </label>
        </div>

        <div class="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
          <div>
            <p class="text-white font-medium">Email Notifications</p>
            <p class="text-gray-400 text-sm">Receive email notifications for system events</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="settings.emailNotifications" class="sr-only peer">
            <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
          </label>
        </div>

        <div class="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
          <div>
            <p class="text-white font-medium">Dark Mode</p>
            <p class="text-gray-400 text-sm">Use dark theme for the interface</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="settings.darkMode" class="sr-only peer" checked>
            <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
          </label>
        </div>
      </div>
    </div>

    <!-- Danger Zone -->
    <div class="card border-2 border-red-500/20">
      <h3 class="text-xl font-bold text-red-400 mb-4">Danger Zone</h3>
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-white font-medium">Clear Cache</p>
            <p class="text-gray-400 text-sm">Clear all cached data and temporary files</p>
          </div>
          <button class="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-semibold transition-colors">
            Clear Cache
          </button>
        </div>
        
        <div class="flex items-center justify-between">
          <div>
            <p class="text-white font-medium">Reset Settings</p>
            <p class="text-gray-400 text-sm">Reset all settings to default values</p>
          </div>
          <button class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors">
            Reset Settings
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Save } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'

const authStore = useAuthStore()
const toast = useToast()

const profile = ref({
  firstName: authStore.user?.firstName || '',
  lastName: authStore.user?.lastName || '',
  email: authStore.user?.email || ''
})

const settings = ref({
  autoUpdate: true,
  emailNotifications: true,
  darkMode: true
})

const saveProfile = () => {
  toast.success('Profile updated successfully!')
}
</script>

