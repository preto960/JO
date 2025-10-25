<template>
  <div class="space-y-6">
    <div class="text-center py-12">
      <h1 class="text-3xl font-bold text-white mb-4">Analytics</h1>
      <p class="text-gray-400">Track your plugin performance and revenue</p>
    </div>
    
    <div class="card">
      <div class="text-center py-8">
        <BarChart3 class="w-16 h-16 mx-auto mb-4 text-gray-500" />
        <h3 class="text-lg font-medium text-white mb-2">Analytics Dashboard</h3>
        <p class="text-gray-400">Advanced analytics and reporting features coming soon</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BarChart3 } from 'lucide-vue-next'
</script>