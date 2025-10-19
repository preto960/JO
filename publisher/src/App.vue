<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <router-link to="/" class="text-xl font-bold text-gray-800">
              Publisher Dashboard
            </router-link>
          </div>
          <div class="flex items-center space-x-4">
            <router-link to="/plugins" class="text-gray-600 hover:text-gray-900">
              My Plugins
            </router-link>
            <router-link to="/analytics" class="text-gray-600 hover:text-gray-900">
              Analytics
            </router-link>
            <router-link to="/settings" class="text-gray-600 hover:text-gray-900">
              Settings
            </router-link>
            <div v-if="isAuthenticated" class="relative">
              <button @click="toggleUserMenu" class="text-gray-600 hover:text-gray-900">
                {{ user?.username }}
              </button>
              <div v-if="showUserMenu" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <router-link to="/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Profile
                </router-link>
                <button @click="logout" class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Logout
                </button>
              </div>
            </div>
            <router-link v-else to="/login" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
              Login
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const showUserMenu = ref(false)

const isAuthenticated = computed(() => authStore.isAuthenticated)
const user = computed(() => authStore.user)

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const logout = async () => {
  await authStore.logout()
  router.push('/login')
}

onMounted(() => {
  authStore.loadUserFromStorage()
})
</script>