import { AppDataSource } from '@/config/database';
import { Plugin, User, PluginStatus, UserRole } from '@/entities';
import axios from 'axios';

interface PublisherPlugin {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  category: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  zipPath?: string;
  metadata?: any;
}

export class PluginSyncService {
  private publisherUrl = 'http://localhost:3006';
  private pluginRepository = AppDataSource.getRepository(Plugin);
  private userRepository = AppDataSource.getRepository(User);

  async syncPluginsFromPublisher(): Promise<void> {
    try {
      console.log('🔄 Starting plugin sync from publisher...');
      
      // Obtener plugins del publisher
      const response = await axios.get(`${this.publisherUrl}/api/plugins`);
      const publisherPlugins: PublisherPlugin[] = response.data.plugins || response.data;
      
      console.log(`📦 Found ${publisherPlugins.length} plugins in publisher`);

      // Obtener o crear usuario admin por defecto
      let adminUser = await this.userRepository.findOne({ 
        where: { email: 'admin@example.com' } 
      });
      
      if (!adminUser) {
        adminUser = this.userRepository.create({
          username: 'admin',
          email: 'admin@example.com',
          password: 'admin123', // En producción esto debería estar hasheado
          role: UserRole.ADMIN
        });
        adminUser = await this.userRepository.save(adminUser);
        console.log('👤 Created admin user for plugin sync');
      }

      // Sincronizar cada plugin
      for (const publisherPlugin of publisherPlugins) {
        await this.syncSinglePlugin(publisherPlugin, adminUser.id);
      }

      console.log('✅ Plugin sync completed successfully');
    } catch (error) {
      console.error('❌ Error syncing plugins from publisher:', error);
      throw error;
    }
  }

  private async syncSinglePlugin(publisherPlugin: PublisherPlugin, authorId: string): Promise<void> {
    try {
      // Verificar si el plugin ya existe
      const existingPlugin = await this.pluginRepository.findOne({
        where: { title: publisherPlugin.name }
      });

      const pluginData = {
        title: publisherPlugin.name,
        description: publisherPlugin.description,
        version: publisherPlugin.version,
        price: 0, // Por defecto gratis
        category: publisherPlugin.category || 'general',
        tags: [],
        downloadUrl: publisherPlugin.zipPath || '',
        demoUrl: '',
        githubUrl: '',
        documentationUrl: '',
        authorId,
        status: publisherPlugin.status === 'approved' ? PluginStatus.APPROVED : PluginStatus.PENDING,
        isActive: true
      };

      if (existingPlugin) {
        // Actualizar plugin existente
        await this.pluginRepository.update(existingPlugin.id, pluginData);
        console.log(`🔄 Updated plugin: ${publisherPlugin.name}`);
      } else {
        // Crear nuevo plugin
        const newPlugin = this.pluginRepository.create(pluginData);
        await this.pluginRepository.save(newPlugin);
        console.log(`➕ Created new plugin: ${publisherPlugin.name}`);
      }
    } catch (error) {
      console.error(`❌ Error syncing plugin ${publisherPlugin.name}:`, error);
    }
  }

  async startPeriodicSync(intervalMinutes: number = 5): Promise<void> {
    console.log(`⏰ Starting periodic plugin sync every ${intervalMinutes} minutes`);
    
    // Sincronizar inmediatamente
    await this.syncPluginsFromPublisher();
    
    // Configurar sincronización periódica
    setInterval(async () => {
      try {
        await this.syncPluginsFromPublisher();
      } catch (error) {
        console.error('❌ Periodic sync failed:', error);
      }
    }, intervalMinutes * 60 * 1000);
  }
}

export const pluginSyncService = new PluginSyncService();