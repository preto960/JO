<template>
  <div 
    v-if="showStatus"
    class="fixed bottom-4 right-4 z-50"
  >
    <div 
      class="bg-gray-800 dark:bg-gray-900 border rounded-lg px-4 py-2 shadow-lg flex items-center space-x-2 transition-all"
      :class="[
        isConnected 
          ? 'border-green-500' 
          : reconnecting 
            ? 'border-yellow-500'
            : 'border-red-500'
      ]"
    >
      <div 
        class="w-2 h-2 rounded-full"
        :class="[
          isConnected 
            ? 'bg-green-500 animate-pulse' 
            : reconnecting
              ? 'bg-yellow-500 animate-spin'
              : 'bg-red-500 animate-pulse'
        ]"
      ></div>
      <span class="text-sm text-gray-300 dark:text-gray-400">
        {{ statusText }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useGlobalWebSocket } from '@/composables/useWebSocket';
import { useAuthStore } from '@/stores/auth';

const { isConnected, connect, socket } = useGlobalWebSocket();
const authStore = useAuthStore();
const showStatus = ref(true);
const reconnecting = ref(false);

// Computed status text
const statusText = computed(() => {
  if (isConnected.value) return 'Connected';
  if (reconnecting.value) return 'Reconnecting...';
  return 'Disconnected';
});

// Listen to reconnection attempts
onMounted(() => {
  if (socket.value) {
    socket.value.on('reconnect_attempt', () => {
      reconnecting.value = true;
    });

    socket.value.on('connect', () => {
      reconnecting.value = false;
    });

    socket.value.on('reconnect_failed', () => {
      reconnecting.value = false;
    });
  }
});

// Auto-hide después de 5 segundos si está conectado
watch(isConnected, (connected) => {
  if (connected) {
    reconnecting.value = false;
    setTimeout(() => {
      showStatus.value = false;
    }, 5000);
  } else {
    showStatus.value = true;
  }
});

// Auto-connect cuando el usuario está autenticado
watch(() => authStore.isAuthenticated, (authenticated) => {
  if (authenticated && !isConnected.value) {
    console.log('🔌 Auto-connecting WebSocket after authentication');
    connect();
  }
}, { immediate: true });
</script>



