<template>
  <div class="space-y-6">
    <div class="text-center py-12">
      <h1 class="text-3xl font-bold text-white mb-4">Settings</h1>
      <p class="text-gray-400">Manage your account and preferences</p>
    </div>
    
    <div class="card">
      <div class="text-center py-8">
        <Settings class="w-16 h-16 mx-auto mb-4 text-gray-500" />
        <h3 class="text-lg font-medium text-white mb-2">Settings Panel</h3>
        <p class="text-gray-400">Account settings and preferences coming soon</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Settings } from 'lucide-vue-next'
</script>