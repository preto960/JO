import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { pluginLifecycleService } from './pluginLifecycleService';

export class WebSocketService {
  private io: SocketIOServer | null = null;

  /**
   * Inicializa el servidor WebSocket
   */
  initialize(httpServer: HTTPServer) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3002',
        methods: ['GET', 'POST'],
        credentials: true
      }
    });

    this.setupEventListeners();
    this.setupPluginLifecycleListeners();

    console.log('✅ WebSocket server initialized');
  }

  /**
   * Configura los listeners de eventos del WebSocket
   */
  private setupEventListeners() {
    if (!this.io) return;

    this.io.on('connection', (socket: Socket) => {
      console.log(`🔌 Client connected: ${socket.id}`);

      socket.on('disconnect', () => {
        console.log(`🔌 Client disconnected: ${socket.id}`);
      });

      // Evento para que el cliente solicite el estado actual de plugins
      socket.on('request:plugin-status', () => {
        const loadedPlugins = pluginLifecycleService.getLoadedPlugins();
        socket.emit('plugin:status', {
          loadedPlugins: Array.from(loadedPlugins.entries()).map(([id, plugin]) => ({
            id,
            ...plugin
          }))
        });
      });
    });
  }

  /**
   * Configura los listeners del ciclo de vida de plugins
   */
  private setupPluginLifecycleListeners() {
    // Cuando un plugin se carga
    pluginLifecycleService.on('pluginLoaded', (data) => {
      console.log(`📡 Broadcasting: Plugin loaded - ${data.slug}`);
      this.broadcast('plugin:loaded', data);
    });

    // Cuando un plugin se descarga
    pluginLifecycleService.on('pluginUnloaded', (data) => {
      console.log(`📡 Broadcasting: Plugin unloaded - ${data.slug}`);
      this.broadcast('plugin:unloaded', data);
    });

    // Cuando un plugin se recarga
    pluginLifecycleService.on('pluginReloaded', (data) => {
      console.log(`📡 Broadcasting: Plugin reloaded - ${data.slug}`);
      this.broadcast('plugin:reloaded', data);
    });

    // Cuando hay un error en un plugin
    pluginLifecycleService.on('error', (data) => {
      console.log(`📡 Broadcasting: Plugin error - ${data.context.pluginSlug}`);
      this.broadcast('plugin:error', {
        pluginId: data.context.pluginId,
        pluginSlug: data.context.pluginSlug,
        error: data.error.message
      });
    });
  }

  /**
   * Emite un evento a todos los clientes conectados
   */
  broadcast(event: string, data: any) {
    if (!this.io) {
      console.warn('WebSocket server not initialized');
      return;
    }

    this.io.emit(event, data);
  }

  /**
   * Emite un evento a un cliente específico
   */
  emitToClient(socketId: string, event: string, data: any) {
    if (!this.io) {
      console.warn('WebSocket server not initialized');
      return;
    }

    this.io.to(socketId).emit(event, data);
  }

  /**
   * Notifica que un plugin fue instalado
   */
  notifyPluginInstalled(pluginId: string, pluginSlug: string, pluginName: string) {
    this.broadcast('plugin:installed', {
      pluginId,
      slug: pluginSlug,
      name: pluginName,
      timestamp: new Date()
    });
  }

  /**
   * Notifica que un plugin fue desinstalado
   */
  notifyPluginUninstalled(pluginId: string, pluginSlug: string, pluginName: string) {
    this.broadcast('plugin:uninstalled', {
      pluginId,
      slug: pluginSlug,
      name: pluginName,
      timestamp: new Date()
    });
  }

  /**
   * Notifica que un plugin fue actualizado
   */
  notifyPluginUpdated(pluginId: string, pluginSlug: string, pluginName: string, oldVersion: string, newVersion: string) {
    this.broadcast('plugin:updated', {
      pluginId,
      slug: pluginSlug,
      name: pluginName,
      oldVersion,
      newVersion,
      timestamp: new Date()
    });
  }

  /**
   * Notifica que un plugin fue activado/desactivado
   */
  notifyPluginToggled(pluginId: string, pluginSlug: string, pluginName: string, isActive: boolean) {
    this.broadcast('plugin:toggled', {
      pluginId,
      slug: pluginSlug,
      name: pluginName,
      isActive,
      timestamp: new Date()
    });
  }

  /**
   * Obtiene el servidor Socket.IO
   */
  getIO(): SocketIOServer | null {
    return this.io;
  }
}

export const websocketService = new WebSocketService();

