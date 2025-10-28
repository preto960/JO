import { ref, onMounted, onUnmounted } from 'vue';
import { io, Socket } from 'socket.io-client';
import { useToast } from 'vue-toastification';
import { usePluginLoader } from './usePluginLoader';
import { usePluginsStore } from '@/stores/plugins';

const socket = ref<Socket | null>(null);
const isConnected = ref(false);

export function useWebSocket() {
  const toast = useToast();
  const pluginLoader = usePluginLoader();
  const pluginsStore = usePluginsStore();

  const connect = () => {
    if (socket.value?.connected) {
      console.log('WebSocket already connected');
      return;
    }

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    
    console.log('🔌 Connecting to WebSocket:', apiUrl);
    
    socket.value = io(apiUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    // Eventos de conexión
    socket.value.on('connect', () => {
      console.log('✅ WebSocket connected');
      isConnected.value = true;
      
      // Solicitar estado actual de plugins
      socket.value?.emit('request:plugin-status');
    });

    socket.value.on('disconnect', () => {
      console.log('❌ WebSocket disconnected');
      isConnected.value = false;
    });

    socket.value.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      isConnected.value = false;
    });

    // Eventos de plugins
    socket.value.on('plugin:loaded', (data) => {
      console.log('📦 Plugin loaded:', data);
      toast.info(`Plugin ${data.slug} loaded`);
    });

    socket.value.on('plugin:unloaded', (data) => {
      console.log('📤 Plugin unloaded:', data);
      toast.info(`Plugin ${data.slug} unloaded`);
      
      // Descargar el plugin del sistema de routing
      pluginLoader.unloadPlugin(data.pluginId);
    });

    socket.value.on('plugin:reloaded', (data) => {
      console.log('🔄 Plugin reloaded:', data);
      toast.info(`Plugin ${data.slug} reloaded`, {
        icon: '🔄'
      });
      
      // Recargar el plugin en el sistema de routing
      pluginLoader.reloadPlugin(data.pluginId);
    });

    socket.value.on('plugin:installed', async (data) => {
      console.log('✅ Plugin installed:', data);
      toast.success(`Plugin ${data.name} installed successfully!`, {
        timeout: 5000
      });
      
      // Recargar la lista de plugins
      await pluginsStore.fetchInstalledPlugins();
      
      // Cargar el plugin si está activo
      const plugin = pluginsStore.installedPlugins.find(p => p.id === data.pluginId);
      if (plugin && plugin.isActive) {
        await pluginLoader.loadPlugin(data.pluginId);
      }
    });

    socket.value.on('plugin:uninstalled', async (data) => {
      console.log('🗑️ Plugin uninstalled:', data);
      toast.warning(`Plugin ${data.name} uninstalled`, {
        timeout: 5000
      });
      
      // Descargar el plugin
      await pluginLoader.unloadPlugin(data.pluginId);
      
      // Recargar la lista de plugins
      await pluginsStore.fetchInstalledPlugins();
    });

    socket.value.on('plugin:updated', (data) => {
      console.log('⬆️ Plugin updated:', data);
      toast.success(`Plugin ${data.name} updated from ${data.oldVersion} to ${data.newVersion}`, {
        timeout: 5000
      });
      
      // Recargar el plugin con la nueva versión
      pluginLoader.reloadPlugin(data.pluginId);
    });

    socket.value.on('plugin:toggled', async (data) => {
      console.log('🔀 Plugin toggled:', data);
      
      // Recargar la lista de plugins primero
      await pluginsStore.fetchInstalledPlugins();
      
      if (data.isActive) {
        toast.success(`Plugin ${data.name} activated`);
        // Cargar el plugin
        await pluginLoader.loadPlugin(data.pluginId);
      } else {
        toast.info(`Plugin ${data.name} deactivated`);
        // Descargar el plugin
        await pluginLoader.unloadPlugin(data.pluginId);
      }
    });

    socket.value.on('plugin:error', (data) => {
      console.error('❌ Plugin error:', data);
      toast.error(`Error in plugin ${data.pluginSlug}: ${data.error}`, {
        timeout: 10000
      });
    });

    socket.value.on('plugin:status', (data) => {
      console.log('📊 Plugin status received:', data);
      // Aquí podrías actualizar el estado de plugins cargados
    });
  };

  const disconnect = () => {
    if (socket.value) {
      socket.value.disconnect();
      socket.value = null;
      isConnected.value = false;
      console.log('WebSocket disconnected manually');
    }
  };

  const requestPluginStatus = () => {
    if (socket.value?.connected) {
      socket.value.emit('request:plugin-status');
    }
  };

  return {
    socket,
    isConnected,
    connect,
    disconnect,
    requestPluginStatus
  };
}

// Singleton instance para uso global
let globalWebSocket: ReturnType<typeof useWebSocket> | null = null;

export function useGlobalWebSocket() {
  if (!globalWebSocket) {
    globalWebSocket = useWebSocket();
  }
  return globalWebSocket;
}

