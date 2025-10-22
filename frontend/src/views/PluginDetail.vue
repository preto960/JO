<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12 text-red-600">
        {{ error }}
      </div>

      <!-- Plugin Details -->
      <div v-else-if="currentPlugin" class="grid md:grid-cols-3 gap-8">
        <!-- Main Content -->
        <div class="md:col-span-2">
          <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="mb-6">
              <div class="flex items-center justify-between mb-4">
                <h1 class="text-3xl font-bold text-gray-900">{{ currentPlugin.title }}</h1>
                <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {{ currentPlugin.category }}
                </span>
              </div>
              
              <div class="flex items-center space-x-4 mb-4">
                <div class="flex items-center">
                  <span class="text-yellow-400">★</span>
                  <span class="ml-1 text-gray-600">
                    {{ currentPlugin.avgRating.toFixed(1) }} ({{ currentPlugin._count.reviews }} reviews)
                  </span>
                </div>
                <span class="text-gray-400">•</span>
                <span class="text-gray-600">Version {{ currentPlugin.version }}</span>
                <span class="text-gray-400">•</span>
                <span class="text-gray-600">{{ currentPlugin._count.purchases }} sold</span>
              </div>
              
              <div class="flex flex-wrap gap-2 mb-6">
                <span 
                  v-for="tag in currentPlugin.tags" 
                  :key="tag"
                  class="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                >
                  {{ tag }}
                </span>
              </div>
            </div>

            <div class="mb-8">
              <h2 class="text-xl font-semibold mb-4">Description</h2>
              <p class="text-gray-600 leading-relaxed">{{ currentPlugin.description }}</p>
            </div>

            <!-- Links -->
            <div v-if="hasLinks" class="mb-8">
              <h2 class="text-xl font-semibold mb-4">Links</h2>
              <div class="space-y-2">
                <a 
                  v-if="currentPlugin.demoUrl"
                  :href="currentPlugin.demoUrl"
                  target="_blank"
                  class="flex items-center text-blue-600 hover:text-blue-800"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                  </svg>
                  Live Demo
                </a>
                <a 
                  v-if="currentPlugin.githubUrl"
                  :href="currentPlugin.githubUrl"
                  target="_blank"
                  class="flex items-center text-blue-600 hover:text-blue-800"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                  </svg>
                  GitHub Repository
                </a>
              </div>
            </div>

            <!-- Reviews -->
            <div>
              <h2 class="text-xl font-semibold mb-4">Reviews</h2>
              
              <div v-if="!(currentPlugin as any).reviews || (currentPlugin as any).reviews?.length === 0" class="text-gray-500 text-center py-8">
                No reviews yet. Be the first to review this plugin!
              </div>
              
              <div v-else class="space-y-4">
                <div 
                  v-for="review in (currentPlugin as any).reviews || []" 
                  :key="review.id"
                  class="border-b border-gray-200 pb-4"
                >
                  <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center">
                      <span class="font-medium">{{ review.user.username }}</span>
                      <div class="flex items-center ml-2">
                        <span class="text-yellow-400">★</span>
                        <span class="ml-1 text-sm text-gray-600">{{ review.rating }}</span>
                      </div>
                    </div>
                    <span class="text-sm text-gray-500">
                      {{ new Date(review.createdAt).toLocaleDateString() }}
                    </span>
                  </div>
                  <p v-if="review.comment" class="text-gray-600">{{ review.comment }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="md:col-span-1">
          <div class="bg-white rounded-lg shadow-sm p-6 sticky top-8">
            <div class="text-center mb-6">
              <div class="text-3xl font-bold text-blue-600 mb-2">
                ${{ currentPlugin.price }}
              </div>
              <p class="text-gray-600">One-time purchase</p>
            </div>

            <div class="mb-6">
              <div class="text-sm text-gray-600 mb-2">Author</div>
              <div class="font-medium">{{ currentPlugin.author.username }}</div>
            </div>

            <button 
              @click="purchasePlugin"
              :disabled="purchasing"
              class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="purchasing">Processing...</span>
              <span v-else>Buy Plugin</span>
            </button>

            <div class="mt-4 text-center text-sm text-gray-600">
              Instant download after purchase
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { usePluginStore } from '@/stores/plugins'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const pluginStore = usePluginStore()
const authStore = useAuthStore()

const purchasing = ref(false)

const loading = computed(() => pluginStore.loading)
const error = computed(() => pluginStore.error)
const currentPlugin = computed(() => pluginStore.currentPlugin)

const hasLinks = computed(() => {
  return currentPlugin.value?.demoUrl || currentPlugin.value?.githubUrl
})

const purchasePlugin = async () => {
  if (!authStore.isAuthenticated) {
    // Redirect to login
    return
  }

  purchasing.value = true
  
  try {
    // TODO: Implement purchase logic
    console.log('Purchasing plugin:', currentPlugin.value?.id)
  } catch (error) {
    console.error('Purchase failed:', error)
  } finally {
    purchasing.value = false
  }
}

onMounted(async () => {
  const pluginId = route.params.id as string
  await pluginStore.fetchPluginById(pluginId)
})
</script>