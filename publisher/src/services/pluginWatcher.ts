import fs from 'fs';
import path from 'path';
import { PublisherDataSource } from '../config/database';
import { PublisherPlugin, PublisherPluginStatus } from '../entities/PublisherPlugin';
import { PublisherUser, PublisherRole } from '../entities/PublisherUser';
import { PluginProcessor } from './pluginProcessor';
import { SyncService } from './syncService';

export class PluginWatcher {
  private watcher: fs.FSWatcher | null = null;
  private pluginProcessor: PluginProcessor;
  private syncService: SyncService;
  private pluginsDir: string;

  constructor() {
    this.pluginsDir = path.join(process.cwd(), 'plugins');
    this.pluginProcessor = new PluginProcessor();
    this.syncService = new SyncService();
  }

  async start(): Promise<void> {
    console.log(`🔍 Iniciando monitor de plugins en: ${this.pluginsDir}`);

    // Asegurar que la carpeta existe
    if (!fs.existsSync(this.pluginsDir)) {
      fs.mkdirSync(this.pluginsDir, { recursive: true });
    }

    // Procesar plugins existentes
    await this.processExistingPlugins();

    // Iniciar monitor de cambios
    this.watcher = fs.watch(this.pluginsDir, { recursive: true }, (eventType, filename) => {
      if (filename) {
        this.handleFileChange(eventType, filename);
      }
    });

    console.log('✅ Monitor de plugins iniciado correctamente');
  }

  async stop(): Promise<void> {
    if (this.watcher) {
      this.watcher.close();
      this.watcher = null;
      console.log('🛑 Monitor de plugins detenido');
    }
  }

  private async processExistingPlugins(): Promise<void> {
    try {
      const entries = fs.readdirSync(this.pluginsDir, { withFileTypes: true });
      
      for (const entry of entries) {
        if (entry.isDirectory()) {
          await this.processPlugin(entry.name);
        }
      }
    } catch (error) {
      console.error('❌ Error procesando plugins existentes:', error);
    }
  }

  private handleFileChange(eventType: string, filename: string): void {
    console.log(`📁 Cambio detectado: ${eventType} - ${filename}`);
    
    // Evitar procesar archivos temporales
    if (filename.startsWith('.') || filename.includes('~')) {
      return;
    }

    const fullPath = path.join(this.pluginsDir, filename);
    
    setTimeout(async () => {
      try {
        if (fs.existsSync(fullPath)) {
          const stat = fs.statSync(fullPath);
          if (stat.isDirectory()) {
            await this.processPlugin(filename);
          }
        }
      } catch (error) {
        console.error(`❌ Error procesando ${filename}:`, error);
      }
    }, 1000); // Esperar 1 segundo para evitar procesamiento incompleto
  }

  private async processPlugin(pluginName: string): Promise<void> {
    try {
      const pluginPath = path.join(this.pluginsDir, pluginName);
      const manifestPath = path.join(pluginPath, 'plugin.json');

      // Verificar si existe el manifest
      if (!fs.existsSync(manifestPath)) {
        console.log(`⚠️  Plugin ${pluginName} no tiene manifest.json`);
        return;
      }

      // Leer y validar manifest
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
      const validationResult = this.pluginProcessor.validateManifest(manifest);

      if (!validationResult.valid) {
        console.log(`❌ Plugin ${pluginName} inválido: ${validationResult.errors.join(', ')}`);
        return;
      }

      // Procesar el plugin
      const processedPlugin = await this.pluginProcessor.processPlugin(pluginPath, manifest);

      // Guardar en base de datos
      const savedPlugin = await this.savePluginToDatabase(processedPlugin);

      // Si el plugin está aprobado, sincronizar con el backend principal
      if (savedPlugin && savedPlugin.status === PublisherPluginStatus.APPROVED) {
        console.log(`🔄 Sincronizando plugin aprobado: ${pluginName}`);
        await this.syncService.syncApprovedPlugin(savedPlugin);
      }

      console.log(`✅ Plugin ${pluginName} procesado correctamente`);

    } catch (error) {
      console.error(`❌ Error procesando plugin ${pluginName}:`, error);
    }
  }

  private async savePluginToDatabase(pluginData: any): Promise<PublisherPlugin | null> {
    try {
      if (!PublisherDataSource.isInitialized) {
        await PublisherDataSource.initialize();
      }

      const pluginRepository = PublisherDataSource.getRepository(PublisherPlugin);
      const userRepository = PublisherDataSource.getRepository(PublisherUser);

      // Asegurar que exista un autor por defecto
      let author = await userRepository.findOne({ where: { email: 'admin@example.com' } });
      
      if (!author) {
        // Crear usuario por defecto si no existe
        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash('admin123', 10);
        
        const newAuthor = new PublisherUser();
        newAuthor.username = 'admin';
        newAuthor.email = 'admin@example.com';
        newAuthor.password = hashedPassword;
        newAuthor.role = PublisherRole.ADMIN;
        newAuthor.isActive = true;
        newAuthor.isVerified = true;
        
        author = await userRepository.save(newAuthor);
        console.log('👤 Usuario admin creado por defecto');
      } else {
        console.log('👤 Usuario admin ya existe, reutilizando...');
      }

      // Asegurar que el plugin tenga un autor
      if (!pluginData.authorId) {
        pluginData.authorId = author.id;
        pluginData.author_id = author.id; // Para la columna foreign key
      }

      // Verificar si el plugin ya existe
      const existingPlugin = await pluginRepository.findOne({
        where: { title: pluginData.title }
      });

      let savedPlugin: PublisherPlugin;

      if (existingPlugin) {
        // Actualizar plugin existente
        Object.assign(existingPlugin, pluginData);
        const updated = await pluginRepository.save(existingPlugin);
        savedPlugin = Array.isArray(updated) ? updated[0] : updated;
        console.log(`🔄 Plugin actualizado: ${pluginData.title}`);
      } else {
        // Crear nuevo plugin
        const newPlugin = pluginRepository.create(pluginData);
        const created = await pluginRepository.save(newPlugin);
        savedPlugin = Array.isArray(created) ? created[0] : created;
        console.log(`🆕 Plugin creado: ${pluginData.title}`);
      }

      return savedPlugin;

    } catch (error) {
      console.error('❌ Error guardando plugin en base de datos:', error);
      return null;
    }
  }

  getPluginsDir(): string {
    return this.pluginsDir;
  }

  async syncAllApprovedPlugins(): Promise<void> {
    console.log('🔄 Iniciando sincronización de todos los plugins aprobados...');
    await this.syncService.syncAllApprovedPlugins();
  }
}