<template>
  <div class="min-h-screen bg-gray-900 flex items-center justify-center p-4">
    <div class="max-w-md w-full">
      <!-- Logo -->
      <div class="text-center mb-8">
        <!-- Logo Image or Default Icon -->
        <div class="inline-flex w-16 h-16 rounded-2xl items-center justify-center mb-4">
          <img 
            v-if="siteLogo" 
            :src="siteLogo" 
            :alt="siteName" 
            class="max-w-full max-h-full object-contain"
          />
          <div v-else class="w-full h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center">
            <span class="text-white font-bold text-3xl">{{ siteInitial }}</span>
          </div>
        </div>
        <h1 class="text-3xl font-bold text-white mb-2">{{ siteName }}</h1>
        <p class="text-gray-400">Sign in to manage your system</p>
      </div>

      <!-- Login Form -->
      <div class="card">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <input
              v-model="email"
              type="email"
              required
              class="input-field"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              v-model="password"
              type="password"
              required
              class="input-field"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="btn-primary w-full"
          >
            <span v-if="!loading">Sign In</span>
            <span v-else class="flex items-center justify-center">
              <svg class="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            </span>
          </button>
        </form>

        <!-- Test Credentials -->
        <div class="mt-6 p-4 bg-gray-700/50 rounded-lg">
          <p class="text-xs text-gray-400 mb-2">Test Credentials:</p>
          <p class="text-xs text-gray-300">admin@njo.com / password123</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useSettingsStore } from '@/stores/settings'
import { useToast } from 'vue-toastification'

const router = useRouter()
const authStore = useAuthStore()
const settingsStore = useSettingsStore()
const toast = useToast()

const email = ref('')
const password = ref('')
const loading = ref(false)

// Get site settings
const siteName = computed(() => settingsStore.siteName || 'Admin Panel')
const siteLogo = computed(() => settingsStore.siteLogo)
const siteInitial = computed(() => siteName.value.charAt(0).toUpperCase())

const handleLogin = async () => {
  loading.value = true
  const result = await authStore.login(email.value, password.value)

  if (result.success) {
    // Reload settings with authenticated endpoint after successful login
    await settingsStore.fetchSettings(false)
    loading.value = false
    toast.success('Welcome back!')
    router.push('/dashboard')
  } else {
    loading.value = false
    toast.error(result.message || 'Login failed')
  }
}

// Load settings on mount (use public endpoint since user is not authenticated)
onMounted(async () => {
  await settingsStore.fetchSettings(true)
})
</script>

