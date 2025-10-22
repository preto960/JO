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
import { usePluginStore } from '@/stores/plugins'
import { useAuthStore } from '@/stores/auth'
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
const pluginStore = usePluginStore()
const authStore = useAuthStore()

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
    // Load plugins from database
    const [allPlugins, pendingPlugins, approvedPlugins] = await Promise.all([
      pluginStore.fetchPlugins(),
      pluginsApi.getPluginsByStatus('PENDING'),
      pluginsApi.getPluginsByStatus('APPROVED')
    ])
    
    // Get detected plugins from file system (simulated for now)
    const fileSystemPlugins = await getDetectedPluginsFromFileSystem()
    
    // Merge file system plugins with database plugins
    detectedPlugins.value = fileSystemPlugins.map(fsPlugin => {
      const existingPlugin = allPlugins.find((db: any) => db.title === fsPlugin.name)
      if (existingPlugin) {
        return {
          ...fsPlugin,
          id: existingPlugin.id,
          status: existingPlugin.status,
          databaseRecord: existingPlugin
        }
      }
      return fsPlugin
    })
    
    // Update counters
    publishedPlugins.value = approvedPlugins || []
    pendingPlugins.value = pendingPlugins || []
    
    toastStore.success('Plugins updated successfully')
  } catch (error) {
    console.error('Error refreshing plugins:', error)
    toastStore.error('Error updating plugins')
  } finally {
    loading.value = false
  }
}

const getDetectedPluginsFromFileSystem = async () => {
  // Simulate file system detection
  // In a real implementation, this would read from the actual plugins directory
  await new Promise(resolve => setTimeout(resolve, 500))
  
  return [
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
}

const publishPlugin = async (plugin: any) => {
  try {
    loading.value = true
    
    // Create plugin in database
    const pluginData = {
      title: plugin.name,
      description: plugin.description,
      price: plugin.price,
      category: plugin.category,
      tags: plugin.tags || [],
      version: plugin.version,
      downloadUrl: plugin.downloadUrl,
      demoUrl: plugin.demoUrl,
      githubUrl: plugin.githubUrl,
      documentationUrl: plugin.documentationUrl
    }
    
    const createdPlugin = await pluginsApi.createPlugin(pluginData)
    
    // Update local plugin status
    plugin.status = 'PENDING'
    plugin.id = createdPlugin.id
    plugin.databaseRecord = createdPlugin
    
    // Package the plugin (create zip file)
    await packagePlugin(plugin)
    
    // Refresh counters
    await refreshPlugins()
    
    toastStore.success(`Plugin ${plugin.name} submitted for approval`)
  } catch (error) {
    console.error('Error publishing plugin:', error)
    toastStore.error('Error publishing plugin')
  } finally {
    loading.value = false
  }
}

const packagePlugin = async (plugin: any) => {
  try {
    // This would create a zip package of the plugin
    // For now, we'll simulate the packaging process
    console.log(`Packaging plugin: ${plugin.name}`)
    
    // In a real implementation, this would:
    // 1. Read all plugin files from the filesystem
    // 2. Create a zip archive
    // 3. Upload to a storage service
    // 4. Update the plugin record with the download URL
    
    await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate packaging time
    
    console.log(`Plugin ${plugin.name} packaged successfully`)
  } catch (error) {
    console.error('Error packaging plugin:', error)
    throw error
  }
}

const approvePlugin = async (plugin: any) => {
  try {
    if (!plugin.id) {
      toastStore.error('Plugin ID not found')
      return
    }
    
    // Update plugin status in database
    await pluginsApi.updatePluginStatus(plugin.id, 'APPROVED')
    
    // Update local plugin status
    plugin.status = 'APPROVED'
    
    // Refresh counters
    await refreshPlugins()
    
    toastStore.success(`Plugin ${plugin.name} approved and published`)
  } catch (error) {
    console.error('Error approving plugin:', error)
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
    case 'DRAFT': return 'secondary'
    default: return 'secondary'
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'DETECTED': return 'Detected'
    case 'PENDING': return 'Pending'
    case 'APPROVED': return 'Published'
    case 'REJECTED': return 'Rejected'
    case 'DRAFT': return 'Draft'
    default: return status
  }
}

onMounted(() => {
  refreshPlugins()
})
</script>