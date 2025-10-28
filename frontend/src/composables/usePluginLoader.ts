import { ref, computed, markRaw } from 'vue'
import { usePluginsStore } from '@/stores/plugins'

interface PluginModule {
  name: string
  version: string
  routes?: any[]
  components?: Record<string, any>
  store?: any
  initialize?: () => void | Promise<void>
  destroy?: () => void | Promise<void>
}

interface LoadedPlugin {
  id: string
  name: string
  module: PluginModule
  isActive: boolean
}

const loadedPlugins = ref<LoadedPlugin[]>([])

export function usePluginLoader() {
  const pluginsStore = usePluginsStore()

  /**
   * Carga un plugin desde su bundle dinámico
   */
  const loadPlugin = async (pluginId: string) => {
    try {
      const plugin = pluginsStore.installedPlugins.find(p => p.id === pluginId)
      if (!plugin) {
        throw new Error('Plugin not found in installed plugins')
      }

      if (!plugin.isActive) {
        console.warn(`Plugin ${plugin.name} is not active`)
        return null
      }

      // Verificar si ya está cargado
      const existing = loadedPlugins.value.find(p => p.id === pluginId)
      if (existing) {
        console.log(`Plugin ${plugin.name} already loaded`)
        return existing.module
      }

      console.log(`📦 Loading plugin ${plugin.name} from bundle...`)

      // Cargar el bundle del plugin dinámicamente
      const bundleUrl = `/api/plugin-bundles/${plugin.slug}/bundle.js?t=${Date.now()}`
      
      try {
        // Importar el módulo dinámicamente
        const pluginBundle = await import(/* @vite-ignore */ bundleUrl)
        
        console.log(`✅ Plugin bundle loaded for ${plugin.name}`)

        // Marcar componentes como raw para evitar reactividad innecesaria
        const rawComponents: Record<string, any> = {}
        if (pluginBundle.components) {
          for (const [key, component] of Object.entries(pluginBundle.components)) {
            rawComponents[key] = markRaw(component)
          }
        }

        // Crear el módulo del plugin
        const pluginModule: PluginModule = {
          name: plugin.name,
          version: plugin.version,
          routes: pluginBundle.routes || [],
          components: rawComponents,
          store: pluginBundle.store,
          initialize: pluginBundle.initialize,
          destroy: pluginBundle.destroy
        }

        // Debug: Ver qué componentes se cargaron
        console.log('📦 Plugin bundle contents:', {
          routes: pluginModule.routes,
          components: Object.keys(pluginModule.components),
          hasStore: !!pluginModule.store,
          hasInitialize: !!pluginModule.initialize
        })

        // Inicializar el plugin si tiene función de inicialización
        if (pluginModule.initialize && typeof pluginModule.initialize === 'function') {
          await pluginModule.initialize()
        }

        // Agregar a plugins cargados
        loadedPlugins.value.push({
          id: pluginId,
          name: plugin.name,
          module: pluginModule,
          isActive: true
        })

        console.log(`✅ Plugin ${plugin.name} loaded and initialized successfully`)
        return pluginModule
      } catch (bundleError: any) {
        console.error(`Failed to load plugin bundle for ${plugin.name}:`, bundleError)
        
        // Fallback: usar el manifest como antes
        console.warn(`Falling back to manifest-only mode for ${plugin.name}`)
        const pluginModule: PluginModule = {
          name: plugin.name,
          version: plugin.version,
          routes: plugin.manifest?.frontend?.routes || [],
          components: {},
          store: undefined,
          initialize: undefined,
          destroy: undefined
        }

        loadedPlugins.value.push({
          id: pluginId,
          name: plugin.name,
          module: pluginModule,
          isActive: true
        })

        return pluginModule
      }
    } catch (error) {
      console.error(`Failed to load plugin ${pluginId}:`, error)
      return null
    }
  }

  /**
   * Descarga un plugin
   */
  const unloadPlugin = async (pluginId: string) => {
    const index = loadedPlugins.value.findIndex(p => p.id === pluginId)
    if (index === -1) {
      console.warn(`Plugin ${pluginId} is not loaded`)
      return
    }

    const plugin = loadedPlugins.value[index]

    // Ejecutar función de destrucción si existe
    if (plugin.module.destroy) {
      await plugin.module.destroy()
    }

    // Remover de plugins cargados
    loadedPlugins.value.splice(index, 1)
    console.log(`✅ Plugin ${plugin.name} unloaded successfully`)
  }

  /**
   * Carga todos los plugins activos
   */
  const loadAllActivePlugins = async () => {
    const activePlugins = pluginsStore.installedPlugins.filter(p => p.isActive)
    
    for (const plugin of activePlugins) {
      await loadPlugin(plugin.id)
    }
  }

  /**
   * Recarga un plugin
   */
  const reloadPlugin = async (pluginId: string) => {
    await unloadPlugin(pluginId)
    await loadPlugin(pluginId)
  }

  /**
   * Obtiene las rutas de todos los plugins cargados
   */
  const getPluginRoutes = computed(() => {
    return loadedPlugins.value.flatMap(plugin => {
      return (plugin.module.routes || []).map(route => ({
        ...route,
        meta: {
          ...route.meta,
          pluginId: plugin.id,
          pluginName: plugin.name
        }
      }))
    })
  })

  /**
   * Obtiene los componentes de todos los plugins cargados
   */
  const getPluginComponents = computed(() => {
    const components: Record<string, any> = {}
    
    loadedPlugins.value.forEach(plugin => {
      if (plugin.module.components) {
        Object.entries(plugin.module.components).forEach(([name, component]) => {
          // Prefijo para evitar colisiones
          const prefixedName = `Plugin${plugin.name}${name}`
          components[prefixedName] = component
        })
      }
    })
    
    return components
  })

  /**
   * Verifica si un plugin está cargado
   */
  const isPluginLoaded = (pluginId: string) => {
    return loadedPlugins.value.some(p => p.id === pluginId)
  }

  /**
   * Obtiene un componente específico de un plugin por slug y nombre
   */
  const getPluginComponent = (pluginSlug: string, componentName: string) => {
    const plugin = loadedPlugins.value.find(p => {
      const installedPlugin = pluginsStore.installedPlugins.find(ip => ip.id === p.id)
      return installedPlugin?.slug === pluginSlug
    })

    if (!plugin) {
      console.warn(`Plugin ${pluginSlug} not loaded`)
      return null
    }

    if (!plugin.module.components) {
      console.warn(`Plugin ${pluginSlug} has no components`)
      return null
    }

    const component = plugin.module.components[componentName]
    if (!component) {
      console.warn(`Component ${componentName} not found in plugin ${pluginSlug}`)
      return null
    }

    return component
  }

  return {
    loadedPlugins: computed(() => loadedPlugins.value),
    loadPlugin,
    unloadPlugin,
    loadAllActivePlugins,
    reloadPlugin,
    getPluginRoutes,
    getPluginComponents,
    isPluginLoaded,
    getPluginComponent
  }
}

