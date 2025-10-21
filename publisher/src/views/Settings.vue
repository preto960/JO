<template>
  <SidebarLayout>
    <div class="p-6">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
            <p class="text-gray-600 dark:text-gray-400 mt-2">Manage your account and publisher settings</p>
          </div>
          <ThemeToggle />
        </div>
      </div>

      <div class="grid xl:grid-cols-3 gap-8">
        <!-- Main Settings Content -->
        <div class="xl:col-span-2 space-y-8">
          <!-- Profile Settings Card -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div class="p-6 border-b border-gray-200 dark:border-gray-700">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
                <div>
                  <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Profile Information</h2>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Update your personal information</p>
                </div>
              </div>
            </div>
            <div class="p-6">
              <form @submit.prevent="updateProfile" class="space-y-6">
                <div class="grid md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Username</label>
                    <div class="relative">
                      <input
                        v-model="profileForm.username"
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
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bio</label>
                  <textarea
                    v-model="profileForm.bio"
                    rows="4"
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all resize-none"
                    placeholder="Tell us about yourself and your plugins..."
                  ></textarea>
                </div>
                
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
                
                <div class="flex justify-end pt-4">
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
                    <span v-else>Save Changes</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- Payment Settings Card -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div class="p-6 border-b border-gray-200 dark:border-gray-700">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                  </svg>
                </div>
                <div>
                  <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Payment Settings</h2>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Configure your payment methods</p>
                </div>
              </div>
            </div>
            <div class="p-6">
              <form @submit.prevent="updatePaymentSettings" class="space-y-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">PayPal Email</label>
                  <div class="relative">
                    <input
                      v-model="paymentForm.paypalEmail"
                      type="email"
                      class="w-full px-4 py-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                      placeholder="paypal@example.com"
                    />
                    <svg class="absolute left-3 top-3.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                    </svg>
                  </div>
                  <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    This email will be used for receiving payments
                  </p>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Stripe Connect</label>
                  <div class="flex items-center space-x-4">
                    <button
                      type="button"
                      class="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105"
                    >
                      Connect with Stripe
                    </button>
                    <div v-if="paymentForm.stripeConnected" class="flex items-center text-green-600 dark:text-green-400">
                      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      Connected
                    </div>
                  </div>
                  <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Connect your Stripe account to receive payments
                  </p>
                </div>
                
                <div class="flex justify-end pt-4">
                  <button
                    type="submit"
                    :disabled="savingPayment"
                    class="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
                  >
                    <span v-if="savingPayment" class="flex items-center">
                      <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </span>
                    <span v-else>Save Payment Settings</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="xl:col-span-1 space-y-6">
          <!-- Account Stats Card -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div class="p-6">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">Account Stats</h3>
              <div class="space-y-4">
                <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                      <svg class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                    <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Member Since</span>
                  </div>
                  <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ formatDate(user?.createdAt) }}</span>
                </div>
                
                <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                      <svg class="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                    </div>
                    <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Account Type</span>
                  </div>
                  <span class="text-sm font-semibold text-gray-900 dark:text-white capitalize">{{ user?.role }}</span>
                </div>
                
                <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                      <svg class="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                    </div>
                    <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Total Plugins</span>
                  </div>
                  <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ stats.totalPlugins }}</span>
                </div>
                
                <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                      <svg class="w-4 h-4 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                    <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Total Revenue</span>
                  </div>
                  <span class="text-sm font-semibold text-gray-900 dark:text-white">${{ stats.totalRevenue }}</span>
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
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { usePluginStore } from '@/stores/plugins'
import { useToastStore } from '@/stores/toast'
import SidebarLayout from '@/layouts/SidebarLayout.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'

const authStore = useAuthStore()
const pluginStore = usePluginStore()
const toastStore = useToastStore()

const saving = ref(false)
const savingPayment = ref(false)

const profileForm = ref({
  username: authStore.user?.username || '',
  email: authStore.user?.email || '',
  bio: '',
  website: '',
  github: ''
})

const paymentForm = ref({
  paypalEmail: '',
  stripeConnected: false
})

const user = computed(() => authStore.user)
const stats = computed(() => {
  const userPlugins = pluginStore.plugins.filter(plugin => plugin.author.id === authStore.user?.id)
  const totalRevenue = userPlugins.reduce((sum, plugin) => {
    return sum + (plugin.price * plugin._count.purchases)
  }, 0)

  return {
    totalPlugins: userPlugins.length,
    totalRevenue: totalRevenue.toFixed(2)
  }
})

const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString()
}

const updateProfile = async () => {
  saving.value = true
  try {
    // TODO: Implement profile update API call
    console.log('Updating profile:', profileForm.value)
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
    toastStore.success('Profile updated successfully!')
  } catch (error) {
    toastStore.error('Failed to update profile')
  } finally {
    saving.value = false
  }
}

const updatePaymentSettings = async () => {
  savingPayment.value = true
  try {
    // TODO: Implement payment settings update API call
    console.log('Updating payment settings:', paymentForm.value)
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
    toastStore.success('Payment settings updated successfully!')
  } catch (error) {
    toastStore.error('Failed to update payment settings')
  } finally {
    savingPayment.value = false
  }
}

const exportData = () => {
  // TODO: Implement data export functionality
  toastStore.info('Data export started. You will receive an email when ready.')
  console.log('Exporting user data...')
}

const deleteAccount = () => {
  if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
    // TODO: Implement account deletion
    toastStore.warning('Account deletion requested. You will receive a confirmation email.')
    console.log('Deleting account...')
  }
}
</script>