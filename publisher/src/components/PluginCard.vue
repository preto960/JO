<template>
  <div 
    class="card hover:shadow-2xl transition-all cursor-pointer"
    :class="{ 'border-2 border-red-500': !plugin.isValid }"
    @click="$emit('view', plugin)"
  >
    <div class="flex items-start justify-between mb-4">
      <div class="flex items-center space-x-3">
        <div class="w-12 h-12 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
          <Package class="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 class="text-lg font-bold text-white">{{ plugin.manifest.name || 'Unnamed Plugin' }}</h3>
          <p class="text-sm text-gray-400">v{{ plugin.manifest.version || '0.0.0' }}</p>
        </div>
      </div>
      
      <span 
        v-if="plugin.isValid"
        class="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full"
      >
        Valid
      </span>
      <span 
        v-else
        class="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full"
      >
        {{ plugin.errors.length }} Error{{ plugin.errors.length > 1 ? 's' : '' }}
      </span>
    </div>

    <p class="text-gray-300 text-sm mb-4 line-clamp-2">
      {{ plugin.manifest.description || 'No description' }}
    </p>

    <!-- Metadata -->
    <div class="flex items-center space-x-4 text-xs text-gray-400 mb-4">
      <span v-if="plugin.manifest.author">
        👤 {{ plugin.manifest.author }}
      </span>
      <span v-if="plugin.manifest.category" class="px-2 py-1 bg-primary-500/20 text-primary-400 rounded">
        {{ plugin.manifest.category }}
      </span>
      <span v-if="plugin.size">
        📦 {{ formatSize(plugin.size) }}
      </span>
    </div>

    <!-- Tags -->
    <div v-if="plugin.manifest.tags && plugin.manifest.tags.length > 0" class="flex flex-wrap gap-2 mb-4">
      <span
        v-for="tag in plugin.manifest.tags.slice(0, 3)"
        :key="tag"
        class="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded"
      >
        {{ tag }}
      </span>
      <span
        v-if="plugin.manifest.tags.length > 3"
        class="px-2 py-1 bg-gray-700 text-gray-400 text-xs rounded"
      >
        +{{ plugin.manifest.tags.length - 3 }}
      </span>
    </div>

    <!-- Errors (if any) -->
    <div v-if="!plugin.isValid && plugin.errors.length > 0" class="mb-4">
      <div class="bg-red-900/20 border border-red-700 rounded-lg p-3">
        <p class="text-xs text-red-400 font-semibold mb-1">Errors:</p>
        <ul class="text-xs text-red-300 space-y-1">
          <li v-for="(error, index) in plugin.errors.slice(0, 2)" :key="index">
            • {{ error }}
          </li>
          <li v-if="plugin.errors.length > 2" class="text-red-400">
            ... and {{ plugin.errors.length - 2 }} more
          </li>
        </ul>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex gap-2" @click.stop>
      <button
        v-if="plugin.isValid"
        @click="$emit('publish', plugin)"
        class="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all text-sm"
      >
        <Rocket class="w-4 h-4 inline mr-1" />
        Publish
      </button>
      
      <button
        v-if="plugin.isValid"
        @click="$emit('build', plugin)"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
      >
        <Hammer class="w-4 h-4 inline" />
      </button>
      
      <button
        v-if="plugin.isValid"
        @click="$emit('sandbox', plugin)"
        class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
      >
        <TestTube class="w-4 h-4 inline" />
      </button>

      <button
        @click="$emit('view', plugin)"
        class="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
      >
        <Eye class="w-4 h-4 inline" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Package, Rocket, Hammer, TestTube, Eye } from 'lucide-vue-next'
import type { LocalPlugin } from '@/types/plugin'

defineProps<{
  plugin: LocalPlugin
}>()

defineEmits<{
  view: [plugin: LocalPlugin]
  build: [plugin: LocalPlugin]
  publish: [plugin: LocalPlugin]
  sandbox: [plugin: LocalPlugin]
}>()

const formatSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}
</script>

