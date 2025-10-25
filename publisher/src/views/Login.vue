<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-900">
    <div class="max-w-md w-full space-y-8 p-8">
      <!-- Logo and Header -->
      <div class="text-center">
        <div class="flex justify-center mb-6">
          <div class="w-16 h-16 bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl flex items-center justify-center">
            <span class="text-white font-bold text-2xl">N</span>
          </div>
        </div>
        <h2 class="text-3xl font-bold text-white mb-2">
          Welcome to NJO Publisher
        </h2>
        <p class="text-gray-400">
          Sign in to manage your plugin portfolio
        </p>
      </div>

      <!-- Login Form -->
      <form @submit.prevent="handleLogin" class="space-y-6">
        <div class="space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="input-field"
              placeholder="you@example.com"
            />
          </div>
          
          <div>
            <label for="password" class="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              class="input-field"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember"
              v-model="form.remember"
              type="checkbox"
              class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-600 rounded bg-gray-700"
            />
            <label for="remember" class="ml-2 block text-sm text-gray-300">
              Remember me
            </label>
          </div>
          
          <a href="#" class="text-sm text-primary-400 hover:text-primary-300">
            Forgot your password?
          </a>
        </div>

        <div v-if="error" class="p-3 bg-red-900/50 border border-red-700 rounded-lg">
          <p class="text-sm text-red-300">{{ error }}</p>
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="loading">Signing in...</span>
          <span v-else>Sign In</span>
        </button>
      </form>

      <!-- Register Link -->
      <div class="text-center">
        <p class="text-gray-400">
          Don't have an account?
          <router-link to="/register" class="text-primary-400 hover:text-primary-300 font-medium">
            Sign up for free
          </router-link>
        </p>
      </div>

      <!-- Features -->
      <div class="mt-8 pt-8 border-t border-gray-700">
        <div class="grid grid-cols-3 gap-4 text-center">
          <div>
            <div class="text-2xl font-bold gradient-text">AI-Powered</div>
            <div class="text-xs text-gray-400 mt-1">Smart Tools</div>
          </div>
          <div>
            <div class="text-2xl font-bold gradient-text">Analytics</div>
            <div class="text-xs text-gray-400 mt-1">Real-time Data</div>
          </div>
          <div>
            <div class="text-2xl font-bold gradient-text">Global</div>
            <div class="text-xs text-gray-400 mt-1">Worldwide Reach</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const form = ref({
  email: '',
  password: '',
  remember: false
})

const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const result = await authStore.login(form.value.email, form.value.password)
    
    if (result.success) {
      toast.success('Welcome back!')
      router.push('/dashboard')
    } else {
      error.value = result.message || 'Login failed'
    }
  } catch (err) {
    error.value = 'An unexpected error occurred'
  } finally {
    loading.value = false
  }
}
</script>