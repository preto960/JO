<template>
  <div class="min-h-screen animated-bg">
    <!-- Background decoration -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div class="absolute top-40 left-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
    </div>

    <!-- Header -->
    <header class="glass fixed top-0 left-0 right-0 z-40 fade-in">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">
          <div class="flex items-center">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg"></div>
              <h1 class="text-xl font-bold text-glow">Dashboard</h1>
            </div>
          </div>
          <div class="flex items-center space-x-4">
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
            class="glass-button px-4 py-2 text-sm font-medium bg-white/20 border-white/30"
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
        <!-- Welcome Section -->
        <div class="glass-card p-8 mb-8 slide-up">
          <h2 class="text-3xl font-bold text-glow mb-2">Welcome back, {{ user?.username }}! 👋</h2>
          <p class="text-lg opacity-80">Here's what's happening with your plugin marketplace today.</p>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="glass-card p-6 glass-hover slide-up" style="animation-delay: 0.1s">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
                  </svg>
                </div>
              </div>
              <div class="ml-4 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium opacity-80">Total Users</dt>
                  <dd class="text-2xl font-bold text-glow">1,234</dd>
                </dl>
              </div>
            </div>
          </div>

          <div class="glass-card p-6 glass-hover slide-up" style="animation-delay: 0.2s">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
              <div class="ml-4 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium opacity-80">Active Plugins</dt>
                  <dd class="text-2xl font-bold text-glow">42</dd>
                </dl>
              </div>
            </div>
          </div>

          <div class="glass-card p-6 glass-hover slide-up" style="animation-delay: 0.3s">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                  </svg>
                </div>
              </div>
              <div class="ml-4 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium opacity-80">Revenue</dt>
                  <dd class="text-2xl font-bold text-glow">$8,420</dd>
                </dl>
              </div>
            </div>
          </div>

          <div class="glass-card p-6 glass-hover slide-up" style="animation-delay: 0.4s">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                  </svg>
                </div>
              </div>
              <div class="ml-4 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium opacity-80">Growth Rate</dt>
                  <dd class="text-2xl font-bold text-glow">+12%</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="glass-card p-8 slide-up" style="animation-delay: 0.5s">
          <h3 class="text-xl font-bold text-glow mb-6">Recent Activity</h3>
          <div class="space-y-6">
            <div class="flex items-start space-x-4">
              <div class="flex-shrink-0">
                <div class="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
              </div>
              <div class="flex-1">
                <p class="font-medium">New user registration</p>
                <p class="text-sm opacity-70">A new user joined the platform</p>
              </div>
              <div class="text-sm opacity-60">2 hours ago</div>
            </div>

            <div class="flex items-start space-x-4">
              <div class="flex-shrink-0">
                <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
                  </svg>
                </div>
              </div>
              <div class="flex-1">
                <p class="font-medium">Plugin updated successfully</p>
                <p class="text-sm opacity-70">Plugin "Analytics Dashboard" was updated to v2.1.0</p>
              </div>
              <div class="text-sm opacity-60">4 hours ago</div>
            </div>

            <div class="flex items-start space-x-4">
              <div class="flex-shrink-0">
                <div class="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
              <div class="flex-1">
                <p class="font-medium">System maintenance completed</p>
                <p class="text-sm opacity-70">Scheduled maintenance was completed successfully</p>
              </div>
              <div class="text-sm opacity-60">6 hours ago</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'

const router = useRouter()
const authStore = useAuthStore()
const toastStore = useToastStore()

const user = computed(() => authStore.user)

const logout = () => {
  authStore.logout()
  toastStore.success('Logged out successfully')
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