<template>
  <div class="min-h-screen bg-gray-900 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-white mb-4">About NJO Marketplace</h1>
        <p class="text-xl text-gray-400">Empowering developers and users with intelligent plugin discovery</p>
      </div>

      <!-- Mission Section -->
      <section class="card mb-12">
        <h2 class="text-2xl font-bold text-white mb-4">Our Mission</h2>
        <p class="text-gray-300 leading-relaxed mb-4">
          NJO Marketplace is revolutionizing the way people discover and integrate plugins into their digital workflows. 
          We believe that the right tools can transform productivity and creativity, and our mission is to connect 
          talented developers with users who need their solutions.
        </p>
        <p class="text-gray-300 leading-relaxed">
          By leveraging cutting-edge AI technology, we provide intelligent recommendations, personalized experiences, 
          and a seamless platform for plugin discovery, management, and distribution.
        </p>
      </section>

      <!-- Features Grid -->
      <section class="mb-12">
        <h2 class="text-2xl font-bold text-white mb-8 text-center">What Makes Us Different</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="card">
            <div class="w-12 h-12 bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg flex items-center justify-center mb-4">
              <Sparkles class="w-6 h-6 text-white" />
            </div>
            <h3 class="text-lg font-semibold text-white mb-2">AI-Powered Discovery</h3>
            <p class="text-gray-300">
              Our intelligent recommendation engine learns from your preferences and behavior to suggest the most relevant plugins for your needs.
            </p>
          </div>

          <div class="card">
            <div class="w-12 h-12 bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg flex items-center justify-center mb-4">
              <Shield class="w-6 h-6 text-white" />
            </div>
            <h3 class="text-lg font-semibold text-white mb-2">Quality Assurance</h3>
            <p class="text-gray-300">
              Every plugin undergoes rigorous testing and review to ensure security, performance, and reliability standards are met.
            </p>
          </div>

          <div class="card">
            <div class="w-12 h-12 bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg flex items-center justify-center mb-4">
              <Users class="w-6 h-6 text-white" />
            </div>
            <h3 class="text-lg font-semibold text-white mb-2">Community Driven</h3>
            <p class="text-gray-300">
              Join a thriving community of developers and users who share feedback, insights, and improvements to create better plugins.
            </p>
          </div>

          <div class="card">
            <div class="w-12 h-12 bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg flex items-center justify-center mb-4">
              <Zap class="w-6 h-6 text-white" />
            </div>
            <h3 class="text-lg font-semibold text-white mb-2">Lightning Fast</h3>
            <p class="text-gray-300">
              Our optimized infrastructure ensures quick downloads, seamless updates, and responsive performance across all devices.
            </p>
          </div>
        </div>
      </section>

      <!-- Stats Section -->
      <section class="card mb-12">
        <h2 class="text-2xl font-bold text-white mb-8 text-center">By the Numbers</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div class="text-3xl font-bold gradient-text mb-2">1,200+</div>
            <p class="text-gray-400">Active Plugins</p>
          </div>
          <div>
            <div class="text-3xl font-bold gradient-text mb-2">50K+</div>
            <p class="text-gray-400">Downloads</p>
          </div>
          <div>
            <div class="text-3xl font-bold gradient-text mb-2">300+</div>
            <p class="text-gray-400">Developers</p>
          </div>
          <div>
            <div class="text-3xl font-bold gradient-text mb-2">4.8★</div>
            <p class="text-gray-400">Average Rating</p>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="card bg-gradient-to-r from-primary-900 to-accent-900">
        <div class="text-center">
          <h2 class="text-2xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p class="text-gray-300 mb-6">
            Whether you're looking for the perfect plugin or ready to share your creation with the world, 
            NJO Marketplace is here to help you succeed.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <router-link
              to="/plugins"
              class="btn-primary"
            >
              Browse Plugins
            </router-link>
            <a
              href="http://localhost:3003/login"
              class="btn-secondary"
            >
              Become a Publisher
            </a>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Sparkles,
  Shield,
  Users,
  Zap
} from 'lucide-vue-next'
</script>