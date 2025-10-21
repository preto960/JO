<template>
  <div class="min-h-screen bg-white flex items-center justify-center">
    <div class="w-full max-w-sm p-6">
      <div class="text-center mb-8">
        <h1 class="text-2xl font-light text-gray-900">Create Account</h1>
        <p class="text-sm text-gray-500 mt-2">Join the admin panel</p>
      </div>
      
      <form @submit.prevent="handleRegister" class="space-y-4">
        <div>
          <input
            v-model="email"
            type="email"
            placeholder="Email"
            required
            class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 text-sm"
          />
        </div>
        
        <div>
          <input
            v-model="username"
            type="text"
            placeholder="Username"
            required
            class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 text-sm"
          />
        </div>
        
        <div>
          <input
            v-model="password"
            type="password"
            placeholder="Password"
            required
            class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 text-sm"
          />
        </div>

        <div v-if="error" class="text-red-500 text-xs text-center">
          {{ error }}
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 text-sm"
        >
          {{ loading ? 'Creating account...' : 'Register' }}
        </button>
      </form>

      <div class="text-center mt-6">
        <p class="text-xs text-gray-500">
          Already have an account? 
          <router-link to="/login" class="text-gray-900 hover:underline">
            Sign In
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
const username = ref('')
const password = ref('')

const loading = computed(() => authStore.loading)
const error = computed(() => authStore.error)

const handleRegister = async () => {
  try {
    const success = await authStore.register(email.value, username.value, password.value)
    if (success) {
      toastStore.success('Registration successful! Welcome to the admin panel.')
      router.push('/dashboard')
    } else {
      toastStore.error(error.value || 'Registration failed')
    }
  } catch (err) {
    toastStore.error('An unexpected error occurred during registration')
  }
}
</script>