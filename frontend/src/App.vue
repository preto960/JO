<template>
  <div id="app" class="min-h-screen bg-gray-900 text-white">
    <AppLayout v-if="showLayout" />
    <router-view v-else />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from './components/AppLayout.vue'

const route = useRoute()

// Mostrar layout solo si NO estamos en login
const showLayout = computed(() => route.path !== '/login')
</script>