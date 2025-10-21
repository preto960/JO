<template>
  <div class="fixed inset-0 bg-black/60 backdrop-blur-sm overflow-y-auto h-full w-full z-50 fade-in">
    <div class="relative min-h-screen flex items-center justify-center p-4">
      <div class="glass-card w-full max-w-2xl scale-in">
        <!-- Header -->
        <div class="flex justify-between items-center mb-8">
          <h3 class="text-2xl font-bold text-glow">Edit Profile</h3>
          <button
            @click="$emit('close')"
            class="glass-button hover:bg-white/20 transition-all duration-300"
          >
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="space-y-8">
          <!-- Basic Information -->
          <div class="glass-card p-6">
            <h4 class="text-lg font-bold text-glow mb-6">Basic Information</h4>
            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <label for="username" class="block text-sm font-medium mb-2 opacity-90">Username</label>
                <input
                  type="text"
                  id="username"
                  v-model="form.username"
                  required
                  class="glass-input w-full"
                />
              </div>
              <div>
                <label for="email" class="block text-sm font-medium mb-2 opacity-90">Email</label>
                <input
                  type="email"
                  id="email"
                  v-model="form.email"
                  disabled
                  class="glass-input w-full opacity-60"
                />
                <p class="text-xs opacity-60 mt-2">Email cannot be changed</p>
              </div>
            </div>
          </div>

          <!-- Additional Information -->
          <div class="glass-card p-6">
            <h4 class="text-lg font-bold text-glow mb-6">Additional Information</h4>
            <div class="space-y-6">
              <div>
                <label for="bio" class="block text-sm font-medium mb-2 opacity-90">Bio</label>
                <textarea
                  id="bio"
                  v-model="form.bio"
                  rows="4"
                  class="glass-input w-full resize-none"
                  placeholder="Tell us about yourself..."
                ></textarea>
              </div>
              <div>
                <label for="website" class="block text-sm font-medium mb-2 opacity-90">Website</label>
                <input
                  type="url"
                  id="website"
                  v-model="form.website"
                  class="glass-input w-full"
                  placeholder="https://yourwebsite.com"
                />
              </div>
              <div>
                <label for="paypalEmail" class="block text-sm font-medium mb-2 opacity-90">PayPal Email</label>
                <input
                  type="email"
                  id="paypalEmail"
                  v-model="form.paypalEmail"
                  class="glass-input w-full"
                  placeholder="paypal@example.com"
                />
              </div>
            </div>
          </div>

          <!-- Social Links -->
          <div class="glass-card p-6">
            <h4 class="text-lg font-bold text-glow mb-6">Social Links</h4>
            <div class="space-y-6">
              <div>
                <label for="github" class="block text-sm font-medium mb-2 opacity-90">GitHub</label>
                <input
                  type="text"
                  id="github"
                  v-model="form.github"
                  class="glass-input w-full"
                  placeholder="username"
                />
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              @click="$emit('close')"
              class="glass-button hover:bg-white/20 transition-all duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="glass-button bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="loading" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
              <span v-else>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import type { User } from '@/types'

interface Props {
  user: User
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  success: [formData: any]
}>()

const authStore = useAuthStore()
const toastStore = useToastStore()
const loading = ref(false)

const form = reactive({
  username: '',
  email: '',
  bio: '',
  website: '',
  github: '',
  paypalEmail: ''
})

onMounted(() => {
  // Initialize form with current user data
  form.username = props.user.username || ''
  form.email = props.user.email || ''
  form.bio = props.user.bio || ''
  form.website = props.user.website || ''
  form.github = props.user.github || ''
  form.paypalEmail = props.user.paypalEmail || ''
})

const handleSubmit = async () => {
  loading.value = true
  
  try {
    const success = await authStore.updateProfile(form)
    
    if (success) {
      toastStore.success('Profile updated successfully!')
      emit('success', form)
      emit('close')
    } else {
      toastStore.error(authStore.error || 'Failed to update profile')
    }
  } catch (error) {
    console.error('Error updating profile:', error)
    toastStore.error('An unexpected error occurred')
  } finally {
    loading.value = false
  }
}
</script>