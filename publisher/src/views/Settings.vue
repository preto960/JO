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
            to="/" 
            class="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
          >
            Dashboard
          </router-link>
          <router-link 
            to="/plugins" 
            class="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
          >
            My Plugins
          </router-link>
          <router-link 
            to="/analytics" 
            class="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
          >
            Analytics
          </router-link>
          <router-link 
            to="/settings" 
            class="inline-flex items-center px-1 pt-1 border-b-2 border-blue-500 text-sm font-medium text-gray-900"
          >
            Settings
          </router-link>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">Settings</h1>
          <p class="text-gray-600 mt-2">Manage your account and publisher settings</p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <!-- Profile Settings -->
          <div class="md:col-span-2">
            <div class="bg-white rounded-lg shadow-sm">
              <div class="p-6 border-b border-gray-200">
                <h2 class="text-lg font-semibold">Profile Information</h2>
              </div>
              <div class="p-6">
                <form @submit.prevent="updateProfile" class="space-y-6">
                  <div class="grid grid-cols-2 gap-6">
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Username</label>
                      <input
                        v-model="profileForm.username"
                        type="text"
                        required
                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        v-model="profileForm.email"
                        type="email"
                        required
                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Bio</label>
                    <textarea
                      v-model="profileForm.bio"
                      rows="4"
                      class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Tell us about yourself and your plugins..."
                    ></textarea>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Website</label>
                    <input
                      v-model="profileForm.website"
                      type="url"
                      class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700">GitHub Profile</label>
                    <input
                      v-model="profileForm.github"
                      type="url"
                      class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://github.com/username"
                    />
                  </div>
                  
                  <div class="flex justify-end">
                    <button
                      type="submit"
                      :disabled="saving"
                      class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      <span v-if="saving">Saving...</span>
                      <span v-else>Save Changes</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <!-- Payment Settings -->
            <div class="bg-white rounded-lg shadow-sm mt-8">
              <div class="p-6 border-b border-gray-200">
                <h2 class="text-lg font-semibold">Payment Settings</h2>
              </div>
              <div class="p-6">
                <form @submit.prevent="updatePaymentSettings" class="space-y-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">PayPal Email</label>
                    <input
                      v-model="paymentForm.paypalEmail"
                      type="email"
                      class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="paypal@example.com"
                    />
                    <p class="mt-1 text-sm text-gray-500">
                      This email will be used for receiving payments
                    </p>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Stripe Connect</label>
                    <div class="mt-1 flex items-center">
                      <button
                        type="button"
                        class="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
                      >
                        Connect with Stripe
                      </button>
                      <span v-if="paymentForm.stripeConnected" class="ml-3 text-green-600">
                        ✓ Connected
                      </span>
                    </div>
                    <p class="mt-1 text-sm text-gray-500">
                      Connect your Stripe account to receive payments
                    </p>
                  </div>
                  
                  <div class="flex justify-end">
                    <button
                      type="submit"
                      :disabled="savingPayment"
                      class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      <span v-if="savingPayment">Saving...</span>
                      <span v-else>Save Payment Settings</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="md:col-span-1">
            <!-- Account Stats -->
            <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 class="text-lg font-semibold mb-4">Account Stats</h3>
              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-gray-600">Member Since</span>
                  <span class="font-medium">{{ formatDate(user?.createdAt) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Account Type</span>
                  <span class="font-medium">{{ user?.role }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Total Plugins</span>
                  <span class="font-medium">{{ stats.totalPlugins }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Total Revenue</span>
                  <span class="font-medium">${{ stats.totalRevenue }}</span>
                </div>
              </div>
            </div>

            <!-- Quick Actions -->
            <div class="bg-white rounded-lg shadow-sm p-6">
              <h3 class="text-lg font-semibold mb-4">Quick Actions</h3>
              <div class="space-y-3">
                <button
                  @click="exportData"
                  class="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                >
                  <div class="flex items-center">
                    <svg class="w-5 h-5 text-gray-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <span class="text-sm">Export Data</span>
                  </div>
                </button>
                
                <button
                  @click="deleteAccount"
                  class="w-full text-left p-3 border border-red-200 rounded-lg hover:bg-red-50 transition"
                >
                  <div class="flex items-center">
                    <svg class="w-5 h-5 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                    <span class="text-sm text-red-600">Delete Account</span>
                  </div>
                </button>
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
import { usePluginStore } from '@/stores/plugins'
import { useToastStore } from '@/stores/toast'

const router = useRouter()
const authStore = useAuthStore()
const pluginStore = usePluginStore()
const toastStore = useToastStore()

const logout = async () => {
  try {
    await authStore.logout()
    router.push('/login')
  } catch (error) {
    console.error('Failed to logout')
  }
}

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