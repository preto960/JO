import fs from 'fs/promises';
import path from 'path';
import { createWriteStream, createReadStream } from 'fs';
import AdmZip from 'adm-zip';
import axios from 'axios';
import { InstalledPlugin } from '../models/InstalledPlugin';
import { AppDataSource } from '../config/database';
import { EntitySchema } from 'typeorm';

/**
 * Servicio para cargar y ejecutar plugins dinámicamente
 */
export class PluginLoaderService {
  private pluginsDir: string;
  private loadedPlugins: Map<string, any> = new Map();

  constructor() {
    this.pluginsDir = path.join(process.cwd(), 'plugins-runtime');
  }

  /**
   * Inicializa el directorio de plugins
   */
  async initialize(): Promise<void> {
    await fs.mkdir(this.pluginsDir, { recursive: true });
    console.log('✅ Plugin loader initialized');
  }

  /**
   * Descarga y extrae un plugin desde su packageUrl
   */
  async downloadAndExtractPlugin(plugin: InstalledPlugin): Promise<string> {
    const pluginDir = path.join(this.pluginsDir, plugin.slug);
    
    // Limpiar directorio si existe
    try {
      await fs.rm(pluginDir, { recursive: true, force: true });
    } catch (error) {
      // Directorio no existe, está bien
    }

    await fs.mkdir(pluginDir, { recursive: true });

    console.log(`📦 Downloading plugin ${plugin.name} from ${plugin.packageUrl}`);

    try {
      // Descargar el ZIP
      const response = await axios.get(plugin.packageUrl, {
        responseType: 'arraybuffer',
        timeout: 60000 // 60 segundos
      });

      const zipPath = path.join(pluginDir, `${plugin.slug}.zip`);
      await fs.writeFile(zipPath, response.data);

      console.log(`📂 Extracting plugin ${plugin.name}`);

      // Extraer el ZIP
      const zip = new AdmZip(zipPath);
      zip.extractAllTo(pluginDir, true);

      // Eliminar el ZIP después de extraer
      await fs.unlink(zipPath);

      console.log(`✅ Plugin ${plugin.name} extracted to ${pluginDir}`);
      return pluginDir;
    } catch (error: any) {
      console.error(`❌ Failed to download/extract plugin ${plugin.name}:`, error.message);
      throw new Error(`Failed to download plugin: ${error.message}`);
    }
  }

  /**
   * Carga las entidades (modelos) del plugin en TypeORM
   */
  async loadPluginEntities(plugin: InstalledPlugin, pluginDir: string): Promise<void> {
    if (!plugin.manifest?.backend?.models) {
      console.log(`Plugin ${plugin.name} has no backend models`);
      return;
    }

    console.log(`📊 Loading entities for plugin ${plugin.name}`);

    const models = Array.isArray(plugin.manifest.backend.models) 
      ? plugin.manifest.backend.models 
      : [plugin.manifest.backend.models];

    for (const modelPath of models) {
      try {
        const fullPath = path.join(pluginDir, modelPath.replace('.ts', '.js'));
        
        // Verificar que el archivo existe
        try {
          await fs.access(fullPath);
        } catch {
          console.warn(`⚠️  Model file not found: ${fullPath}`);
          continue;
        }

        // Importar el modelo
        const modelModule = await import(fullPath);
        const EntityClass = modelModule.default || Object.values(modelModule)[0];

        if (!EntityClass) {
          console.warn(`⚠️  No entity class found in ${modelPath}`);
          continue;
        }

        // Verificar si la entidad ya está registrada
        const metadata = AppDataSource.getMetadata(EntityClass);
        if (metadata) {
          console.log(`  ✓ Entity ${EntityClass.name} already registered`);
          continue;
        }

        // Registrar la entidad en TypeORM
        console.log(`  ✓ Registering entity ${EntityClass.name}`);
        
        // No podemos agregar entidades dinámicamente después de inicializar
        // Necesitamos usar synchronize o crear las tablas manualmente
        
      } catch (error: any) {
        console.error(`  ✗ Failed to load model ${modelPath}:`, error.message);
      }
    }
  }

