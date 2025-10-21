<template>
  <div id="app">
    <main class="min-h-screen bg-gray-50">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

onMounted(() => {
  authStore.loadUserFromStorage()
})
</script>