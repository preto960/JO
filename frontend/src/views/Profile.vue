<template>
  <!-- Profile Header -->
  <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
    <div class="flex justify-between items-center">
      <div class="flex items-center space-x-6">
        <div class="w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
          <span class="text-3xl font-bold text-white">
            {{ user?.username?.charAt(0).toUpperCase() }}
          </span>
        </div>
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">{{ user?.username }}</h1>
          <p class="text-lg text-gray-600 dark:text-gray-400">{{ user?.email }}</p>
          <div class="flex items-center space-x-2 mt-2">
            <span class="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 px-3 py-1 rounded-full text-sm">
              {{ user?.role }}
            </span>
            <span class="text-sm text-gray-500 dark:text-gray-400">
              Member since {{ formatDate(user?.createdAt) }}
            </span>
          </div>
        </div>
      </div>
      <button
        @click="showEditModal = true"
        class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
      >
        Edit Profile
      </button>
    </div>
  </div>
  
  <div class="grid md:grid-cols-3 gap-6">
    <!-- Profile Information -->
    <div class="md:col-span-1 space-y-6">
      <!-- Profile Details -->
      <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6">Profile Information</h2>
        <div class="space-y-4">
          <div v-if="user?.bio">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bio</label>
            <p class="text-gray-600 dark:text-gray-400">{{ user.bio }}</p>
          </div>
          <div v-if="user?.website">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Website</label>
            <p class="text-gray-600 dark:text-gray-400">
              <a :href="user.website" target="_blank" rel="noopener noreferrer" class="text-indigo-600 dark:text-indigo-400 hover:underline">
                {{ user.website }}
              </a>
            </p>
          </div>
          <div v-if="user?.paypalEmail">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">PayPal Email</label>
            <p class="text-gray-600 dark:text-gray-400">{{ user.paypalEmail }}</p>
          </div>
          <div v-if="!user?.bio && !user?.website && !user?.paypalEmail">
            <p class="text-gray-500 dark:text-gray-400 text-center py-4">No additional information provided</p>
          </div>
        </div>
      </div>

      <!-- Social Links -->
      <div v-if="hasSocialLinks" class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6">Social Links</h2>
        <div class="space-y-3">
          <div v-if="user?.github" class="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div class="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
              <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </div>
            <div>
              <p class="font-medium text-gray-900 dark:text-white">GitHub</p>
              <a :href="`https://github.com/${user.github}`" target="_blank" rel="noopener noreferrer" class="text-sm text-gray-600 dark:text-gray-400 hover:underline">
                {{ user.github }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Purchase History -->
    <div class="md:col-span-2">
      <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6">Purchase History</h2>
        
        <div v-if="!(user as any).purchases || (user as any).purchases.length === 0" class="text-center py-12">
          <div class="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
            </svg>
          </div>
          <p class="text-gray-600 dark:text-gray-400 text-lg mb-2">No purchases yet</p>
          <p class="text-gray-500 dark:text-gray-500 text-sm">Start exploring the marketplace to find amazing plugins!</p>
          <router-link 
            to="/marketplace" 
            class="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg mt-4 transition-colors duration-200"
          >
            Browse Marketplace
          </router-link>
        </div>
        
        <div v-else class="space-y-4">
          <div 
            v-for="purchase in (user as any).purchases || []" 
            :key="purchase.id"
            class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg"
          >
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-2">{{ purchase.plugin.title }}</h3>
                <p class="text-gray-600 dark:text-gray-400 text-sm">Purchased on {{ formatDate(purchase.createdAt) }}</p>
              </div>
              <div class="text-right ml-4">
                <p class="font-bold text-lg text-gray-900 dark:text-white">${{ purchase.plugin.price }}</p>
                <span class="inline-block px-3 py-1 text-xs rounded-full mt-2"
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

  <!-- Edit Profile Modal -->
  <EditProfileModal
    v-if="showEditModal"
    :user="user!"
    @close="showEditModal = false"
    @success="handleProfileUpdate"
  />
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
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'failed':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
  }
}
</script>