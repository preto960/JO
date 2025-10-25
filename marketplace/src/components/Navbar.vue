<template>
  <nav class="bg-gray-800 border-b border-gray-700">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <div class="flex items-center">
          <router-link to="/" class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-lg">N</span>
            </div>
            <span class="text-white font-bold text-xl">NJO Marketplace</span>
          </router-link>
        </div>

        <!-- Navigation Links -->
        <div class="hidden md:block">
          <div class="ml-10 flex items-baseline space-x-4">
            <router-link
              to="/"
              class="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-gray-700 transition-colors"
              :class="{ 'bg-gray-900': $route.path === '/' }"
            >
              Home
            </router-link>
            <router-link
              to="/plugins"
              class="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
              :class="{ 'bg-gray-900 text-white': $route.path === '/plugins' }"
            >
              Plugins
            </router-link>
            <router-link
              to="/categories"
              class="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
              :class="{ 'bg-gray-900 text-white': $route.path === '/categories' }"
            >
              Categories
            </router-link>
            <router-link
              to="/about"
              class="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
              :class="{ 'bg-gray-900 text-white': $route.path === '/about' }"
            >
              About
            </router-link>
          </div>
        </div>

        <!-- Right side buttons -->
        <div class="hidden md:block">
          <div class="ml-4 flex items-center md:ml-6 space-x-4">
            <button class="p-2 text-gray-400 hover:text-white transition-colors">
              <Search class="w-5 h-5" />
            </button>
            <a
              href="http://localhost:3003/login"
              class="btn-primary text-sm"
            >
              Publisher Portal
            </a>
          </div>
        </div>

        <!-- Mobile menu button -->
        <div class="md:hidden">
          <button
            @click="toggleMobileMenu"
            class="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
          >
            <Menu class="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <div v-if="showMobileMenu" class="md:hidden bg-gray-800 border-b border-gray-700">
      <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        <router-link
          to="/"
          class="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700 transition-colors"
          @click="closeMobileMenu"
        >
          Home
        </router-link>
        <router-link
          to="/plugins"
          class="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
          @click="closeMobileMenu"
        >
          Plugins
        </router-link>
        <router-link
          to="/categories"
          class="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
          @click="closeMobileMenu"
        >
          Categories
        </router-link>
        <router-link
          to="/about"
          class="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
          @click="closeMobileMenu"
        >
          About
        </router-link>
        <div class="pt-4 pb-3 border-t border-gray-700">
          <a
            href="http://localhost:3003/login"
            class="block px-3 py-2 btn-primary text-center"
          >
            Publisher Portal
          </a>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Search, Menu } from 'lucide-vue-next'

const showMobileMenu = ref(false)

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

const closeMobileMenu = () => {
  showMobileMenu.value = false
}
</script>