<template>
  <div class="card hover:shadow-lg transition-shadow">
    <div class="flex justify-between items-start mb-4">
      <div>
        <h3 class="text-lg font-semibold text-gray-900">{{ plugin.name }}</h3>
        <p class="text-sm text-gray-600">by {{ plugin.publisher.name }}</p>
      </div>
      <span class="text-lg font-bold text-primary-600">
        ${{ plugin.price }}
      </span>
    </div>
    
    <p class="text-gray-600 mb-4 line-clamp-3">{{ plugin.description }}</p>
    
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center space-x-4 text-sm text-gray-500">
        <span class="bg-gray-100 px-2 py-1 rounded">{{ plugin.category }}</span>
        <span>v{{ plugin.version }}</span>
        <span>📥 {{ plugin._count.downloads }}</span>
      </div>
    </div>
    
    <div class="flex space-x-2">
      <router-link 
        :to="`/plugin/${plugin.id}`" 
        class="flex-1 btn-primary text-center text-sm"
      >
        View Details
      </router-link>
      <button
        @click="$emit('install', plugin.id)"
        class="flex-1 btn-secondary text-sm"
      >
        Install
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Plugin {
  id: string
  name: string
  description: string
  version: string
  category: string
  price: number
  publisher: { name: string }
  _count: { downloads: number }
}

defineProps<{
  plugin: Plugin
}>()

defineEmits<{
  install: [id: string]
}>()
</script>