  /**
   * Ejecuta un hook del plugin
   */
  async executePluginHook(
    plugin: InstalledPlugin, 
    hookName: string, 
    context: any
  ): Promise<void> {
    const pluginDir = path.join(this.pluginsDir, plugin.slug);
    
    if (!plugin.manifest?.hooks?.[hookName]) {
      console.log(`Plugin ${plugin.name} has no ${hookName} hook`);
      return;
    }

    const hookPath = plugin.manifest.hooks[hookName];
    const fullPath = path.join(pluginDir, hookPath.replace('.ts', '.js'));

    try {
      // Verificar que el archivo existe
      await fs.access(fullPath);

      console.log(`🔧 Executing ${hookName} hook for ${plugin.name}`);

      // Importar y ejecutar el hook
      const hookModule = await import(fullPath);
      const hookFunction = hookModule.default || hookModule[hookName];

      if (typeof hookFunction === 'function') {
        await hookFunction(context);
        console.log(`  ✓ ${hookName} hook executed successfully`);
      } else {
        console.warn(`  ⚠️  ${hookName} hook is not a function`);
      }
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.warn(`  ⚠️  Hook file not found: ${fullPath}`);
      } else {
        console.error(`  ✗ Failed to execute ${hookName} hook:`, error.message);
        throw error;
      }
    }
  }

  /**
   * Crea las tablas del plugin manualmente
   * Nota: Esta función está deshabilitada porque TypeORM no permite
   * crear tablas dinámicamente de esta manera. Las tablas se crean
   * mediante pluginDatabaseService.
   */
  async createPluginTables(plugin: InstalledPlugin, pluginDir: string): Promise<void> {
    if (!plugin.manifest?.backend?.models) {
      return;
    }

    console.log(`🗄️  Plugin ${plugin.name} has models defined in manifest`);
    console.log(`    Tables will be created by pluginDatabaseService`);
    
    // Las tablas se crean en pluginDatabaseService usando SQL directo
    // porque TypeORM no permite agregar entidades dinámicamente después
    // de inicializar la conexión
  }

  /**
   * Carga un plugin completamente
   */
  async loadPlugin(plugin: InstalledPlugin): Promise<void> {
    if (this.loadedPlugins.has(plugin.id)) {
      console.log(`Plugin ${plugin.name} already loaded`);
      return;
    }

    try {
      console.log(`\n🚀 Loading plugin: ${plugin.name}`);

      // 1. Descargar y extraer el plugin
      const pluginDir = await this.downloadAndExtractPlugin(plugin);

      // 2. Cargar entidades del backend si existen
      if (plugin.manifest?.backend?.models) {
        await this.loadPluginEntities(plugin, pluginDir);
      }

      // 3. Guardar referencia del plugin cargado
      this.loadedPlugins.set(plugin.id, {
        id: plugin.id,
        slug: plugin.slug,
        name: plugin.name,
        directory: pluginDir,
        loadedAt: new Date()
      });

      console.log(`✅ Plugin ${plugin.name} loaded successfully\n`);
    } catch (error: any) {
      console.error(`❌ Failed to load plugin ${plugin.name}:`, error.message);
      throw error;
    }
  }

  /**
   * Descarga un plugin
   */
  async unloadPlugin(plugin: InstalledPlugin): Promise<void> {
    if (!this.loadedPlugins.has(plugin.id)) {
      console.log(`Plugin ${plugin.name} is not loaded`);
      return;
    }

    console.log(`📤 Unloading plugin: ${plugin.name}`);

    const loadedPlugin = this.loadedPlugins.get(plugin.id);
    
    // Limpiar directorio del plugin
    try {
      await fs.rm(loadedPlugin.directory, { recursive: true, force: true });
    } catch (error: any) {
      console.warn(`⚠️  Failed to remove plugin directory: ${error.message}`);
    }

    this.loadedPlugins.delete(plugin.id);
    console.log(`✅ Plugin ${plugin.name} unloaded`);
  }

  /**
   * Obtiene el directorio de un plugin cargado
   */
  getPluginDirectory(pluginId: string): string | null {
    const plugin = this.loadedPlugins.get(pluginId);
    return plugin ? plugin.directory : null;
  }

  /**
   * Verifica si un plugin está cargado
   */
  isPluginLoaded(pluginId: string): boolean {
    return this.loadedPlugins.has(pluginId);
  }

  /**
   * Obtiene todos los plugins cargados
   */
  getLoadedPlugins(): Map<string, any> {
    return this.loadedPlugins;
  }
}

export const pluginLoaderService = new PluginLoaderService();

