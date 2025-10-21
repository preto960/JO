<template>
  <div class="min-h-screen animated-bg flex items-center justify-center p-4">
    <!-- Background decoration -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div class="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
    </div>

    <!-- Login Card -->
    <div class="glass-card w-full max-w-md p-8 relative z-10 scale-in">
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mb-4">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-glow mb-2">Welcome Back</h1>
        <p class="text-sm opacity-80">Sign in to continue to your account</p>
      </div>
      
      <form @submit.prevent="handleLogin" class="space-y-6">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2 opacity-90">Email</label>
            <input
              v-model="email"
              type="email"
              placeholder="Enter your email"
              required
              class="glass-input w-full"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-2 opacity-90">Password</label>
            <input
              v-model="password"
              type="password"
              placeholder="Enter your password"
              required
              class="glass-input w-full"
            />
          </div>
        </div>

        <div v-if="error" class="glass-card p-3 text-red-300 text-sm text-center border-red-400">
          {{ error }}
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full glass-button bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 py-3 text-base font-medium transition-all duration-300"
        >
          <span v-if="loading" class="flex items-center justify-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Signing in...
          </span>
          <span v-else>Sign In</span>
        </button>
      </form>

      <div class="text-center mt-8">
        <p class="text-sm opacity-80">
          Don't have an account? 
          <router-link to="/register" class="text-white hover:text-glow transition-all duration-300 font-medium">
            Register here
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'

const router = useRouter()
const authStore = useAuthStore()
const toastStore = useToastStore()

const email = ref('')
const password = ref('')

const loading = computed(() => authStore.loading)
const error = computed(() => authStore.error)

const handleLogin = async () => {
  try {
    const success = await authStore.login(email.value, password.value)
    if (success) {
      toastStore.success('Login successful! Welcome back.')
      router.push('/dashboard')
    } else {
      toastStore.error(error.value || 'Login failed')
    }
  } catch (err) {
    toastStore.error('An unexpected error occurred')
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