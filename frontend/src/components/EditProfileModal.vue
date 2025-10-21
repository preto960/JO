<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-lg font-medium text-gray-900">Edit Profile</h3>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Basic Information -->
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="text-md font-medium text-gray-900 mb-4">Basic Information</h4>
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                id="username"
                v-model="form.username"
                required
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                v-model="form.email"
                disabled
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-500 sm:text-sm"
              />
              <p class="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>
          </div>
        </div>

        <!-- Additional Information -->
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="text-md font-medium text-gray-900 mb-4">Additional Information</h4>
          <div class="space-y-4">
            <div>
              <label for="bio" class="block text-sm font-medium text-gray-700">Bio</label>
              <textarea
                id="bio"
                v-model="form.bio"
                rows="3"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Tell us about yourself..."
              ></textarea>
            </div>
            <div>
              <label for="website" class="block text-sm font-medium text-gray-700">Website</label>
              <input
                type="url"
                id="website"
                v-model="form.website"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="https://yourwebsite.com"
              />
            </div>
            <div>
              <label for="paypalEmail" class="block text-sm font-medium text-gray-700">PayPal Email</label>
              <input
                type="email"
                id="paypalEmail"
                v-model="form.paypalEmail"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="paypal@example.com"
              />
            </div>
          </div>
        </div>

        <!-- Social Links -->
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="text-md font-medium text-gray-900 mb-4">Social Links</h4>
          <div class="space-y-4">
            <div>
              <label for="github" class="block text-sm font-medium text-gray-700">GitHub</label>
              <input
                type="text"
                id="github"
                v-model="form.github"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="username"
              />
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            @click="$emit('close')"
            class="bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading">Saving...</span>
            <span v-else>Save Changes</span>
          </button>
        </div>
      </form>
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
  Object.keys(form).forEach(key => {
    const formKey = key as keyof typeof form
    const userKey = formKey as keyof User
    form[formKey] = props.user[userKey] || ''
  })
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