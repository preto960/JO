import fs from 'fs';
import path from 'path';
import { AppDataSource } from '../data-source';
import { PublisherPlugin } from '../entities/PublisherPlugin';
import { PluginProcessor } from './pluginProcessor';

export class PluginWatcher {
  private watcher: fs.FSWatcher | null = null;
  private pluginProcessor: PluginProcessor;
  private pluginsDir: string;

  constructor() {
    this.pluginsDir = path.join(process.cwd(), 'plugins');
    this.pluginProcessor = new PluginProcessor();
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
      await this.savePluginToDatabase(processedPlugin);

      console.log(`✅ Plugin ${pluginName} procesado correctamente`);

    } catch (error) {
      console.error(`❌ Error procesando plugin ${pluginName}:`, error);
    }
  }

  private async savePluginToDatabase(pluginData: any): Promise<void> {
    try {
      if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
      }

      const pluginRepository = AppDataSource.getRepository(PublisherPlugin);

      // Verificar si el plugin ya existe
      const existingPlugin = await pluginRepository.findOne({
        where: { title: pluginData.title }
      });

      if (existingPlugin) {
        // Actualizar plugin existente
        Object.assign(existingPlugin, pluginData);
        await pluginRepository.save(existingPlugin);
        console.log(`🔄 Plugin actualizado: ${pluginData.title}`);
      } else {
        // Crear nuevo plugin
        const newPlugin = pluginRepository.create(pluginData);
        await pluginRepository.save(newPlugin);
        console.log(`🆕 Plugin creado: ${pluginData.title}`);
      }

    } catch (error) {
      console.error('❌ Error guardando plugin en base de datos:', error);
    }
  }

  getPluginsDir(): string {
    return this.pluginsDir;
  }
}