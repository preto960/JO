<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <template v-if="authStore.isAuthenticated">
      <Navigation />
      <main>
        <router-view />
      </main>
    </template>
    <template v-else>
      <router-view />
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import Navigation from '@/components/Navigation.vue'

const authStore = useAuthStore()

onMounted(() => {
  authStore.initializeAuth()
})
</script>