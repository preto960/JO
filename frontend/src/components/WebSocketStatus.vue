<template>
  <div 
    v-if="showStatus"
    class="fixed bottom-4 right-4 z-50"
  >
    <div 
      class="bg-gray-800 border rounded-lg px-4 py-2 shadow-lg flex items-center space-x-2 transition-all"
      :class="[
        isConnected 
          ? 'border-green-500' 
          : 'border-red-500'
      ]"
    >
      <div 
        class="w-2 h-2 rounded-full animate-pulse"
        :class="[
          isConnected 
            ? 'bg-green-500' 
            : 'bg-red-500'
        ]"
      ></div>
      <span class="text-sm text-gray-300">
        {{ isConnected ? 'Connected' : 'Disconnected' }}
      </span>
      <button
        v-if="!isConnected"
        @click="reconnect"
        class="text-xs text-blue-400 hover:text-blue-300 ml-2"
      >
        Reconnect
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useGlobalWebSocket } from '@/composables/useWebSocket';

const { isConnected, connect } = useGlobalWebSocket();
const showStatus = ref(true);

// Auto-hide después de 5 segundos si está conectado
watch(isConnected, (connected) => {
  if (connected) {
    setTimeout(() => {
      showStatus.value = false;
    }, 5000);
  } else {
    showStatus.value = true;
  }
});

const reconnect = () => {
  connect();
};
</script>


