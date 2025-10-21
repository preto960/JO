<template>
  <div class="min-h-screen bg-white dark:bg-gray-900">
    <!-- Header -->
    <header class="fixed top-0 left-0 right-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div class="px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">
          <div class="flex items-center">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg"></div>
              <h1 class="text-xl font-bold text-gray-900 dark:text-white">Publisher Portal</h1>
            </div>
          </div>
          
          <div class="flex items-center space-x-4">
            <!-- Theme Toggle -->
            <ThemeToggle />
            
            <!-- User Dropdown -->
            <UserDropdown />
          </div>
        </div>
      </div>
    </header>

    <!-- Sidebar -->
    <aside class="fixed left-0 top-16 bottom-0 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-30 flex flex-col">
      <!-- Main Navigation -->
      <nav class="p-4 space-y-2 flex-1">
        <router-link 
          to="/dashboard"
          class="flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200"
          :class="[
            isActiveRoute('/dashboard') 
              ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-r-2 border-indigo-600 dark:border-indigo-400' 
              : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
          ]"
        >
          <HomeIcon class="w-5 h-5" />
          <span>Dashboard</span>
        </router-link>

        <!-- My Plugins (only for publishers) -->
        <router-link 
          v-if="authStore.user?.role === 'PUBLISHER'"
          to="/plugins"
          class="flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200"
          :class="[
            isActiveRoute('/plugins') 
              ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-r-2 border-indigo-600 dark:border-indigo-400' 
              : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
          ]"
        >
          <PuzzleIcon class="w-5 h-5" />
          <span>My Plugins</span>
        </router-link>

        <!-- Analytics (only for publishers) -->
        <router-link 
          v-if="authStore.user?.role === 'PUBLISHER'"
          to="/analytics"
          class="flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200"
          :class="[
            isActiveRoute('/analytics') 
              ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-r-2 border-indigo-600 dark:border-indigo-400' 
              : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
          ]"
        >
          <ChartIcon class="w-5 h-5" />
          <span>Analytics</span>
        </router-link>
      </nav>

      <!-- Bottom Icons Section -->
      <div class="border-t border-gray-200 dark:border-gray-700 p-4">
        <div class="flex justify-around">
          <!-- Export Data Icon -->
          <button 
            @click="exportData"
            class="p-3 rounded-lg transition-colors duration-200"
            :class="[
              'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200'
            ]"
            title="Export Data"
          >
            <ArrowDownTrayIcon class="w-6 h-6" />
          </button>

          <!-- Delete Account Icon -->
          <button 
            @click="deleteAccount"
            class="p-3 rounded-lg transition-colors duration-200"
            :class="[
              'text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400'
            ]"
            title="Delete Account"
          >
            <TrashIcon class="w-6 h-6" />
          </button>

          <!-- Settings Icon -->
          <router-link 
            to="/settings"
            class="p-3 rounded-lg transition-colors duration-200"
            :class="[
              isActiveRoute('/settings') 
                ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' 
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200'
            ]"
            title="Settings"
          >
            <CogIcon class="w-6 h-6" />
          </router-link>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="pt-16 pl-64">
      <div class="p-6">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { h } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import ThemeToggle from '@/components/ThemeToggle.vue'
import UserDropdown from '@/components/UserDropdown.vue'

const route = useRoute()
const authStore = useAuthStore()
const toastStore = useToastStore()

// Icons
const HomeIcon = () => h('svg', { class: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' })
])

const PuzzleIcon = () => h('svg', { class: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5' })
])

const ChartIcon = () => h('svg', { class: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' })
])

const CogIcon = () => h('svg', { class: 'w-6 h-6', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' }),
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z' })
])

const ArrowDownTrayIcon = () => h('svg', { class: 'w-6 h-6', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' })
])

const TrashIcon = () => h('svg', { class: 'w-6 h-6', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' })
])

// Helper function to check if route is active
const isActiveRoute = (to: string) => {
  return route.path.startsWith(to)
}

// Quick Actions functions
const exportData = () => {
  toastStore.info('Data export started. You will receive an email when ready.')
  console.log('Exporting user data...')
}

const deleteAccount = () => {
  if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
    toastStore.warning('Account deletion requested. You will receive a confirmation email.')
    console.log('Deleting account...')
  }
}
</script>