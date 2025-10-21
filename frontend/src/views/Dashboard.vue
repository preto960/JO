<template>
  <div class="space-y-6">
    <!-- Welcome Section -->
    <div class="bg-white dark:bg-gray-800 p-8 rounded-lg border border-gray-200 dark:border-gray-700">
      <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome back, {{ user?.username }}! 👋</h2>
      <p class="text-lg text-gray-600 dark:text-gray-300">Here's what's happening with your plugin marketplace today.</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200">
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
              <dt class="text-sm font-medium text-gray-600 dark:text-gray-300">Total Users</dt>
              <dd class="text-2xl font-bold text-gray-900 dark:text-white">1,234</dd>
            </dl>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200">
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
              <dt class="text-sm font-medium text-gray-600 dark:text-gray-300">Active Plugins</dt>
              <dd class="text-2xl font-bold text-gray-900 dark:text-white">42</dd>
            </dl>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200">
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
              <dt class="text-sm font-medium text-gray-600 dark:text-gray-300">Revenue</dt>
              <dd class="text-2xl font-bold text-gray-900 dark:text-white">$8,420</dd>
            </dl>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200">
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
              <dt class="text-sm font-medium text-gray-600 dark:text-gray-300">Growth Rate</dt>
              <dd class="text-2xl font-bold text-gray-900 dark:text-white">+12%</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="bg-white dark:bg-gray-800 p-8 rounded-lg border border-gray-200 dark:border-gray-700">
      <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-6">Recent Activity</h3>
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
            <p class="font-medium text-gray-900 dark:text-white">New user registration</p>
            <p class="text-sm text-gray-600 dark:text-gray-300">A new user joined the platform</p>
          </div>
          <div class="text-sm text-gray-500 dark:text-gray-400">2 hours ago</div>
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
            <p class="font-medium text-gray-900 dark:text-white">Plugin updated successfully</p>
            <p class="text-sm text-gray-600 dark:text-gray-300">Plugin "Analytics Dashboard" was updated to v2.1.0</p>
          </div>
          <div class="text-sm text-gray-500 dark:text-gray-400">4 hours ago</div>
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
            <p class="font-medium text-gray-900 dark:text-white">System maintenance completed</p>
            <p class="text-sm text-gray-600 dark:text-gray-300">Scheduled maintenance was completed successfully</p>
          </div>
          <div class="text-sm text-gray-500 dark:text-gray-400">6 hours ago</div>
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
</script>