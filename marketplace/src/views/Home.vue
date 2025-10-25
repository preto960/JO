<template>
  <div>
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-br from-primary-900 via-gray-900 to-accent-900 py-20 overflow-hidden">
      <div class="absolute inset-0 bg-black/20"></div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h1 class="text-4xl md:text-6xl font-bold text-white mb-6">
            Discover Amazing
            <span class="gradient-text"> Plugins</span>
          </h1>
          <p class="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Explore our curated marketplace of innovative plugins. Powered by AI to help you find the perfect tools for your needs.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <router-link
              to="/plugins"
              class="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center"
            >
              <Search class="w-5 h-5 mr-2" />
              Browse Plugins
            </router-link>
            <a
              href="http://localhost:3003/login"
              class="btn-secondary text-lg px-8 py-4 inline-flex items-center justify-center"
            >
              <Rocket class="w-5 h-5 mr-2" />
              Publisher Portal
            </a>
          </div>
        </div>
      </div>
      
      <!-- Animated Background Elements -->
      <div class="absolute top-20 left-10 w-20 h-20 bg-primary-500/20 rounded-full animate-float"></div>
      <div class="absolute bottom-20 right-10 w-32 h-32 bg-accent-500/20 rounded-full animate-float" style="animation-delay: 2s;"></div>
      <div class="absolute top-40 right-20 w-16 h-16 bg-primary-500/20 rounded-full animate-float" style="animation-delay: 4s;"></div>
    </section>

    <!-- Features Section -->
    <section class="py-20 bg-gray-800/50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
            Why Choose NJO Marketplace?
          </h2>
          <p class="text-xl text-gray-400 max-w-3xl mx-auto">
            We provide the best platform for discovering and managing plugins with cutting-edge AI technology.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div class="text-center">
            <div class="w-16 h-16 bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Sparkles class="w-8 h-8 text-white" />
            </div>
            <h3 class="text-xl font-semibold text-white mb-2">AI-Powered</h3>
            <p class="text-gray-400">
              Smart recommendations and insights powered by advanced AI technology
            </p>
          </div>

          <div class="text-center">
            <div class="w-16 h-16 bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Shield class="w-8 h-8 text-white" />
            </div>
            <h3 class="text-xl font-semibold text-white mb-2">Secure & Safe</h3>
            <p class="text-gray-400">
              All plugins are thoroughly reviewed and tested for security and quality
            </p>
          </div>

          <div class="text-center">
            <div class="w-16 h-16 bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Zap class="w-8 h-8 text-white" />
            </div>
            <h3 class="text-xl font-semibold text-white mb-2">Fast Updates</h3>
            <p class="text-gray-400">
              Regular updates and improvements to keep your plugins running smoothly
            </p>
          </div>

          <div class="text-center">
            <div class="w-16 h-16 bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Users class="w-8 h-8 text-white" />
            </div>
            <h3 class="text-xl font-semibold text-white mb-2">Community Driven</h3>
            <p class="text-gray-400">
              Join a thriving community of developers and users
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Popular Plugins -->
    <section class="py-20 bg-gray-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center mb-12">
          <div>
            <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
              Popular Plugins
            </h2>
            <p class="text-xl text-gray-400">
              Discover the most loved plugins in our marketplace
            </p>
          </div>
          <router-link
            to="/plugins"
            class="btn-primary"
          >
            View All
          </router-link>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="plugin in popularPlugins"
            :key="plugin.id"
            class="card hover:shadow-2xl transition-all duration-200 group cursor-pointer"
            @click="$router.push(`/plugins/${plugin.id}`)"
          >
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center space-x-3">
                <div class="w-12 h-12 bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                  <span class="text-white font-bold text-lg">{{ plugin.name.charAt(0) }}</span>
                </div>
                <div>
                  <h3 class="font-semibold text-white group-hover:text-primary-400 transition-colors">
                    {{ plugin.name }}
                  </h3>
                  <p class="text-sm text-gray-400">{{ plugin.category }}</p>
                </div>
              </div>
            </div>

            <p class="text-gray-300 text-sm mb-4 line-clamp-2">
              {{ plugin.description }}
            </p>

            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <div class="flex items-center space-x-1">
                  <Star class="w-4 h-4 text-yellow-400 fill-current" />
                  <span class="text-sm text-white">{{ plugin.rating.toFixed(1) }}</span>
                </div>
                <div class="text-sm text-gray-400">
                  {{ plugin.downloadCount }} downloads
                </div>
              </div>
              
              <div class="text-sm font-medium text-white">
                {{ plugin.price > 0 ? `$${plugin.price}` : 'Free' }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-gradient-to-r from-primary-900 to-accent-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-6">
          Ready to Share Your Plugin?
        </h2>
        <p class="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
          Join thousands of developers who are already sharing their plugins with our growing community.
        </p>
        <a
          href="http://localhost:3003/login"
          class="btn-primary text-lg px-8 py-4 inline-flex items-center"
        >
          <Rocket class="w-5 h-5 mr-2" />
          Get Started Now
        </a>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  Search,
  Rocket,
  Sparkles,
  Shield,
  Zap,
  Users,
  Star
} from 'lucide-vue-next'

const popularPlugins = ref([
  {
    id: '1',
    name: 'AI Assistant Pro',
    category: 'Productivity',
    description: 'Advanced AI-powered assistant that helps you with daily tasks and boosts productivity.',
    rating: 4.8,
    downloadCount: 12543,
    price: 9.99
  },
  {
    id: '2',
    name: 'Code Optimizer',
    category: 'Development',
    description: 'Automatically optimize your code for better performance and readability.',
    rating: 4.6,
    downloadCount: 8932,
    price: 14.99
  },
  {
    id: '3',
    name: 'Design System Kit',
    category: 'Design',
    description: 'Complete design system with reusable components and style guides.',
    rating: 4.9,
    downloadCount: 15678,
    price: 0
  },
  {
    id: '4',
    name: 'Analytics Dashboard',
    category: 'Analytics',
    description: 'Real-time analytics and insights for your applications and websites.',
    rating: 4.7,
    downloadCount: 9876,
    price: 19.99
  },
  {
    id: '5',
    name: 'Social Media Manager',
    category: 'Marketing',
    description: 'Manage all your social media accounts from one unified dashboard.',
    rating: 4.5,
    downloadCount: 7234,
    price: 12.99
  },
  {
    id: '6',
    name: 'Task Automation',
    category: 'Productivity',
    description: 'Automate repetitive tasks and workflows to save time and increase efficiency.',
    rating: 4.8,
    downloadCount: 11234,
    price: 7.99
  }
])
</script>