<template>
  <div class="p-6">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Publish Plugin</h1>
      <p class="text-gray-600 dark:text-gray-400 mt-1">
        Manually publish a plugin from the file system
      </p>
    </div>

    <!-- Plugin Folder Status -->
    <Card class="mb-6">
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <FolderOpenIcon class="w-5 h-5 text-blue-600" />
          Plugin Folder Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div>
              <p class="font-medium text-gray-900 dark:text-white">Plugin Folder</p>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ pluginsFolder }}</p>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span class="text-sm text-green-600 dark:text-green-400">Active</span>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ detectedPlugins.length }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-400">Detected Plugins</p>
            </div>
            <div class="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ publishedPlugins.length }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-400">Published</p>
            </div>
            <div class="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <p class="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{{ pendingPlugins.length }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-400">Pending</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Detected Plugins -->
    <Card class="mb-6">
      <CardHeader>
        <CardTitle class="flex items-center justify-between">
          <span class="flex items-center gap-2">
            <MagnifyingGlassIcon class="w-5 h-5 text-green-600" />
            Detected Plugins
          </span>
          <Button @click="refreshPlugins" variant="outline" size="sm">
            <ArrowPathIcon class="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div v-if="loading" class="flex items-center justify-center py-8">
          <ArrowPathIcon class="w-8 h-8 animate-spin text-blue-600" />
          <span class="ml-2 text-gray-600 dark:text-gray-400">Detecting plugins...</span>
        </div>

        <div v-else-if="detectedPlugins.length === 0" class="text-center py-8">
          <FolderIcon class="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p class="text-gray-600 dark:text-gray-400">
            No plugins detected in the folder
          </p>
          <p class="text-sm text-gray-500 dark:text-gray-500 mt-2">
            Place plugin folders in {{ pluginsFolder }}
          </p>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="plugin in detectedPlugins"
            :key="plugin.name"
            class="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-2">
                  <h3 class="font-semibold text-gray-900 dark:text-white">{{ plugin.name }}</h3>
                  <Badge :variant="getStatusVariant(plugin.status)">
                    {{ getStatusText(plugin.status) }}
                  </Badge>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">{{ plugin.description }}</p>
                <div class="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                  <span class="flex items-center gap-1">
                    <UserIcon class="w-3 h-3" />
                    {{ plugin.author }}
                  </span>
                  <span class="flex items-center gap-1">
                    <TagIcon class="w-3 h-3" />
                    {{ plugin.category }}
                  </span>
                  <span class="flex items-center gap-1">
                    <CurrencyDollarIcon class="w-3 h-3" />
                    ${{ plugin.price }}
                  </span>
                  <span class="flex items-center gap-1">
                    <DocumentTextIcon class="w-3 h-3" />
                    v{{ plugin.version }}
                  </span>
                </div>
              </div>
              <div class="flex items-center gap-2 ml-4">
                <Button
                  v-if="plugin.status === 'DETECTED'"
                  @click="publishPlugin(plugin)"
                  size="sm"
                  class="bg-green-600 hover:bg-green-700"
                >
                  <CloudArrowUpIcon class="w-4 h-4 mr-2" />
                  Publish
                </Button>
                <Button
                  v-else-if="plugin.status === 'PENDING'"
                  @click="approvePlugin(plugin)"
                  size="sm"
                  class="bg-blue-600 hover:bg-blue-700"
                >
                  <CheckCircleIcon class="w-4 h-4 mr-2" />
                  Approve
                </Button>
                <Button
                  @click="viewPluginDetails(plugin)"
                  variant="outline"
                  size="sm"
                >
                  <EyeIcon class="w-4 h-4 mr-2" />
                  View
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Plugin Template Creator -->
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <PlusCircleIcon class="w-5 h-5 text-purple-600" />
          Create Plugin Template
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Create a basic template to develop a new plugin
          </p>
          <div class="flex items-center gap-4">
            <Input
              v-model="newPluginName"
              placeholder="Plugin name"
              class="max-w-xs"
            />
            <Button
              @click="createPluginTemplate"
              :disabled="!newPluginName.trim()"
              class="bg-purple-600 hover:bg-purple-700"
            >
              <PlusCircleIcon class="w-4 h-4 mr-2" />
              Create Template
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Plugin Details Modal -->
    <Dialog v-model:open="showDetailsModal">
      <DialogContent class="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Plugin Details</DialogTitle>
          <DialogDescription>
            Complete information about the selected plugin
          </DialogDescription>
        </DialogHeader>
        
        <div v-if="selectedPlugin" class="space-y-6">
          <!-- Basic Info -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
              <p class="text-gray-900 dark:text-white">{{ selectedPlugin.name }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Version</label>
              <p class="text-gray-900 dark:text-white">{{ selectedPlugin.version }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Author</label>
              <p class="text-gray-900 dark:text-white">{{ selectedPlugin.author }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
              <p class="text-gray-900 dark:text-white">{{ selectedPlugin.category }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Price</label>
              <p class="text-gray-900 dark:text-white">${{ selectedPlugin.price }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
              <Badge :variant="getStatusVariant(selectedPlugin.status)">
                {{ getStatusText(selectedPlugin.status) }}
              </Badge>
            </div>
          </div>

          <!-- Description -->
          <div>
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
            <p class="text-gray-900 dark:text-white mt-1">{{ selectedPlugin.description }}</p>
          </div>

          <!-- Metadata -->
          <div v-if="selectedPlugin.metadata">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Metadata</label>
            <div class="mt-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <pre class="text-xs text-gray-600 dark:text-gray-400 overflow-x-auto">{{ JSON.stringify(selectedPlugin.metadata, null, 2) }}</pre>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" @click="showDetailsModal = false">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useToastStore } from '@/stores/toast'
import Card from '@/components/ui/Card.vue'
import CardContent from '@/components/ui/CardContent.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardTitle from '@/components/ui/CardTitle.vue'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Badge from '@/components/ui/Badge.vue'
import Dialog from '@/components/ui/Dialog.vue'
import DialogContent from '@/components/ui/DialogContent.vue'
import DialogDescription from '@/components/ui/DialogDescription.vue'
import DialogFooter from '@/components/ui/DialogFooter.vue'
import DialogHeader from '@/components/ui/DialogHeader.vue'
import DialogTitle from '@/components/ui/DialogTitle.vue'
import {
  FolderOpenIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  CloudArrowUpIcon,
  CheckCircleIcon,
  EyeIcon,
  PlusCircleIcon,
  UserIcon,
  TagIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  FolderIcon,
  XCircleIcon
} from '@heroicons/vue/24/outline'

const toastStore = useToastStore()

const loading = ref(false)
const detectedPlugins = ref<any[]>([])
const publishedPlugins = ref<any[]>([])
const pendingPlugins = ref<any[]>([])
const pluginsFolder = ref('/home/z/my-project/publisher/plugins')
const newPluginName = ref('')
const showDetailsModal = ref(false)
const selectedPlugin = ref<any>(null)

const refreshPlugins = async () => {
  loading.value = true
  try {
    // Simular detección de plugins
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Aquí iría la lógica real para detectar plugins
    detectedPlugins.value = [
      {
        name: 'example-plugin',
        version: '1.0.0',
        description: 'Example plugin to demonstrate the system',
        author: 'Developer',
        category: 'utility',
        price: 0,
        status: 'DETECTED',
        metadata: {
          main: 'index.js',
          dependencies: {},
          permissions: [],
          createdAt: new Date().toISOString()
        }
      }
    ]
    
    // Actualizar contadores
    publishedPlugins.value = detectedPlugins.value.filter(p => p.status === 'APPROVED')
    pendingPlugins.value = detectedPlugins.value.filter(p => p.status === 'PENDING')
    
    toastStore.success('Plugins updated successfully')
  } catch (error) {
    toastStore.error('Error updating plugins')
  } finally {
    loading.value = false
  }
}

const publishPlugin = async (plugin: any) => {
  try {
    // Aquí iría la lógica real para publicar el plugin
    plugin.status = 'PENDING'
    toastStore.success(`Plugin ${plugin.name} submitted for approval`)
  } catch (error) {
    toastStore.error('Error publishing plugin')
  }
}

const approvePlugin = async (plugin: any) => {
  try {
    // Aquí iría la lógica real para aprobar el plugin
    plugin.status = 'APPROVED'
    toastStore.success(`Plugin ${plugin.name} approved and published`)
  } catch (error) {
    toastStore.error('Error approving plugin')
  }
}

const viewPluginDetails = (plugin: any) => {
  selectedPlugin.value = plugin
  showDetailsModal.value = true
}

const createPluginTemplate = async () => {
  if (!newPluginName.value.trim()) return
  
  try {
    // Aquí iría la lógica real para crear la plantilla
    toastStore.success(`Template ${newPluginName.value} created successfully`)
    newPluginName.value = ''
    await refreshPlugins()
  } catch (error) {
    toastStore.error('Error creating template')
  }
}

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'DETECTED': return 'secondary'
    case 'PENDING': return 'default'
    case 'APPROVED': return 'default'
    case 'REJECTED': return 'destructive'
    default: return 'secondary'
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'DETECTED': return 'Detected'
    case 'PENDING': return 'Pending'
    case 'APPROVED': return 'Approved'
    case 'REJECTED': return 'Rejected'
    default: return status
  }
}

onMounted(() => {
  refreshPlugins()
})
</script>