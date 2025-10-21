<template>
  <SidebarLayout>
    <div class="p-6">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Profile</h1>
            <p class="text-gray-600 dark:text-gray-400 mt-2">Manage your public profile and presence</p>
          </div>
          <ThemeToggle />
        </div>
      </div>

      <div class="grid xl:grid-cols-3 gap-8">
        <!-- Profile Card -->
        <div class="xl:col-span-2">
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <!-- Profile Header -->
            <div class="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
              <div class="flex items-center space-x-6">
                <div class="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <div class="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                    <span class="text-3xl font-bold text-blue-600">
                      {{ getInitials(user?.name || user?.email || 'User') }}
                    </span>
                  </div>
                </div>
                <div>
                  <h2 class="text-2xl font-bold">{{ user?.name || 'User Name' }}</h2>
                  <p class="text-blue-100">{{ user?.email }}</p>
                  <div class="flex items-center mt-2 space-x-2">
                    <span class="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-white/20 backdrop-blur-sm">
                      {{ user?.role || 'USER' }}
                    </span>
                    <span class="text-blue-100 text-sm">
                      Member since {{ formatDate(user?.createdAt) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Profile Content -->
            <div class="p-8">
              <form @submit.prevent="updateProfile" class="space-y-8">
                <!-- Personal Information -->
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">Personal Information</h3>
                  <div class="grid md:grid-cols-2 gap-6">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                      <div class="relative">
                        <input
                          v-model="profileForm.name"
                          type="text"
                          required
                          class="w-full px-4 py-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                        />
                        <svg class="absolute left-3 top-3.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                      </div>
                    </div>
                    
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                      <div class="relative">
                        <input
                          v-model="profileForm.email"
                          type="email"
                          required
                          class="w-full px-4 py-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                        />
                        <svg class="absolute left-3 top-3.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <div class="mt-6">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bio</label>
                    <textarea
                      v-model="profileForm.bio"
                      rows="4"
                      class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all resize-none"
                      placeholder="Tell us about yourself and your plugins..."
                    ></textarea>
                  </div>
                </div>

                <!-- Social Links -->
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">Social Links</h3>
                  <div class="grid md:grid-cols-2 gap-6">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Website</label>
                      <div class="relative">
                        <input
                          v-model="profileForm.website"
                          type="url"
                          class="w-full px-4 py-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                          placeholder="https://yourwebsite.com"
                        />
                        <svg class="absolute left-3 top-3.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path>
                        </svg>
                      </div>
                    </div>
                    
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">GitHub Profile</label>
                      <div class="relative">
                        <input
                          v-model="profileForm.github"
                          type="url"
                          class="w-full px-4 py-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                          placeholder="https://github.com/username"
                        />
                        <svg class="absolute left-3 top-3.5 w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Save Button -->
                <div class="flex justify-end pt-6">
                  <button
                    type="submit"
                    :disabled="saving"
                    class="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
                  >
                    <span v-if="saving" class="flex items-center">
                      <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </span>
                    <span v-else>Save Profile</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="xl:col-span-1 space-y-6">
          <!-- Profile Stats -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">Profile Stats</h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                    <svg class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                    </svg>
                  </div>
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Plugins</span>
                </div>
                <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ userPlugins.length }}</span>
              </div>
              
              <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                    <svg class="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Total Revenue</span>
                </div>
                <span class="text-sm font-semibold text-gray-900 dark:text-white">${{ totalRevenue }}</span>
              </div>
              
              <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                    <svg class="w-4 h-4 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                    </svg>
                  </div>
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Avg Rating</span>
                </div>
                <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ avgRating }}</span>
              </div>
            </div>
          </div>

          <!-- Recent Activity -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">Recent Activity</h3>
            <div class="space-y-4">
              <div class="flex items-start space-x-3">
                <div class="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <div>
                  <p class="text-sm text-gray-900 dark:text-white">Profile updated</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">2 hours ago</p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <div class="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                <div>
                  <p class="text-sm text-gray-900 dark:text-white">New plugin published</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">1 day ago</p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <div class="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                <div>
                  <p class="text-sm text-gray-900 dark:text-white">Account created</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">{{ formatDate(user?.createdAt) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </SidebarLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { usePluginStore } from '@/stores/plugins'
import { useToastStore } from '@/stores/toast'
import SidebarLayout from '@/layouts/SidebarLayout.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'

const authStore = useAuthStore()
const pluginStore = usePluginStore()
const toastStore = useToastStore()

const user = computed(() => authStore.user)
const plugins = computed(() => pluginStore.plugins)

const userPlugins = computed(() => {
  return plugins.value.filter(plugin => plugin.author.id === authStore.user?.id)
})

const totalRevenue = computed(() => {
  return userPlugins.value.reduce((sum, plugin) => {
    return sum + (plugin.price * plugin._count.purchases)
  }, 0).toFixed(2)
})

const avgRating = computed(() => {
  if (userPlugins.value.length === 0) return '0.0'
  const totalRating = userPlugins.value.reduce((sum, plugin) => sum + plugin.avgRating, 0)
  return (totalRating / userPlugins.value.length).toFixed(1)
})

const saving = ref(false)
const profileForm = ref({
  name: user.value?.name || '',
  email: user.value?.email || '',
  bio: '',
  website: '',
  github: ''
})

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const formatDate = (dateString?: string) => {
  if (!dateString) return 'Unknown'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

const updateProfile = async () => {
  saving.value = true
  try {
    // TODO: Implement actual profile update API call
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
    
    toastStore.success('Profile updated successfully')
  } catch (error) {
    toastStore.error('Failed to update profile')
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  try {
    await pluginStore.fetchPlugins()
    
    // Initialize form with user data
    if (user.value) {
      profileForm.value = {
        name: user.value.name || '',
        email: user.value.email || '',
        bio: '',
        website: '',
        github: ''
      }
    }
  } catch (error) {
    toastStore.error('Failed to load profile data')
  }
})
</script>