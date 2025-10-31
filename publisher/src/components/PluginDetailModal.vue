<template>
  <div 
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto"
    @click.self="$emit('close')"
  >
    <div class="bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="sticky top-0 bg-gray-800 border-b border-gray-700 p-6 flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <div class="w-16 h-16 bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center">
            <Package class="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 class="text-2xl font-bold text-white">{{ plugin?.manifest.name || 'Plugin Details' }}</h2>
            <p class="text-gray-400">v{{ plugin?.manifest.version }}</p>
          </div>
        </div>
        <button @click="$emit('close')" class="text-gray-400 hover:text-white">
          <X class="w-6 h-6" />
        </button>
      </div>

      <!-- Content -->
      <div class="p-6 space-y-6">
        <!-- Status Badge -->
        <div>
          <span 
            v-if="plugin?.isValid"
            class="px-4 py-2 bg-green-500/20 text-green-400 text-sm rounded-full inline-flex items-center"
          >
            <CheckCircle class="w-4 h-4 mr-2" />
            Ready to Publish
          </span>
          <span 
            v-else
            class="px-4 py-2 bg-red-500/20 text-red-400 text-sm rounded-full inline-flex items-center"
          >
            <AlertCircle class="w-4 h-4 mr-2" />
            Has Errors
          </span>
        </div>

        <!-- Description -->
        <div>
          <h3 class="text-lg font-semibold text-white mb-2">Description</h3>
          <p class="text-gray-300">{{ plugin?.manifest.description }}</p>
          <p v-if="plugin?.manifest.longDescription" class="text-gray-400 mt-2 text-sm">
            {{ plugin.manifest.longDescription }}
          </p>
        </div>

        <!-- Metadata -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="bg-gray-700/50 rounded-lg p-3">
            <p class="text-xs text-gray-400">Author</p>
            <p class="text-white font-semibold">{{ plugin?.manifest.author || 'Unknown' }}</p>
          </div>
          <div class="bg-gray-700/50 rounded-lg p-3">
            <p class="text-xs text-gray-400">Category</p>
            <p class="text-white font-semibold">{{ plugin?.manifest.category || 'N/A' }}</p>
          </div>
          <div class="bg-gray-700/50 rounded-lg p-3">
            <p class="text-xs text-gray-400">Size</p>
            <p class="text-white font-semibold">{{ formatSize(plugin?.size || 0) }}</p>
          </div>
          <div class="bg-gray-700/50 rounded-lg p-3">
            <p class="text-xs text-gray-400">Files</p>
            <p class="text-white font-semibold">{{ plugin?.files?.length || 0 }}</p>
          </div>
        </div>

        <!-- Tags -->
        <div v-if="plugin?.manifest.tags && plugin.manifest.tags.length > 0">
          <h3 class="text-lg font-semibold text-white mb-2">Tags</h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="tag in plugin.manifest.tags"
              :key="tag"
              class="px-3 py-1 bg-gray-700 text-gray-300 text-sm rounded-full"
            >
              {{ tag }}
            </span>
          </div>
        </div>

        <!-- Structure -->
        <div>
          <h3 class="text-lg font-semibold text-white mb-2">Structure</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-if="plugin?.manifest.frontend" class="bg-gray-700/50 rounded-lg p-4">
              <div class="flex items-center space-x-2 mb-2">
                <Code class="w-5 h-5 text-blue-400" />
                <h4 class="font-semibold text-white">Frontend</h4>
              </div>
              <ul class="text-sm text-gray-300 space-y-1">
                <li>• Entry: {{ plugin.manifest.frontend.entry }}</li>
                <li v-if="plugin.manifest.frontend.routes">• Routes: {{ plugin.manifest.frontend.routes.length }}</li>
                <li v-if="plugin.manifest.frontend.components">• Components: {{ Object.keys(plugin.manifest.frontend.components).length }}</li>
              </ul>
            </div>

            <div v-if="plugin?.manifest.backend" class="bg-gray-700/50 rounded-lg p-4">
              <div class="flex items-center space-x-2 mb-2">
                <Server class="w-5 h-5 text-green-400" />
                <h4 class="font-semibold text-white">Backend</h4>
              </div>
              <ul class="text-sm text-gray-300 space-y-1">
                <li>• Entry: {{ plugin.manifest.backend.entry }}</li>
                <li v-if="plugin.manifest.backend.routes">• Routes: ✓</li>
                <li v-if="plugin.manifest.backend.models">• Models: {{ plugin.manifest.backend.models.length }}</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Permissions -->
        <div v-if="plugin?.manifest.permissions && plugin.manifest.permissions.length > 0">
          <h3 class="text-lg font-semibold text-white mb-2">Permissions</h3>
          <div class="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4">
            <ul class="text-sm text-yellow-300 space-y-1">
              <li v-for="permission in plugin.manifest.permissions" :key="permission">
                • {{ permission }}
              </li>
            </ul>
          </div>
        </div>

        <!-- Errors -->
        <div v-if="!plugin?.isValid && plugin?.errors.length" class="bg-red-900/20 border border-red-700 rounded-lg p-4">
          <h3 class="text-lg font-semibold text-red-400 mb-2">Errors</h3>
          <ul class="text-sm text-red-300 space-y-1">
            <li v-for="(error, index) in plugin.errors" :key="index">
              • {{ error }}
            </li>
          </ul>
        </div>

        <!-- Files List -->
        <div v-if="plugin?.files && plugin.files.length > 0">
          <h3 class="text-lg font-semibold text-white mb-2">Files ({{ plugin.files.length }})</h3>
          <div class="bg-gray-700/50 rounded-lg p-4 max-h-48 overflow-y-auto">
            <ul class="text-xs text-gray-300 space-y-1 font-mono">
              <li v-for="file in plugin.files.slice(0, 50)" :key="file">
                📄 {{ file }}
              </li>
              <li v-if="plugin.files.length > 50" class="text-gray-400">
                ... and {{ plugin.files.length - 50 }} more files
              </li>
            </ul>
          </div>
        </div>

        <!-- Manifest JSON -->
        <div>
          <h3 class="text-lg font-semibold text-white mb-2">Manifest</h3>
          <div class="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <pre class="text-xs text-green-400 font-mono">{{ JSON.stringify(plugin?.manifest, null, 2) }}</pre>
          </div>
        </div>
      </div>

      <!-- Footer Actions -->
      <div class="sticky bottom-0 bg-gray-800 border-t border-gray-700 p-6 flex gap-3">
        <button
          v-if="plugin?.isValid"
          @click="$emit('publish', plugin)"
          class="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all"
        >
          <Rocket class="w-5 h-5 inline mr-2" />
          Build & Publish
        </button>
        
        <button
          v-if="plugin?.isValid"
          @click="$emit('build', plugin)"
          class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          <Hammer class="w-5 h-5 inline mr-2" />
          Build Only
        </button>
        
        <button
          v-if="plugin?.isValid"
          @click="$emit('sandbox', plugin)"
          class="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          <TestTube class="w-5 h-5 inline mr-2" />
          Test in Sandbox
        </button>
        
        <button
          @click="$emit('close')"
          class="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Package, X, CheckCircle, AlertCircle, Code, Server, Rocket, Hammer, TestTube } from 'lucide-vue-next'
import type { LocalPlugin } from '@/types/plugin'

defineProps<{
  plugin: LocalPlugin | null
}>()

defineEmits<{
  close: []
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



