<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-white">Create New Plugin</h1>
        <p class="text-gray-400 mt-1">Build and publish your plugin</p>
      </div>
      <div class="flex space-x-3">
        <button
          @click="saveDraft"
          :disabled="saving"
          class="btn-secondary flex items-center space-x-2"
        >
          <Save class="w-4 h-4" />
          <span>{{ saving ? 'Saving...' : 'Save Draft' }}</span>
        </button>
        <button
          @click="openAIAssistant"
          class="btn-primary flex items-center space-x-2"
        >
          <Sparkles class="w-4 h-4" />
          <span>AI Assistant</span>
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Form -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Basic Information -->
        <div class="card">
          <h2 class="text-xl font-semibold text-white mb-4">Basic Information</h2>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">
                Plugin Name *
              </label>
              <input
                v-model="form.name"
                type="text"
                required
                class="input-field"
                placeholder="Enter plugin name"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">
                Short Description *
              </label>
              <textarea
                v-model="form.description"
                required
                rows="3"
                class="input-field resize-none"
                placeholder="Brief description of your plugin (max 200 characters)"
                maxlength="200"
              />
              <div class="text-right mt-1">
                <span class="text-xs text-gray-400">{{ form.description.length }}/200</span>
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">
                Long Description
              </label>
              <textarea
                v-model="form.longDescription"
                rows="6"
                class="input-field resize-none"
                placeholder="Detailed description of your plugin's features and functionality"
              />
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  Version *
                </label>
                <input
                  v-model="form.version"
                  type="text"
                  required
                  class="input-field"
                  placeholder="1.0.0"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  Price ($)
                </label>
                <input
                  v-model.number="form.price"
                  type="number"
                  step="0.01"
                  min="0"
                  class="input-field"
                  placeholder="0.00"
                />
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">
                Category *
              </label>
              <select v-model="form.category" required class="input-field">
                <option value="">Select a category</option>
                <option value="PRODUCTIVITY">Productivity</option>
                <option value="ENTERTAINMENT">Entertainment</option>
                <option value="EDUCATION">Education</option>
                <option value="BUSINESS">Business</option>
                <option value="DEVELOPMENT">Development</option>
                <option value="DESIGN">Design</option>
                <option value="MARKETING">Marketing</option>
                <option value="ANALYTICS">Analytics</option>
                <option value="SOCIAL">Social</option>
                <option value="UTILITY">Utility</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">
                Tags
              </label>
              <input
                v-model="tagsInput"
                type="text"
                class="input-field"
                placeholder="Enter tags separated by commas"
                @blur="updateTags"
              />
              <div v-if="form.tags && form.tags.length > 0" class="flex flex-wrap gap-2 mt-2">
                <span
                  v-for="(tag, index) in form.tags"
                  :key="index"
                  class="px-2 py-1 bg-gray-700 text-gray-300 text-sm rounded flex items-center space-x-1"
                >
                  <span>{{ tag }}</span>
                  <button
                    @click="removeTag(index)"
                    class="text-gray-400 hover:text-red-400"
                  >
                    <X class="w-3 h-3" />
                  </button>
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Links -->
        <div class="card">
          <h2 class="text-xl font-semibold text-white mb-4">External Links</h2>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">
                Documentation URL
              </label>
              <input
                v-model="form.documentationUrl"
                type="url"
                class="input-field"
                placeholder="https://docs.example.com"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">
                Support URL
              </label>
              <input
                v-model="form.supportUrl"
                type="url"
                class="input-field"
                placeholder="https://support.example.com"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">
                Demo URL
              </label>
              <input
                v-model="form.demoUrl"
                type="url"
                class="input-field"
                placeholder="https://demo.example.com"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">
                Repository URL
              </label>
              <input
                v-model="form.repositoryUrl"
                type="url"
                class="input-field"
                placeholder="https://github.com/user/repo"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- AI Assistant -->
        <div class="card">
          <h3 class="text-lg font-semibold text-white mb-4">AI Assistant</h3>
          <div class="space-y-3">
            <button
              @click="generateDescription"
              :disabled="!form.name || generating"
              class="w-full p-3 bg-gradient-to-r from-primary-600/20 to-accent-600/20 border border-primary-500/30 rounded-lg hover:from-primary-600/30 hover:to-accent-600/30 transition-all text-left disabled:opacity-50"
            >
              <FileText class="w-4 h-4 text-primary-400 mb-2" />
              <h4 class="font-medium text-white text-sm">Generate Description</h4>
              <p class="text-xs text-gray-400 mt-1">Create compelling plugin description</p>
            </button>
            
            <button
              @click="generateTags"
              :disabled="!form.name || !form.description || generating"
              class="w-full p-3 bg-gradient-to-r from-primary-600/20 to-accent-600/20 border border-primary-500/30 rounded-lg hover:from-primary-600/30 hover:to-accent-600/30 transition-all text-left disabled:opacity-50"
            >
              <Tag class="w-4 h-4 text-primary-400 mb-2" />
              <h4 class="font-medium text-white text-sm">Suggest Tags</h4>
              <p class="text-xs text-gray-400 mt-1">Get relevant tag suggestions</p>
            </button>
            
            <button
              @click="generateIcon"
              :disabled="!form.name || generating"
              class="w-full p-3 bg-gradient-to-r from-primary-600/20 to-accent-600/20 border border-primary-500/30 rounded-lg hover:from-primary-600/30 hover:to-accent-600/30 transition-all text-left disabled:opacity-50"
            >
              <Image class="w-4 h-4 text-primary-400 mb-2" />
              <h4 class="font-medium text-white text-sm">Generate Icon</h4>
              <p class="text-xs text-gray-400 mt-1">Create plugin icon with AI</p>
            </button>
          </div>
        </div>

        <!-- Preview -->
        <div class="card">
          <h3 class="text-lg font-semibold text-white mb-4">Preview</h3>
          <div class="space-y-3">
            <div class="flex items-center space-x-3">
              <div class="w-12 h-12 bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-lg">{{ form.name ? form.name.charAt(0).toUpperCase() : 'P' }}</span>
              </div>
              <div>
                <h4 class="font-medium text-white">{{ form.name || 'Plugin Name' }}</h4>
                <p class="text-sm text-gray-400">{{ form.category || 'Category' }}</p>
              </div>
            </div>
            
            <p class="text-sm text-gray-300">
              {{ form.description || 'Plugin description will appear here...' }}
            </p>
            
            <div class="flex items-center justify-between pt-3 border-t border-gray-700">
              <div class="text-center">
                <p class="text-xs text-gray-400">Price</p>
                <p class="font-semibold text-white">${{ form.price || '0.00' }}</p>
              </div>
              <div class="text-center">
                <p class="text-xs text-gray-400">Version</p>
                <p class="font-semibold text-white">{{ form.version || '1.0.0' }}</p>
              </div>
              <div class="text-center">
                <p class="text-xs text-gray-400">Status</p>
                <span class="px-2 py-1 bg-gray-500/20 text-gray-400 text-xs rounded-full">
                  Draft
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="card">
          <h3 class="text-lg font-semibold text-white mb-4">Actions</h3>
          <div class="space-y-3">
            <button
              @click="saveDraft"
              :disabled="saving || !isFormValid"
              class="w-full btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save class="w-4 h-4 mr-2" />
              {{ saving ? 'Saving...' : 'Save Draft' }}
            </button>
            
            <button
              @click="submitForReview"
              :disabled="saving || !isFormValid"
              class="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send class="w-4 h-4 mr-2" />
              {{ saving ? 'Submitting...' : 'Submit for Review' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- AI Assistant Modal -->
    <AIAssistantModal
      v-if="showAIAssistant"
      @close="closeAIAssistant"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { usePluginStore } from '@/stores/plugin'
import { useToast } from 'vue-toastification'
import {
  Save,
  Sparkles,
  FileText,
  Tag,
  Image,
  Send,
  X
} from 'lucide-vue-next'
import AIAssistantModal from '@/components/AIAssistantModal.vue'

const router = useRouter()
const pluginStore = usePluginStore()
const toast = useToast()

const showAIAssistant = ref(false)
const saving = ref(false)
const generating = ref(false)
const tagsInput = ref('')

const form = ref({
  name: '',
  description: '',
  longDescription: '',
  version: '1.0.0',
  price: 0,
  category: '',
  tags: [] as string[],
  documentationUrl: '',
  supportUrl: '',
  demoUrl: '',
  repositoryUrl: ''
})

const isFormValid = computed(() => {
  return form.value.name && 
         form.value.description && 
         form.value.version && 
         form.value.category
})

const updateTags = () => {
  if (tagsInput.value) {
    form.value.tags = tagsInput.value
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)
  }
}

const removeTag = (index: number) => {
  form.value.tags.splice(index, 1)
  tagsInput.value = form.value.tags.join(', ')
}

const saveDraft = async () => {
  if (!isFormValid.value) {
    toast.error('Please fill in all required fields')
    return
  }
  
  saving.value = true
  
  try {
    const result = await pluginStore.createPlugin(form.value)
    if (result.success) {
      toast.success('Plugin saved as draft!')
      router.push(`/plugins/${result.plugin.id}/edit`)
    } else {
      toast.error(result.message || 'Failed to save plugin')
    }
  } catch (error) {
    toast.error('Failed to save plugin')
  } finally {
    saving.value = false
  }
}

const submitForReview = async () => {
  if (!isFormValid.value) {
    toast.error('Please fill in all required fields')
    return
  }
  
  saving.value = true
  
  try {
    const result = await pluginStore.createPlugin(form.value)
    if (result.success) {
      const submitResult = await pluginStore.submitForReview(result.plugin.id)
      if (submitResult.success) {
        toast.success('Plugin submitted for review!')
        router.push('/plugins')
      } else {
        toast.error(submitResult.message || 'Failed to submit plugin')
      }
    } else {
      toast.error(result.message || 'Failed to create plugin')
    }
  } catch (error) {
    toast.error('Failed to submit plugin')
  } finally {
    saving.value = false
  }
}

const generateDescription = async () => {
  if (!form.value.name) return
  
  generating.value = true
  
  try {
    // Mock AI generation - in real app would call AI service
    setTimeout(() => {
      form.value.description = `A powerful ${form.value.category.toLowerCase()} plugin that helps users streamline their workflow and boost productivity.`
      toast.success('Description generated!')
      generating.value = false
    }, 2000)
  } catch (error) {
    toast.error('Failed to generate description')
    generating.value = false
  }
}

const generateTags = async () => {
  if (!form.value.name || !form.value.description) return
  
  generating.value = true
  
  try {
    // Mock AI generation - in real app would call AI service
    setTimeout(() => {
      form.value.tags = ['productivity', 'automation', 'efficiency']
      tagsInput.value = form.value.tags.join(', ')
      toast.success('Tags generated!')
      generating.value = false
    }, 2000)
  } catch (error) {
    toast.error('Failed to generate tags')
    generating.value = false
  }
}

const generateIcon = async () => {
  if (!form.value.name) return
  
  generating.value = true
  
  try {
    // Mock AI generation - in real app would call AI service
    setTimeout(() => {
      toast.success('Icon generated! (Feature coming soon)')
      generating.value = false
    }, 2000)
  } catch (error) {
    toast.error('Failed to generate icon')
    generating.value = false
  }
}

const openAIAssistant = () => {
  showAIAssistant.value = true
}

const closeAIAssistant = () => {
  showAIAssistant.value = false
}

// Watch for form changes to auto-save
let autoSaveTimeout: NodeJS.Timeout
watch(form.value, () => {
  clearTimeout(autoSaveTimeout)
  autoSaveTimeout = setTimeout(() => {
    if (isFormValid.value) {
      // Auto-save logic here
    }
  }, 5000)
}, { deep: true })
</script>