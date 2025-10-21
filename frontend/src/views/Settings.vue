<template>
  <div class="min-h-screen animated-bg">
    <!-- Background decoration -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div class="absolute top-40 left-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
    </div>

    <!-- Header -->
    <header class="glass fixed top-0 left-0 right-0 z-40 fade-in">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">
          <div class="flex items-center">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg"></div>
              <h1 class="text-xl font-bold text-glow">Settings</h1>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <router-link 
              to="/dashboard" 
              class="glass-button text-sm hover:bg-white/20 transition-all duration-300"
            >
              Back to Dashboard
            </router-link>
            <div class="glass px-4 py-2 rounded-lg">
              <span class="text-sm opacity-90">Welcome, {{ user?.username }}</span>
            </div>
            <button 
              @click="logout"
              class="glass-button bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white border-0 transition-all duration-300"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Navigation -->
    <nav class="glass fixed top-16 left-0 right-0 z-30 fade-in">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex space-x-1">
          <router-link 
            to="/dashboard" 
            class="glass-button px-4 py-2 text-sm font-medium hover:bg-white/20 transition-all duration-300"
          >
            Dashboard
          </router-link>
          <router-link 
            to="/marketplace" 
            class="glass-button px-4 py-2 text-sm font-medium hover:bg-white/20 transition-all duration-300"
          >
            Marketplace
          </router-link>
          <router-link 
            to="/my-plugins" 
            class="glass-button px-4 py-2 text-sm font-medium hover:bg-white/20 transition-all duration-300"
          >
            My Plugins
          </router-link>
          <router-link 
            to="/profile" 
            class="glass-button px-4 py-2 text-sm font-medium hover:bg-white/20 transition-all duration-300"
          >
            Profile
          </router-link>
          <router-link 
            to="/settings" 
            class="glass-button px-4 py-2 text-sm font-medium bg-white/20 border-white/30"
          >
            Settings
          </router-link>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="pt-32 pb-8 px-4 relative z-10">
      <div class="max-w-7xl mx-auto">
        <div class="glass-card p-8 slide-up">
          <h2 class="text-3xl font-bold text-glow mb-2">Settings</h2>
          <p class="text-lg opacity-80 mb-8">Manage your application preferences and configurations</p>
          
          <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <!-- Settings Sidebar -->
            <div class="lg:col-span-1">
              <div class="glass-card p-6">
                <h3 class="text-lg font-bold text-glow mb-6">Categories</h3>
                <nav class="space-y-2">
                  <button
                    @click="activeTab = 'general'"
                    :class="[
                      'w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300',
                      activeTab === 'general'
                        ? 'glass bg-white/30 border-white/50'
                        : 'glass-button hover:bg-white/20'
                    ]"
                  >
                    General
                  </button>
                  <button
                    @click="activeTab = 'security'"
                    :class="[
                      'w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300',
                      activeTab === 'security'
                        ? 'glass bg-white/30 border-white/50'
                        : 'glass-button hover:bg-white/20'
                    ]"
                  >
                    Security
                  </button>
                  <button
                    @click="activeTab = 'notifications'"
                    :class="[
                      'w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300',
                      activeTab === 'notifications'
                        ? 'glass bg-white/30 border-white/50'
                        : 'glass-button hover:bg-white/20'
                    ]"
                  >
                    Notifications
                  </button>
                </nav>
              </div>
            </div>

            <!-- Settings Content -->
            <div class="lg:col-span-3">
              <div class="glass-card p-8">
                <!-- General Settings -->
                <div v-if="activeTab === 'general'">
                  <h3 class="text-2xl font-bold text-glow mb-6">General Settings</h3>
                  
                  <div class="space-y-6">
                    <div>
                      <label class="block text-sm font-medium mb-2 opacity-90">Application Name</label>
                      <input
                        v-model="settings.appName"
                        type="text"
                        class="glass-input w-full"
                      />
                    </div>

                    <div>
                      <label class="block text-sm font-medium mb-2 opacity-90">Language</label>
                      <select
                        v-model="settings.language"
                        class="glass-input w-full"
                      >
                        <option value="en">English</option>
                        <option value="es">Español</option>
                        <option value="fr">Français</option>
                      </select>
                    </div>

                    <div>
                      <label class="block text-sm font-medium mb-2 opacity-90">Timezone</label>
                      <select
                        v-model="settings.timezone"
                        class="glass-input w-full"
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
                        class="w-4 h-4 text-blue-600 rounded"
                      />
                      <label class="ml-3 text-sm opacity-90">Enable Dark Mode</label>
                    </div>
                  </div>
                </div>

                <!-- Security Settings -->
                <div v-if="activeTab === 'security'">
                  <h3 class="text-2xl font-bold text-glow mb-6">Security Settings</h3>
                  
                  <div class="space-y-6">
                    <div class="flex items-center">
                      <input
                        v-model="settings.twoFactorAuth"
                        type="checkbox"
                        class="w-4 h-4 text-blue-600 rounded"
                      />
                      <label class="ml-3 text-sm opacity-90">Enable Two-Factor Authentication</label>
                    </div>

                    <div>
                      <button class="glass-button bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white border-0 transition-all duration-300">
                        Change Password
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Notification Settings -->
                <div v-if="activeTab === 'notifications'">
                  <h3 class="text-2xl font-bold text-glow mb-6">Notification Settings</h3>
                  
                  <div class="space-y-6">
                    <div class="flex items-center">
                      <input
                        v-model="settings.emailNotifications"
                        type="checkbox"
                        class="w-4 h-4 text-blue-600 rounded"
                      />
                      <label class="ml-3 text-sm opacity-90">Email Notifications</label>
                    </div>

                    <div class="flex items-center">
                      <input
                        v-model="settings.pushNotifications"
                        type="checkbox"
                        class="w-4 h-4 text-blue-600 rounded"
                      />
                      <label class="ml-3 text-sm opacity-90">Push Notifications</label>
                    </div>

                    <div class="flex items-center">
                      <input
                        v-model="settings.pluginUpdates"
                        type="checkbox"
                        class="w-4 h-4 text-blue-600 rounded"
                      />
                      <label class="ml-3 text-sm opacity-90">Plugin Update Notifications</label>
                    </div>
                  </div>
                </div>

                <!-- Save Button -->
                <div class="mt-8 pt-6 border-t border-white/20">
                  <button class="glass-button bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0 transition-all duration-300">
                    Save Changes
                  </button>
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

<style scoped>
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}
.animate-blob {
  animation: blob 7s infinite;
}
.animation-delay-2000 {
  animation-delay: 2s;
}
.animation-delay-4000 {
  animation-delay: 4s;
}
</style>