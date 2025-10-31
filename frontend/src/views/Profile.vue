<template>
  <div class="h-full overflow-hidden">
    <div class="h-full overflow-y-auto">
      <div class="space-y-4">
        <!-- Page Title -->
        <div class="mb-4">
          <h1 class="text-xl font-bold text-gray-900 dark:text-white">My Profile</h1>
          <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage your personal information</p>
        </div>

        <!-- Two Column Layout -->
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
          
          <!-- Left Column - Profile Card -->
          <div class="lg:col-span-1">
            <div class="card text-center">
              <!-- Avatar -->
              <div class="w-20 h-20 bg-gray-900 dark:bg-white rounded-full flex items-center justify-center mx-auto mb-3">
                <span class="text-white dark:text-gray-900 font-bold text-xl">
                  {{ userInitials }}
                </span>
              </div>
              
              <!-- User Info -->
              <h3 class="text-sm font-semibold text-gray-900 dark:text-white">
                {{ profile.firstName }} {{ profile.lastName }}
              </h3>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">{{ profile.email }}</p>
              
              <!-- Role Badge -->
              <div class="mt-3">
                <span class="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                  {{ profile.role === 'ADMIN' ? 'Administrator' : 'User' }}
                </span>
              </div>

              <!-- Upload Photo -->
              <button type="button" class="w-full mt-4 px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md text-xs font-medium transition-colors flex items-center justify-center">
                <Upload class="w-3 h-3 mr-2" />
                Change Photo
              </button>

              <!-- Account Info -->
              <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2 text-left">
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Member since</p>
                  <p class="text-xs text-gray-900 dark:text-white mt-1">{{ formatDate(profile.createdAt) }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Status</p>
                  <p class="text-xs text-green-500 mt-1">Active</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column - Forms -->
          <div class="lg:col-span-3 space-y-4">
            
            <!-- Personal Information & Password in 2 columns -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <!-- Personal Information -->
              <div class="card">
                <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">Personal Information</h3>
                <form @submit.prevent="saveProfile" class="space-y-3">
                  <div>
                    <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">First Name</label>
                    <input 
                      v-model="profile.firstName" 
                      type="text" 
                      required
                      class="input-field text-sm py-2" 
                    />
                  </div>
                  
                  <div>
                    <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
                    <input 
                      v-model="profile.lastName" 
                      type="text" 
                      required
                      class="input-field text-sm py-2" 
                    />
                  </div>

                  <div>
                    <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                    <input 
                      v-model="profile.email" 
                      type="email" 
                      required
                      class="input-field text-sm py-2" 
                    />
                  </div>

                  <div class="flex justify-end pt-1">
                    <button type="submit" class="btn-primary text-xs py-2 px-4">
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>

              <!-- Change Password -->
              <div class="card">
                <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">Change Password</h3>
                <form @submit.prevent="changePassword" class="space-y-3">
                  <div>
                    <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
                    <input 
                      v-model="passwordForm.currentPassword" 
                      type="password" 
                      required
                      class="input-field text-sm py-2" 
                    />
                  </div>

                  <div>
                    <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                    <input 
                      v-model="passwordForm.newPassword" 
                      type="password" 
                      required
                      minlength="8"
                      class="input-field text-sm py-2" 
                    />
                  </div>
                  
                  <div>
                    <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm Password</label>
                    <input 
                      v-model="passwordForm.confirmPassword" 
                      type="password" 
                      required
                      class="input-field text-sm py-2" 
                    />
                  </div>

                  <div class="flex justify-end pt-1">
                    <button type="submit" class="btn-primary text-xs py-2 px-4">
                      Update Password
                    </button>
                  </div>
                </form>
              </div>

            </div>

            <!-- Danger Zone -->
            <div class="card border border-red-200 dark:border-red-900/50">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-sm font-semibold text-red-600 dark:text-red-400">Delete Account</h3>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Permanently delete your account and all data</p>
                </div>
                <button 
                  type="button" 
                  class="px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-xs rounded-md transition-colors flex-shrink-0"
                  @click="confirmDeleteAccount"
                >
                  Delete
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Upload, Save, Lock, AlertTriangle } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const profile = ref({
  firstName: '',
  lastName: '',
  email: '',
  role: 'USER',
  createdAt: new Date(),
  updatedAt: new Date()
})

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const userInitials = computed(() => {
  const first = profile.value.firstName?.[0] || ''
  const last = profile.value.lastName?.[0] || ''
  return (first + last).toUpperCase() || 'U'
})

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const saveProfile = async () => {
  try {
    // TODO: Implement API call to update profile
    toast.success('Profile updated successfully')
  } catch (error) {
    toast.error('Failed to update profile')
    console.error('Error updating profile:', error)
  }
}

const changePassword = async () => {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    toast.error('Passwords do not match')
    return
  }

  try {
    // TODO: Implement API call to change password
    toast.success('Password changed successfully')
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  } catch (error) {
    toast.error('Failed to change password')
    console.error('Error changing password:', error)
  }
}

const confirmDeleteAccount = () => {
  if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
    deleteAccount()
  }
}

const deleteAccount = async () => {
  try {
    // TODO: Implement API call to delete account
    toast.success('Account deleted successfully')
    authStore.logout()
    router.push('/login')
  } catch (error) {
    toast.error('Failed to delete account')
    console.error('Error deleting account:', error)
  }
}

onMounted(() => {
  // Load user data from auth store
  if (authStore.user) {
    profile.value = {
      firstName: authStore.user.firstName || '',
      lastName: authStore.user.lastName || '',
      email: authStore.user.email || '',
      role: authStore.user.role || 'USER',
      createdAt: authStore.user.createdAt || new Date(),
      updatedAt: authStore.user.updatedAt || new Date()
    }
  }
})
</script>

