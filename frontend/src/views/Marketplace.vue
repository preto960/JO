<template>
  <div class="min-h-screen animated-bg">
    <!-- Background decoration -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div class="absolute top-40 left-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
    </div>

    <!-- Header -->
    <header class="glass fixed top-0 left-0 right-0 z-40 fade-in">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">
          <div class="flex items-center">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg"></div>
              <h1 class="text-xl font-bold text-glow">Plugin Marketplace</h1>
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
            class="glass-button px-4 py-2 text-sm font-medium bg-white/20 border-white/30"
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
        <!-- Header Section -->
        <div class="glass-card p-8 mb-8 slide-up">
          <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <h2 class="text-3xl font-bold text-glow mb-2">Available Plugins</h2>
              <p class="text-lg opacity-80">Browse and manage plugins for your applications</p>
            </div>
            <div class="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search plugins..."
                class="glass-input w-full sm:w-auto"
              />
              <select
                v-model="selectedCategory"
                class="glass-input w-full sm:w-auto"
              >
                <option value="">All Categories</option>
                <option value="productivity">Productivity</option>
                <option value="analytics">Analytics</option>
                <option value="security">Security</option>
                <option value="integration">Integration</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="glass-card p-6 glass-hover slide-up" style="animation-delay: 0.1s">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                  </svg>
                </div>
              </div>
              <div class="ml-4 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium opacity-80">Total Plugins</dt>
                  <dd class="text-2xl font-bold text-glow">{{ filteredPlugins.length }}</dd>
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
                  <dt class="text-sm font-medium opacity-80">Installed</dt>
                  <dd class="text-2xl font-bold text-glow">12</dd>
                </dl>
              </div>
            </div>
          </div>

          <div class="glass-card p-6 glass-hover slide-up" style="animation-delay: 0.3s">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
              <div class="ml-4 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium opacity-80">Updates Available</dt>
                  <dd class="text-2xl font-bold text-glow">3</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <!-- Plugins Grid -->
        <div v-if="loading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          <p class="mt-4 opacity-80 text-lg">Loading plugins...</p>
        </div>

        <div v-else-if="error" class="glass-card p-8 text-center">
          <div class="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <p class="text-red-300 text-lg">{{ error }}</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="plugin in filteredPlugins" 
            :key="plugin.id"
            class="glass-card p-6 glass-hover slide-up"
            :style="`animation-delay: ${0.1 + (Number(plugin.id) % 10) * 0.05}s`"
          >
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-bold text-glow">{{ plugin.title }}</h3>
              <span class="glass px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
                {{ plugin.category }}
              </span>
            </div>
            
            <p class="opacity-90 text-sm mb-4 line-clamp-2">{{ plugin.description }}</p>
            
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center">
                <div class="flex items-center">
                  <svg class="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  <span class="text-sm opacity-90">{{ plugin.avgRating.toFixed(1) }}</span>
                </div>
                <span class="text-sm opacity-70 ml-2">({{ plugin._count.reviews }} reviews)</span>
              </div>
              <span class="text-lg font-bold text-glow">${{ plugin.price }}</span>
            </div>

            <div class="flex flex-wrap gap-2 mb-4">
              <span 
                v-for="tag in plugin.tags.slice(0, 3)" 
                :key="tag"
                class="glass px-2 py-1 rounded text-xs font-medium"
              >
                {{ tag }}
              </span>
            </div>

            <div class="flex space-x-2">
              <button 
                @click="installPlugin(plugin)"
                class="flex-1 glass-button bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0 transition-all duration-300"
              >
                Install
              </button>
              <button 
                @click="viewDetails(plugin)"
                class="flex-1 glass-button hover:bg-white/20 transition-all duration-300"
              >
                Details
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="!loading && !error && filteredPlugins.length === 0" class="glass-card p-12 text-center">
          <div class="w-16 h-16 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-glow mb-2">No plugins found</h3>
          <p class="opacity-80 mb-4">Try adjusting your search or filter criteria</p>
          <button 
            @click="clearFilters"
            class="glass-button bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 transition-all duration-300"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { usePluginStore } from '@/stores/plugins'
import type { Plugin } from '@/types'

const router = useRouter()
const authStore = useAuthStore()
const pluginStore = usePluginStore()

const searchQuery = ref('')
const selectedCategory = ref('')

const user = computed(() => authStore.user)
const loading = computed(() => pluginStore.loading)
const error = computed(() => pluginStore.error)
const plugins = computed(() => pluginStore.plugins)

const filteredPlugins = computed(() => {
  let filtered = plugins.value

  if (searchQuery.value) {
    filtered = filtered.filter(plugin => 
      plugin.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      plugin.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (selectedCategory.value) {
    filtered = filtered.filter(plugin => plugin.category === selectedCategory.value)
  }

  return filtered
})

const logout = () => {
  authStore.logout()
  router.push('/login')
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = ''
}

const installPlugin = (plugin: Plugin) => {
  console.log('Installing plugin:', plugin.title)
  // TODO: Implement plugin installation logic
}

const viewDetails = (plugin: Plugin) => {
  console.log('Viewing details for:', plugin.title)
  // TODO: Implement plugin details modal or navigation
}

onMounted(async () => {
  await pluginStore.fetchPlugins()
})
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

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>