<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-semibold text-gray-900">Profile</h1>
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
            class="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
          >
            Settings
          </router-link>
          <router-link 
            to="/profile" 
            class="inline-flex items-center px-1 pt-1 border-b-2 border-blue-500 text-sm font-medium text-gray-900"
          >
            Profile
          </router-link>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="flex justify-between items-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900">My Profile</h1>
          <button
            @click="showEditModal = true"
            class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Edit Profile
          </button>
        </div>
        
        <div class="grid md:grid-cols-3 gap-8">
          <!-- Profile Information -->
          <div class="md:col-span-1">
            <div class="bg-white rounded-lg shadow-sm p-6">
              <h2 class="text-xl font-semibold mb-4">Profile Information</h2>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Username</label>
                  <p class="mt-1 text-sm text-gray-900">{{ user?.username }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Email</label>
                  <p class="mt-1 text-sm text-gray-900">{{ user?.email }}</p>
                </div>
                <div v-if="user?.bio">
                  <label class="block text-sm font-medium text-gray-700">Bio</label>
                  <p class="mt-1 text-sm text-gray-900">{{ user.bio }}</p>
                </div>
                <div v-if="user?.website">
                  <label class="block text-sm font-medium text-gray-700">Website</label>
                  <p class="mt-1 text-sm text-gray-900">
                    <a :href="user.website" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800">
                      {{ user.website }}
                    </a>
                  </p>
                </div>
                <div v-if="user?.paypalEmail">
                  <label class="block text-sm font-medium text-gray-700">PayPal Email</label>
                  <p class="mt-1 text-sm text-gray-900">{{ user.paypalEmail }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Account Type</label>
                  <p class="mt-1 text-sm text-gray-900">{{ user?.role }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Member Since</label>
                  <p class="mt-1 text-sm text-gray-900">{{ formatDate(user?.createdAt) }}</p>
                </div>
              </div>
            </div>

            <!-- Social Links -->
            <div v-if="hasSocialLinks" class="bg-white rounded-lg shadow-sm p-6 mt-6">
              <h2 class="text-xl font-semibold mb-4">Social Links</h2>
              <div class="space-y-3">
                <div v-if="user?.github">
                  <a :href="`https://github.com/${user.github}`" target="_blank" rel="noopener noreferrer" class="flex items-center text-sm text-gray-600 hover:text-gray-900">
                    <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    GitHub: {{ user.github }}
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- Purchase History -->
          <div class="md:col-span-2">
            <div class="bg-white rounded-lg shadow-sm p-6">
              <h2 class="text-xl font-semibold mb-4">Purchase History</h2>
              
              <div v-if="!(user as any).purchases || (user as any).purchases.length === 0" class="text-gray-500 text-center py-8">
                You haven't purchased any plugins yet.
              </div>
              
              <div v-else class="space-y-4">
                <div 
                  v-for="purchase in (user as any).purchases || []" 
                  :key="purchase.id"
                  class="border border-gray-200 rounded-lg p-4"
                >
                  <div class="flex justify-between items-start">
                    <div>
                      <h3 class="font-medium">{{ purchase.plugin.title }}</h3>
                      <p class="text-sm text-gray-600">Purchased on {{ formatDate(purchase.createdAt) }}</p>
                    </div>
                    <div class="text-right">
                      <p class="font-medium">${{ purchase.plugin.price }}</p>
                      <span class="inline-block px-2 py-1 text-xs rounded-full"
                            :class="getStatusClass(purchase.status)">
                        {{ purchase.status }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Edit Profile Modal -->
    <EditProfileModal
      v-if="showEditModal"
      :user="user!"
      @close="showEditModal = false"
      @success="handleProfileUpdate"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import EditProfileModal from '@/components/EditProfileModal.vue'
import type { User } from '@/types'

const router = useRouter()
const authStore = useAuthStore()
const toastStore = useToastStore()

const user = computed(() => authStore.user)
const showEditModal = ref(false)

const hasSocialLinks = computed(() => {
  return user.value?.github
})

const logout = async () => {
  await authStore.logout()
  router.push('/login')
}

const handleProfileUpdate = async (formData: any) => {
  const success = await authStore.updateProfile(formData)
  
  if (success) {
    toastStore.success('Profile updated successfully!')
  } else {
    toastStore.error(authStore.error || 'Failed to update profile')
  }
}

const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString()
}

const getStatusClass = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'bg-green-100 text-green-800'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'failed':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}
</script>