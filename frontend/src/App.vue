<template>
  <div id="app">
    <!-- Toast Container -->
    <div
      v-if="toastStore.toasts.length > 0"
      class="fixed z-50 top-4 right-4 space-y-2"
    >
      <Toast
        v-for="toast in toastStore.toasts"
        :key="toast.id"
        :show="true"
        :type="toast.type"
        :title="toast.title"
        :message="toast.message"
        :duration="toast.duration"
        @close="toastStore.removeToast(toast.id)"
      />
    </div>

    <main class="min-h-screen bg-gray-50">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import Toast from '@/components/Toast.vue'

const authStore = useAuthStore()
const toastStore = useToastStore()

onMounted(() => {
  authStore.loadUserFromStorage()
})
</script>