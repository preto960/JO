<template>
  <div class="min-h-screen bg-gray-900 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-white mb-4">Browse Categories</h1>
        <p class="text-xl text-gray-400">Find plugins by category to discover exactly what you need</p>
      </div>

      <!-- Categories Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="category in categories"
          :key="category.id"
          class="card hover:shadow-2xl transition-all duration-200 group cursor-pointer"
          @click="browseCategory(category.id)"
        >
          <div class="flex items-center space-x-4">
            <div
              class="w-16 h-16 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
              :class="category.bgColor"
            >
              <component :is="category.icon" class="w-8 h-8" :class="category.iconColor" />
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-white group-hover:text-primary-400 transition-colors">
                {{ category.name }}
              </h3>
              <p class="text-gray-400 text-sm mb-2">{{ category.description }}</p>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-400">{{ category.pluginCount }} plugins</span>
                <ArrowRight class="w-4 h-4 text-gray-400 group-hover:text-primary-400 transition-colors" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Popular Categories -->
      <div class="mt-16">
        <h2 class="text-2xl font-bold text-white mb-8 text-center">Popular Categories</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div
            v-for="popular in popularCategories"
            :key="popular.id"
            class="text-center p-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
            @click="browseCategory(popular.id)"
          >
            <div
              class="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3"
              :class="popular.bgColor"
            >
              <component :is="popular.icon" class="w-6 h-6" :class="popular.iconColor" />
            </div>
            <h4 class="font-medium text-white">{{ popular.name }}</h4>
            <p class="text-sm text-gray-400 mt-1">{{ popular.pluginCount }} plugins</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  Briefcase,
  Gamepad2,
  GraduationCap,
  Building,
  Code,
  Palette,
  TrendingUp,
  BarChart3,
  Users,
  Wrench,
  ArrowRight
} from 'lucide-vue-next'

const router = useRouter()

const categories = ref([
  {
    id: 'PRODUCTIVITY',
    name: 'Productivity',
    description: 'Tools to boost your efficiency and get more done',
    icon: Briefcase,
    pluginCount: 156,
    bgColor: 'bg-blue-500/20',
    iconColor: 'text-blue-400'
  },
  {
    id: 'ENTERTAINMENT',
    name: 'Entertainment',
    description: 'Games, media, and fun applications',
    icon: Gamepad2,
    pluginCount: 89,
    bgColor: 'bg-purple-500/20',
    iconColor: 'text-purple-400'
  },
  {
    id: 'EDUCATION',
    name: 'Education',
    description: 'Learning tools and educational content',
    icon: GraduationCap,
    pluginCount: 124,
    bgColor: 'bg-green-500/20',
    iconColor: 'text-green-400'
  },
  {
    id: 'BUSINESS',
    name: 'Business',
    description: 'Professional tools for business operations',
    icon: Building,
    pluginCount: 203,
    bgColor: 'bg-yellow-500/20',
    iconColor: 'text-yellow-400'
  },
  {
    id: 'DEVELOPMENT',
    name: 'Development',
    description: 'Developer tools and coding utilities',
    icon: Code,
    pluginCount: 178,
    bgColor: 'bg-red-500/20',
    iconColor: 'text-red-400'
  },
  {
    id: 'DESIGN',
    name: 'Design',
    description: 'Creative tools and design resources',
    icon: Palette,
    pluginCount: 92,
    bgColor: 'bg-pink-500/20',
    iconColor: 'text-pink-400'
  },
  {
    id: 'MARKETING',
    name: 'Marketing',
    description: 'Marketing and promotional tools',
    icon: TrendingUp,
    pluginCount: 67,
    bgColor: 'bg-indigo-500/20',
    iconColor: 'text-indigo-400'
  },
  {
    id: 'ANALYTICS',
    name: 'Analytics',
    description: 'Data analysis and reporting tools',
    icon: BarChart3,
    pluginCount: 45,
    bgColor: 'bg-cyan-500/20',
    iconColor: 'text-cyan-400'
  },
  {
    id: 'SOCIAL',
    name: 'Social',
    description: 'Social media and communication tools',
    icon: Users,
    pluginCount: 78,
    bgColor: 'bg-orange-500/20',
    iconColor: 'text-orange-400'
  },
  {
    id: 'UTILITY',
    name: 'Utility',
    description: 'General utility and helper tools',
    icon: Wrench,
    pluginCount: 134,
    bgColor: 'bg-gray-500/20',
    iconColor: 'text-gray-400'
  }
])

const popularCategories = ref([
  {
    id: 'PRODUCTIVITY',
    name: 'Productivity',
    pluginCount: 156,
    icon: Briefcase,
    bgColor: 'bg-blue-500/20',
    iconColor: 'text-blue-400'
  },
  {
    id: 'DEVELOPMENT',
    name: 'Development',
    pluginCount: 178,
    icon: Code,
    bgColor: 'bg-red-500/20',
    iconColor: 'text-red-400'
  },
  {
    id: 'BUSINESS',
    name: 'Business',
    pluginCount: 203,
    icon: Building,
    bgColor: 'bg-yellow-500/20',
    iconColor: 'text-yellow-400'
  },
  {
    id: 'EDUCATION',
    name: 'Education',
    pluginCount: 124,
    icon: GraduationCap,
    bgColor: 'bg-green-500/20',
    iconColor: 'text-green-400'
  }
])

const browseCategory = (categoryId: string) => {
  router.push({
    path: '/plugins',
    query: { category: categoryId }
  })
}
</script>