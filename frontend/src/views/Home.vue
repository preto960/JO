<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div class="text-center">
          <h1 class="text-4xl md:text-6xl font-bold mb-6">
            Discover Amazing Plugins
          </h1>
          <p class="text-xl md:text-2xl mb-8 text-blue-100">
            Extend your applications with powerful plugins from our marketplace
          </p>
          <div class="flex justify-center space-x-4">
            <router-link 
              to="/plugins" 
              class="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Browse Plugins
            </router-link>
            <router-link 
              v-if="isAuthenticated && user?.role === 'DEVELOPER'"
              to="/dashboard" 
              class="bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-400 transition"
            >
              Start Selling
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Our Marketplace?
          </h2>
          <p class="text-xl text-gray-600">
            The best platform for discovering and selling quality plugins
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <div class="text-center p-6">
            <div class="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Quality Plugins</h3>
            <p class="text-gray-600">
              Every plugin is carefully reviewed to ensure quality and security
            </p>
          </div>

          <div class="text-center p-6">
            <div class="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Secure Transactions</h3>
            <p class="text-gray-600">
              Safe and secure payment processing for all purchases
            </p>
          </div>

          <div class="text-center p-6">
            <div class="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Instant Downloads</h3>
            <p class="text-gray-600">
              Get immediate access to your purchased plugins
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Popular Plugins -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Popular Plugins
          </h2>
          <p class="text-xl text-gray-600">
            Check out our most popular plugins this week
          </p>
        </div>

        <div v-if="loading" class="text-center py-8">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>

        <div v-else-if="error" class="text-center py-8 text-red-600">
          {{ error }}
        </div>

        <div v-else class="grid md:grid-cols-3 gap-8">
          <div 
            v-for="plugin in plugins.slice(0, 6)" 
            :key="plugin.id"
            class="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition"
          >
            <div class="p-6">
              <h3 class="text-xl font-semibold mb-2">{{ plugin.title }}</h3>
              <p class="text-gray-600 mb-4">{{ plugin.description }}</p>
              <div class="flex justify-between items-center">
                <span class="text-2xl font-bold text-blue-600">${{ plugin.price }}</span>
                <router-link 
                  :to="`/plugins/${plugin.id}`"
                  class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  View Details
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <div class="text-center mt-12">
          <router-link 
            to="/plugins" 
            class="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            View All Plugins
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { usePluginStore } from '@/stores/plugins'
import { useAuthStore } from '@/stores/auth'

const pluginStore = usePluginStore()
const authStore = useAuthStore()

const loading = computed(() => pluginStore.loading)
const error = computed(() => pluginStore.error)
const plugins = computed(() => pluginStore.plugins)
const isAuthenticated = computed(() => authStore.isAuthenticated)
const user = computed(() => authStore.user)

onMounted(async () => {
  await pluginStore.fetchPlugins({ limit: 6 })
})
</script>