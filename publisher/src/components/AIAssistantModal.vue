<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-gray-800 rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg flex items-center justify-center">
            <Sparkles class="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 class="text-xl font-bold text-white">AI Assistant</h2>
            <p class="text-sm text-gray-400">Your intelligent plugin development helper</p>
          </div>
        </div>
        <button
          @click="$emit('close')"
          class="p-2 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <X class="w-5 h-5 text-gray-400" />
        </button>
      </div>
      
      <!-- AI Tools -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div
          v-for="tool in aiTools"
          :key="tool.id"
          @click="selectTool(tool)"
          class="p-4 bg-gray-700 border border-gray-600 rounded-lg hover:border-primary-500 cursor-pointer transition-all group"
        >
          <div class="flex items-center space-x-3 mb-2">
            <component :is="tool.icon" class="w-5 h-5 text-primary-400" />
            <h3 class="font-semibold text-white group-hover:text-primary-400 transition-colors">
              {{ tool.name }}
            </h3>
          </div>
          <p class="text-sm text-gray-400">{{ tool.description }}</p>
        </div>
      </div>
      
      <!-- Chat Interface -->
      <div v-if="selectedTool" class="space-y-4">
        <div class="bg-gray-700 rounded-lg p-4">
          <h3 class="font-semibold text-white mb-2">{{ selectedTool.name }}</h3>
          <p class="text-sm text-gray-400 mb-4">{{ selectedTool.description }}</p>
          
          <!-- Input Area -->
          <div class="space-y-4">
            <div v-if="selectedTool.id === 'analyze-plugin'">
              <label class="block text-sm font-medium text-gray-300 mb-2">
                Select Plugin
              </label>
              <select v-model="selectedPluginId" class="input-field">
                <option value="">Choose a plugin...</option>
                <option v-for="plugin in plugins" :key="plugin.id" :value="plugin.id">
                  {{ plugin.name }}
                </option>
              </select>
            </div>
            
            <div v-if="selectedTool.id === 'generate-content'">
              <label class="block text-sm font-medium text-gray-300 mb-2">
                Content Type
              </label>
              <select v-model="contentType" class="input-field">
                <option value="description">Plugin Description</option>
                <option value="documentation">Documentation</option>
                <option value="marketing">Marketing Copy</option>
              </select>
            </div>
            
            <div v-if="selectedTool.id === 'generate-image'">
              <label class="block text-sm font-medium text-gray-300 mb-2">
                Image Type
              </label>
              <select v-model="imageType" class="input-field">
                <option value="icon">Plugin Icon</option>
                <option value="screenshot">Screenshot</option>
                <option value="banner">Promotional Banner</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">
                {{ selectedTool.inputLabel }}
              </label>
              <textarea
                v-model="userInput"
                :placeholder="selectedTool.placeholder"
                class="input-field min-h-[100px] resize-none"
              />
            </div>
          </div>
          
          <!-- Action Buttons -->
          <div class="flex space-x-3 mt-4">
            <button
              @click="executeAITool"
              :disabled="loading || !canExecute"
              class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="loading">Processing...</span>
              <span v-else>{{ selectedTool.actionText }}</span>
            </button>
            <button
              @click="clearSelection"
              class="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
        
        <!-- Result Area -->
        <div v-if="result" class="bg-gray-700 rounded-lg p-4">
          <h3 class="font-semibold text-white mb-2">Result</h3>
          <div class="text-sm text-gray-300 whitespace-pre-wrap">{{ result }}</div>
        </div>
      </div>
      
      <!-- Quick Actions -->
      <div v-if="!selectedTool" class="border-t border-gray-700 pt-4">
        <h3 class="font-semibold text-white mb-3">Quick Actions</h3>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="action in quickActions"
            :key="action.id"
            @click="executeQuickAction(action)"
            class="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm hover:bg-gray-600 transition-colors"
          >
            {{ action.name }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { usePluginStore } from '@/stores/plugin'
import { useToast } from 'vue-toastification'
import {
  Sparkles,
  Search,
  FileText,
  Image,
  TrendingUp,
  X,
  BarChart3,
  MessageSquare,
  Lightbulb
} from 'lucide-vue-next'

const emit = defineEmits<{
  close: []
}>()

const pluginStore = usePluginStore()
const toast = useToast()

const selectedTool = ref<any>(null)
const selectedPluginId = ref('')
const contentType = ref('description')
const imageType = ref('icon')
const userInput = ref('')
const loading = ref(false)
const result = ref('')
const plugins = ref<any[]>([])

const aiTools = [
  {
    id: 'analyze-plugin',
    name: 'Analyze Plugin',
    description: 'Get AI-powered insights and improvement suggestions',
    icon: Search,
    inputLabel: 'Additional Context (Optional)',
    placeholder: 'Any specific areas you want me to focus on...',
    actionText: 'Analyze Plugin'
  },
  {
    id: 'generate-content',
    name: 'Generate Content',
    description: 'Create descriptions, documentation, and marketing materials',
    icon: FileText,
    inputLabel: 'Content Requirements',
    placeholder: 'Describe what content you need...',
    actionText: 'Generate Content'
  },
  {
    id: 'generate-image',
    name: 'Generate Image',
    description: 'Create plugin icons, screenshots, and promotional images',
    icon: Image,
    inputLabel: 'Image Description (Optional)',
    placeholder: 'Custom description for the image...',
    actionText: 'Generate Image'
  },
  {
    id: 'optimize-seo',
    name: 'SEO Optimization',
    description: 'Improve your plugin\'s search visibility',
    icon: TrendingUp,
    inputLabel: 'SEO Goals',
    placeholder: 'What SEO improvements are you looking for?',
    actionText: 'Optimize SEO'
  }
]

const quickActions = [
  { id: 'improve-description', name: 'Improve Description' },
  { id: 'suggest-features', name: 'Suggest Features' },
  { id: 'market-analysis', name: 'Market Analysis' },
  { id: 'competitor-research', name: 'Competitor Research' }
]

const canExecute = computed(() => {
  if (!selectedTool.value) return false
  
  switch (selectedTool.value.id) {
    case 'analyze-plugin':
      return selectedPluginId.value
    case 'generate-content':
      return selectedPluginId.value && userInput.value
    case 'generate-image':
      return selectedPluginId.value
    case 'optimize-seo':
      return selectedPluginId.value
    default:
      return false
  }
})

const selectTool = (tool: any) => {
  selectedTool.value = tool
  result.value = ''
  userInput.value = ''
}

const clearSelection = () => {
  selectedTool.value = null
  result.value = ''
  userInput.value = ''
  selectedPluginId.value = ''
}

const executeAITool = async () => {
  if (!canExecute.value) return
  
  loading.value = true
  result.value = ''
  
  try {
    let response: any
    
    switch (selectedTool.value.id) {
      case 'analyze-plugin':
        response = await pluginStore.analyzePlugin(selectedPluginId.value, userInput.value)
        break
      case 'generate-content':
        response = await pluginStore.generateContent(selectedPluginId.value, contentType.value, userInput.value)
        break
      case 'generate-image':
        response = await pluginStore.generateImage(selectedPluginId.value, imageType.value, userInput.value)
        break
      case 'optimize-seo':
        response = await pluginStore.optimizeSEO(selectedPluginId.value, userInput.value)
        break
    }
    
    if (response.success) {
      result.value = response.result
      toast.success('AI tool executed successfully!')
    } else {
      toast.error(response.message || 'AI tool failed')
    }
  } catch (error) {
    toast.error('Failed to execute AI tool')
  } finally {
    loading.value = false
  }
}

const executeQuickAction = async (action: any) => {
  toast.info(`Executing ${action.name}...`)
  // Implement quick actions
}

onMounted(async () => {
  await pluginStore.fetchMyPlugins({ limit: 100 })
  plugins.value = pluginStore.plugins
})
</script>