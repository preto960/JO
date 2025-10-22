<template>
  <div class="p-6">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Publicar Plugin</h1>
      <p class="text-gray-600 dark:text-gray-400 mt-1">
        Publica manualmente un plugin desde el sistema de archivos
      </p>
    </div>

    <!-- Plugin Folder Status -->
    <Card class="mb-6">
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <FolderOpen class="w-5 h-5 text-blue-600" />
          Estado de la Carpeta de Plugins
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div>
              <p class="font-medium text-gray-900 dark:text-white">Carpeta de Plugins</p>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ pluginsFolder }}</p>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span class="text-sm text-green-600 dark:text-green-400">Activa</span>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ detectedPlugins.length }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-400">Plugins Detectados</p>
            </div>
            <div class="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ publishedPlugins.length }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-400">Publicados</p>
            </div>
            <div class="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <p class="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{{ pendingPlugins.length }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-400">Pendientes</p>
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
            <Search class="w-5 h-5 text-green-600" />
            Plugins Detectados
          </span>
          <Button @click="refreshPlugins" variant="outline" size="sm">
            <RefreshCw class="w-4 h-4 mr-2" />
            Actualizar
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div v-if="loading" class="flex items-center justify-center py-8">
          <Loader2 class="w-8 h-8 animate-spin text-blue-600" />
          <span class="ml-2 text-gray-600 dark:text-gray-400">Detectando plugins...</span>
        </div>

        <div v-else-if="detectedPlugins.length === 0" class="text-center py-8">
          <FolderX class="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p class="text-gray-600 dark:text-gray-400">
            No se detectaron plugins en la carpeta
          </p>
          <p class="text-sm text-gray-500 dark:text-gray-500 mt-2">
            Coloca las carpetas de los plugins en {{ pluginsFolder }}
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
                    <User class="w-3 h-3" />
                    {{ plugin.author }}
                  </span>
                  <span class="flex items-center gap-1">
                    <Tag class="w-3 h-3" />
                    {{ plugin.category }}
                  </span>
                  <span class="flex items-center gap-1">
                    <DollarSign class="w-3 h-3" />
                    ${{ plugin.price }}
                  </span>
                  <span class="flex items-center gap-1">
                    <FileText class="w-3 h-3" />
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
                  <Upload class="w-4 h-4 mr-2" />
                  Publicar
                </Button>
                <Button
                  v-else-if="plugin.status === 'PENDING'"
                  @click="approvePlugin(plugin)"
                  size="sm"
                  class="bg-blue-600 hover:bg-blue-700"
                >
                  <Check class="w-4 h-4 mr-2" />
                  Aprobar
                </Button>
                <Button
                  @click="viewPluginDetails(plugin)"
                  variant="outline"
                  size="sm"
                >
                  <Eye class="w-4 h-4 mr-2" />
                  Ver
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
          <PlusCircle class="w-5 h-5 text-purple-600" />
          Crear Plantilla de Plugin
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Crea una plantilla básica para desarrollar un nuevo plugin
          </p>
          <div class="flex items-center gap-4">
            <Input
              v-model="newPluginName"
              placeholder="Nombre del plugin"
              class="max-w-xs"
            />
            <Button
              @click="createPluginTemplate"
              :disabled="!newPluginName.trim()"
              class="bg-purple-600 hover:bg-purple-700"
            >
              <PlusCircle class="w-4 h-4 mr-2" />
              Crear Plantilla
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Plugin Details Modal -->
    <Dialog v-model:open="showDetailsModal">
      <DialogContent class="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalles del Plugin</DialogTitle>
          <DialogDescription>
            Información completa del plugin seleccionado
          </DialogDescription>
        </DialogHeader>
        
        <div v-if="selectedPlugin" class="space-y-6">
          <!-- Basic Info -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Nombre</label>
              <p class="text-gray-900 dark:text-white">{{ selectedPlugin.name }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Versión</label>
              <p class="text-gray-900 dark:text-white">{{ selectedPlugin.version }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Autor</label>
              <p class="text-gray-900 dark:text-white">{{ selectedPlugin.author }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Categoría</label>
              <p class="text-gray-900 dark:text-white">{{ selectedPlugin.category }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Precio</label>
              <p class="text-gray-900 dark:text-white">${{ selectedPlugin.price }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Estado</label>
              <Badge :variant="getStatusVariant(selectedPlugin.status)">
                {{ getStatusText(selectedPlugin.status) }}
              </Badge>
            </div>
          </div>

          <!-- Description -->
          <div>
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Descripción</label>
            <p class="text-gray-900 dark:text-white mt-1">{{ selectedPlugin.description }}</p>
          </div>

          <!-- Metadata -->
          <div v-if="selectedPlugin.metadata">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Metadatos</label>
            <div class="mt-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <pre class="text-xs text-gray-600 dark:text-gray-400 overflow-x-auto">{{ JSON.stringify(selectedPlugin.metadata, null, 2) }}</pre>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" @click="showDetailsModal = false">
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useToastStore } from '@/stores/toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  FolderOpen,
  Search,
  RefreshCw,
  Loader2,
  FolderX,
  Upload,
  Check,
  Eye,
  PlusCircle,
  User,
  Tag,
  DollarSign,
  FileText
} from 'lucide-vue-next'

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
        description: 'Plugin de ejemplo para demostrar el sistema',
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
    
    toastStore.addToast('Plugins actualizados correctamente', 'success')
  } catch (error) {
    toastStore.addToast('Error al actualizar plugins', 'error')
  } finally {
    loading.value = false
  }
}

const publishPlugin = async (plugin: any) => {
  try {
    // Aquí iría la lógica real para publicar el plugin
    plugin.status = 'PENDING'
    toastStore.addToast(`Plugin ${plugin.name} enviado para aprobación`, 'success')
  } catch (error) {
    toastStore.addToast('Error al publicar plugin', 'error')
  }
}

const approvePlugin = async (plugin: any) => {
  try {
    // Aquí iría la lógica real para aprobar el plugin
    plugin.status = 'APPROVED'
    toastStore.addToast(`Plugin ${plugin.name} aprobado y publicado`, 'success')
  } catch (error) {
    toastStore.addToast('Error al aprobar plugin', 'error')
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
    toastStore.addToast(`Plantilla ${newPluginName.value} creada correctamente`, 'success')
    newPluginName.value = ''
    await refreshPlugins()
  } catch (error) {
    toastStore.addToast('Error al crear plantilla', 'error')
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
    case 'DETECTED': return 'Detectado'
    case 'PENDING': return 'Pendiente'
    case 'APPROVED': return 'Aprobado'
    case 'REJECTED': return 'Rechazado'
    default: return status
  }
}

onMounted(() => {
  refreshPlugins()
})
</script>