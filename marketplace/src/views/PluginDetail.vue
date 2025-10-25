<template>
  <div class="min-h-screen bg-gray-900 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Breadcrumb -->
      <nav class="mb-8">
        <ol class="flex items-center space-x-2 text-sm">
          <li>
            <router-link to="/" class="text-gray-400 hover:text-white transition-colors">
              Home
            </router-link>
          </li>
          <li class="text-gray-600">/</li>
          <li>
            <router-link to="/plugins" class="text-gray-400 hover:text-white transition-colors">
              Plugins
            </router-link>
          </li>
          <li class="text-gray-600">/</li>
          <li class="text-white">{{ plugin?.name }}</li>
        </ol>
      </nav>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>

      <!-- Plugin Content -->
      <div v-else-if="plugin" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Header -->
          <div class="card">
            <div class="flex items-start space-x-6">
              <div class="w-20 h-20 bg-gradient-to-r from-primary-600 to-accent-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <span class="text-white font-bold text-2xl">{{ plugin.name.charAt(0) }}</span>
              </div>
              
              <div class="flex-1">
                <h1 class="text-3xl font-bold text-white mb-2">{{ plugin.name }}</h1>
                <p class="text-gray-400 mb-4">{{ plugin.category }}</p>
                
                <div class="flex items-center space-x-6 mb-4">
                  <div class="flex items-center space-x-1">
                    <Star class="w-5 h-5 text-yellow-400 fill-current" />
                    <span class="text-lg font-medium text-white">{{ plugin.rating.toFixed(1) }}</span>
                    <span class="text-gray-400">({{ plugin.reviewCount }} reviews)</span>
                  </div>
                  
                  <div class="text-gray-400">
                    {{ plugin.downloadCount.toLocaleString() }} downloads
                  </div>
                </div>
                
                <div class="flex items-center space-x-4">
                  <span class="text-2xl font-bold text-white">
                    {{ plugin.price > 0 ? `$${plugin.price}` : 'Free' }}
                  </span>
                  <span class="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                    Version {{ plugin.version }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Description -->
          <div class="card">
            <h2 class="text-xl font-semibold text-white mb-4">Description</h2>
            <div class="prose prose-invert max-w-none">
              <p class="text-gray-300 leading-relaxed">{{ plugin.description }}</p>
              <p v-if="plugin.longDescription" class="text-gray-300 leading-relaxed mt-4">
                {{ plugin.longDescription }}
              </p>
            </div>
          </div>

          <!-- Features -->
          <div class="card">
            <h2 class="text-xl font-semibold text-white mb-4">Key Features</h2>
            <ul class="space-y-2">
              <li v-for="feature in features" :key="feature" class="flex items-center space-x-2">
                <CheckCircle class="w-5 h-5 text-green-400" />
                <span class="text-gray-300">{{ feature }}</span>
              </li>
            </ul>
          </div>

          <!-- Screenshots -->
          <div v-if="plugin.screenshots && plugin.screenshots.length > 0" class="card">
            <h2 class="text-xl font-semibold text-white mb-4">Screenshots</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                v-for="(screenshot, index) in plugin.screenshots"
                :key="index"
                class="aspect-video bg-gray-700 rounded-lg overflow-hidden"
              >
                <img
                  :src="screenshot"
                  :alt="`${plugin.name} screenshot ${index + 1}`"
                  class="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          <!-- Reviews -->
          <div class="card">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-semibold text-white">Reviews</h2>
              <button class="btn-primary">
                Write a Review
              </button>
            </div>
            
            <div v-if="reviews.length === 0" class="text-center py-8">
              <MessageSquare class="w-12 h-12 mx-auto mb-4 text-gray-500" />
              <p class="text-gray-400">No reviews yet. Be the first to review this plugin!</p>
            </div>
            
            <div v-else class="space-y-4">
              <div
                v-for="review in reviews"
                :key="review.id"
                class="border-b border-gray-700 pb-4 last:border-b-0"
              >
                <div class="flex items-start justify-between mb-2">
                  <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                      <span class="text-white font-medium">{{ review.user.name.charAt(0) }}</span>
                    </div>
                    <div>
                      <h4 class="font-medium text-white">{{ review.user.name }}</h4>
                      <div class="flex items-center space-x-1">
                        <Star
                          v-for="i in 5"
                          :key="i"
                          class="w-4 h-4"
                          :class="i <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-600'"
                        />
                      </div>
                    </div>
                  </div>
                  <span class="text-sm text-gray-400">{{ review.date }}</span>
                </div>
                
                <h5 class="font-medium text-white mb-1">{{ review.title }}</h5>
                <p class="text-gray-300">{{ review.content }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Actions -->
          <div class="card">
            <button class="w-full btn-primary text-lg py-4 mb-3">
              <Download class="w-5 h-5 mr-2" />
              {{ plugin.price > 0 ? 'Purchase & Download' : 'Download' }}
            </button>
            
            <button class="w-full btn-secondary">
              <Heart class="w-5 h-5 mr-2" />
              Add to Wishlist
            </button>
          </div>

          <!-- Information -->
          <div class="card">
            <h3 class="text-lg font-semibold text-white mb-4">Information</h3>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-400">Version</span>
                <span class="text-white">{{ plugin.version }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Category</span>
                <span class="text-white">{{ plugin.category }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Size</span>
                <span class="text-white">{{ plugin.size || '2.5 MB' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Last Updated</span>
                <span class="text-white">{{ formatDate(plugin.updatedAt) }}</span>
              </div>
            </div>
          </div>

          <!-- Links -->
          <div v-if="hasLinks" class="card">
            <h3 class="text-lg font-semibold text-white mb-4">Links</h3>
            <div class="space-y-2">
              <a
                v-if="plugin.documentationUrl"
                :href="plugin.documentationUrl"
                class="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
              >
                <BookOpen class="w-4 h-4" />
                <span>Documentation</span>
              </a>
              <a
                v-if="plugin.supportUrl"
                :href="plugin.supportUrl"
                class="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
              >
                <HelpCircle class="w-4 h-4" />
                <span>Support</span>
              </a>
              <a
                v-if="plugin.demoUrl"
                :href="plugin.demoUrl"
                class="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
              >
                <ExternalLink class="w-4 h-4" />
                <span>Live Demo</span>
              </a>
              <a
                v-if="plugin.repositoryUrl"
                :href="plugin.repositoryUrl"
                class="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
              >
                <Github class="w-4 h-4" />
                <span>Source Code</span>
              </a>
            </div>
          </div>

          <!-- Tags -->
          <div v-if="plugin.tags && plugin.tags.length > 0" class="card">
            <h3 class="text-lg font-semibold text-white mb-4">Tags</h3>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tag in plugin.tags"
                :key="tag"
                class="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm"
              >
                {{ tag }}
              </span>
            </div>
          </div>

          <!-- Developer -->
          <div class="card">
            <h3 class="text-lg font-semibold text-white mb-4">Developer</h3>
            <div class="flex items-center space-x-3">
              <div class="w-12 h-12 bg-gradient-to-r from-primary-600 to-accent-600 rounded-full flex items-center justify-center">
                <span class="text-white font-bold">{{ plugin.developer.firstName.charAt(0) }}{{ plugin.developer.lastName.charAt(0) }}</span>
              </div>
              <div>
                <h4 class="font-medium text-white">
                  {{ plugin.developer.firstName }} {{ plugin.developer.lastName }}
                </h4>
                <p class="text-sm text-gray-400">Plugin Developer</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Not Found -->
      <div v-else class="text-center py-12">
        <AlertCircle class="w-16 h-16 mx-auto mb-4 text-gray-500" />
        <h3 class="text-lg font-medium text-white mb-2">Plugin Not Found</h3>
        <p class="text-gray-400 mb-6">The plugin you're looking for doesn't exist or has been removed.</p>
        <router-link to="/plugins" class="btn-primary">
          Browse Plugins
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import {
  Star,
  Download,
  Heart,
  BookOpen,
  HelpCircle,
  ExternalLink,
  Github,
  CheckCircle,
  MessageSquare,
  AlertCircle
} from 'lucide-vue-next'

const route = useRoute()
const loading = ref(true)

const plugin = ref({
  id: '1',
  name: 'AI Assistant Pro',
  category: 'PRODUCTIVITY',
  description: 'Advanced AI-powered assistant that helps you with daily tasks and boosts productivity with smart automation and intelligent suggestions.',
  longDescription: 'AI Assistant Pro is a comprehensive productivity tool that leverages cutting-edge artificial intelligence to streamline your workflow. Features include natural language processing, task automation, smart scheduling, and predictive analytics to help you work more efficiently.',
  version: '2.1.0',
  rating: 4.8,
  reviewCount: 234,
  downloadCount: 12543,
  price: 9.99,
  screenshots: [
    'https://via.placeholder.com/600x400/6366f1/ffffff?text=Screenshot+1',
    'https://via.placeholder.com/600x400/8b5cf6/ffffff?text=Screenshot+2'
  ],
  tags: ['AI', 'Productivity', 'Automation', 'Smart Assistant'],
  documentationUrl: 'https://docs.example.com',
  supportUrl: 'https://support.example.com',
  demoUrl: 'https://demo.example.com',
  repositoryUrl: 'https://github.com/example/ai-assistant',
  size: '2.5 MB',
  updatedAt: new Date('2024-01-15'),
  developer: {
    firstName: 'John',
    lastName: 'Doe'
  }
})

const features = [
  'Natural language processing for intelligent task understanding',
  'Automated workflow optimization and suggestions',
  'Real-time collaboration and team synchronization',
  'Advanced analytics and performance insights',
  'Cross-platform compatibility and cloud sync',
  '24/7 AI-powered support and assistance'
]

const reviews = ref([
  {
    id: '1',
    user: { name: 'Sarah Johnson' },
    rating: 5,
    title: 'Game-changing productivity tool!',
    content: 'This AI assistant has completely transformed how I work. The automation features are incredible and save me hours every week.',
    date: '2 weeks ago'
  },
  {
    id: '2',
    user: { name: 'Mike Chen' },
    rating: 4,
    title: 'Excellent features, minor learning curve',
    content: 'Powerful tool with amazing capabilities. Took a few days to get used to all the features, but now I can\'t imagine working without it.',
    date: '1 month ago'
  },
  {
    id: '3',
    user: { name: 'Emily Davis' },
    rating: 5,
    title: 'Worth every penny!',
    content: 'The AI suggestions are spot-on and have helped me optimize my workflow significantly. Highly recommend for any professional.',
    date: '2 months ago'
  }
])

const hasLinks = computed(() => {
  return plugin.value.documentationUrl || 
         plugin.value.supportUrl || 
         plugin.value.demoUrl || 
         plugin.value.repositoryUrl
})

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date)
}

onMounted(() => {
  // In a real app, fetch plugin data from API
  setTimeout(() => {
    loading.value = false
  }, 1000)
})
</script>