<template>
  <div class="min-h-screen animated-bg">
    <!-- Background decoration -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div class="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
    </div>

    <!-- Header -->
    <header class="glass fixed top-0 left-0 right-0 z-40 fade-in">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">
          <div class="flex items-center">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg"></div>
              <h1 class="text-xl font-bold text-glow">Profile</h1>
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
            class="glass-button px-4 py-2 text-sm font-medium bg-white/20 border-white/30"
          >
            Profile
          </router-link>
          <router-link 
            to="/settings" 
            class="glass-button px-4 py-2 text-sm font-medium hover:bg-white/20 transition-all duration-300"
          >
            Settings
          </router-link>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="pt-32 pb-8 px-4 relative z-10">
      <div class="max-w-7xl mx-auto">
        <!-- Profile Header -->
        <div class="glass-card p-8 mb-8 slide-up">
          <div class="flex justify-between items-center">
            <div class="flex items-center space-x-6">
              <div class="w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                <span class="text-3xl font-bold text-white text-glow">
                  {{ user?.username?.charAt(0).toUpperCase() }}
                </span>
              </div>
              <div>
                <h1 class="text-3xl font-bold text-glow mb-2">{{ user?.username }}</h1>
                <p class="text-lg opacity-80">{{ user?.email }}</p>
                <div class="flex items-center space-x-2 mt-2">
                  <span class="glass px-3 py-1 rounded-full text-sm">
                    {{ user?.role }}
                  </span>
                  <span class="text-sm opacity-60">
                    Member since {{ formatDate(user?.createdAt) }}
                  </span>
                </div>
              </div>
            </div>
            <button
              @click="showEditModal = true"
              class="glass-button bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 transition-all duration-300"
            >
              Edit Profile
            </button>
          </div>
        </div>
        
        <div class="grid md:grid-cols-3 gap-8">
          <!-- Profile Information -->
          <div class="md:col-span-1 space-y-6">
            <!-- Profile Details -->
            <div class="glass-card p-6 slide-up" style="animation-delay: 0.1s">
              <h2 class="text-xl font-bold text-glow mb-6">Profile Information</h2>
              <div class="space-y-4">
                <div v-if="user?.bio">
                  <label class="block text-sm font-medium mb-2 opacity-80">Bio</label>
                  <p class="opacity-90">{{ user.bio }}</p>
                </div>
                <div v-if="user?.website">
                  <label class="block text-sm font-medium mb-2 opacity-80">Website</label>
                  <p class="opacity-90">
                    <a :href="user.website" target="_blank" rel="noopener noreferrer" class="text-glow hover:opacity-80 transition-all duration-300">
                      {{ user.website }}
                    </a>
                  </p>
                </div>
                <div v-if="user?.paypalEmail">
                  <label class="block text-sm font-medium mb-2 opacity-80">PayPal Email</label>
                  <p class="opacity-90">{{ user.paypalEmail }}</p>
                </div>
                <div v-if="!user?.bio && !user?.website && !user?.paypalEmail">
                  <p class="opacity-60 text-center py-4">No additional information provided</p>
                </div>
              </div>
            </div>

            <!-- Social Links -->
            <div v-if="hasSocialLinks" class="glass-card p-6 slide-up" style="animation-delay: 0.2s">
              <h2 class="text-xl font-bold text-glow mb-6">Social Links</h2>
              <div class="space-y-3">
                <div v-if="user?.github" class="flex items-center space-x-3 p-3 glass rounded-lg hover:bg-white/20 transition-all duration-300">
                  <div class="w-8 h-8 bg-gradient-to-r from-gray-700 to-gray-900 rounded-lg flex items-center justify-center">
                    <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </div>
                  <div>
                    <p class="font-medium">GitHub</p>
                    <a :href="`https://github.com/${user.github}`" target="_blank" rel="noopener noreferrer" class="text-sm opacity-80 hover:opacity-100 transition-all duration-300">
                      {{ user.github }}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Purchase History -->
          <div class="md:col-span-2">
            <div class="glass-card p-6 slide-up" style="animation-delay: 0.3s">
              <h2 class="text-xl font-bold text-glow mb-6">Purchase History</h2>
              
              <div v-if="!(user as any).purchases || (user as any).purchases.length === 0" class="text-center py-12">
                <div class="w-16 h-16 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                  </svg>
                </div>
                <p class="opacity-80 text-lg mb-2">No purchases yet</p>
                <p class="opacity-60 text-sm">Start exploring the marketplace to find amazing plugins!</p>
                <router-link 
                  to="/marketplace" 
                  class="inline-block glass-button bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 mt-4 transition-all duration-300"
                >
                  Browse Marketplace
                </router-link>
              </div>
              
              <div v-else class="space-y-4">
                <div 
                  v-for="purchase in (user as any).purchases || []" 
                  :key="purchase.id"
                  class="glass-card p-4 glass-hover"
                >
                  <div class="flex justify-between items-start">
                    <div class="flex-1">
                      <h3 class="font-bold text-lg mb-2">{{ purchase.plugin.title }}</h3>
                      <p class="opacity-80 text-sm">Purchased on {{ formatDate(purchase.createdAt) }}</p>
                    </div>
                    <div class="text-right ml-4">
                      <p class="font-bold text-lg text-glow">${{ purchase.plugin.price }}</p>
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
      return 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
    case 'pending':
      return 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white'
    case 'failed':
      return 'bg-gradient-to-r from-red-500 to-pink-600 text-white'
    default:
      return 'glass text-white'
  }
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