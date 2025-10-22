<template>
  <div class="bg-white dark:bg-gray-800 p-8 rounded-lg border border-gray-200 dark:border-gray-700">
    <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome back, {{ username }}! 👋</h2>
    <p class="text-lg text-gray-600 dark:text-gray-300">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  username: string
  message?: string
}

withDefaults(defineProps<Props>(), {
  message: "Here's what's happening with your plugin marketplace today."
})
</script>