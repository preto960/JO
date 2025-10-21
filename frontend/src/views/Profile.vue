<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>
      
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
        </div>

        <!-- Purchase History -->
        <div class="md:col-span-2">
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-xl font-semibold mb-4">Purchase History</h2>
            
            <div v-if="!user?.purchases || user.purchases.length === 0" class="text-gray-500 text-center py-8">
              You haven't purchased any plugins yet.
            </div>
            
            <div v-else class="space-y-4">
              <div 
                v-for="purchase in user.purchases" 
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
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const user = computed(() => authStore.user)

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