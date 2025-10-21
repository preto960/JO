<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <!-- Toast Notifications -->
    <Teleport to="body">
      <div
        v-if="toastStore.toasts.length > 0"
        class="fixed z-[9999] top-4 right-4 sm:top-6 sm:right-6 space-y-2"
        style="min-width: 320px; max-width: 448px;"
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
    </Teleport>

    <!-- Main Content -->
    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import Toast from '@/components/Toast.vue'

const router = useRouter()
const authStore = useAuthStore()
const toastStore = useToastStore()

onMounted(() => {
  authStore.loadUserFromStorage()
  
  // Si no está autenticado y no está en la página de login/register
  // redirigir a login automáticamente
  if (!authStore.isAuthenticated && !window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
    router.push('/login')
  }
})
</script>