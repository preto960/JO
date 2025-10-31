import fs from 'fs/promises';
import path from 'path';
import { PluginManifest, LocalPlugin, PluginValidationResult } from '../types/plugin';

export class PluginFileService {
  private pluginsDir: string;

  constructor() {
    // Directorio donde los developers colocan sus plugins
    this.pluginsDir = path.join(process.cwd(), 'plugins');
  }

  /**
   * Inicializa el directorio de plugins
   */
  async initialize(): Promise<void> {
    try {
      await fs.access(this.pluginsDir);
    } catch {
      await fs.mkdir(this.pluginsDir, { recursive: true });
      console.log(`📁 Created plugins directory: ${this.pluginsDir}`);
    }
  }

  /**
   * Detecta todos los plugins en el directorio
   */
  async detectPlugins(): Promise<LocalPlugin[]> {
    await this.initialize();
    
    const plugins: LocalPlugin[] = [];
    
    try {
      const entries = await fs.readdir(this.pluginsDir, { withFileTypes: true });
      
      for (const entry of entries) {
        if (entry.isDirectory()) {
          const pluginPath = path.join(this.pluginsDir, entry.name);
          const plugin = await this.loadPlugin(pluginPath);
          
          if (plugin) {
            plugins.push(plugin);
          }
        }
      }
    } catch (error) {
      console.error('Error detecting plugins:', error);
    }
    
    return plugins;
  }

  /**
   * Carga un plugin desde un directorio
   */
  async loadPlugin(pluginPath: string): Promise<LocalPlugin | null> {
    const errors: string[] = [];
    
    try {
      // Leer manifest.json
      const manifestPath = path.join(pluginPath, 'manifest.json');
      let manifest: PluginManifest;
      
      try {
        const manifestContent = await fs.readFile(manifestPath, 'utf-8');
        manifest = JSON.parse(manifestContent);
      } catch (error) {
        errors.push('manifest.json not found or invalid');
        return {
          path: pluginPath,
          manifest: {} as PluginManifest,
          isValid: false,
          errors
        };
      }

      // Leer package.json (opcional)
      let packageJson: any = null;
      try {
        const packagePath = path.join(pluginPath, 'package.json');
        const packageContent = await fs.readFile(packagePath, 'utf-8');
        packageJson = JSON.parse(packageContent);
        
        // Si no hay versión en manifest, usar la de package.json
        if (!manifest.version && packageJson.version) {
          manifest.version = packageJson.version;
        }
      } catch {
        // package.json es opcional
      }

      // Validar manifest
      const validation = this.validateManifest(manifest);
      errors.push(...validation.errors);

      // Obtener tamaño y archivos
      const { size, files } = await this.getPluginInfo(pluginPath);

      return {
        path: pluginPath,
        manifest,
        packageJson,
        isValid: validation.isValid,
        errors,
        size,
        files
      };
    } catch (error: any) {
      errors.push(`Failed to load plugin: ${error.message}`);
      return {
        path: pluginPath,
        manifest: {} as PluginManifest,
        isValid: false,
        errors
      };
    }
  }

  /**
   * Valida el manifest de un plugin
   */
  validateManifest(manifest: PluginManifest): PluginValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Campos requeridos
    if (!manifest.name) errors.push('name is required');
    if (!manifest.version) errors.push('version is required');
    if (!manifest.slug) errors.push('slug is required');
    if (!manifest.description) errors.push('description is required');
    if (!manifest.author) errors.push('author is required');
    if (!manifest.category) errors.push('category is required');

    // Validar formato de versión (semantic versioning)
    if (manifest.version && !/^\d+\.\d+\.\d+/.test(manifest.version)) {
      errors.push('version must follow semantic versioning (e.g., 1.0.0)');
    }

    // Validar slug (solo letras minúsculas, números y guiones)
    if (manifest.slug && !/^[a-z0-9-]+$/.test(manifest.slug)) {
      errors.push('slug must contain only lowercase letters, numbers, and hyphens');
    }

    // Validar que tenga al menos frontend o backend
    if (!manifest.frontend && !manifest.backend) {
      errors.push('plugin must have at least frontend or backend configuration');
    }

    // Advertencias
    if (!manifest.longDescription) {
      warnings.push('longDescription is recommended for better user experience');
    }

    if (!manifest.icon) {
      warnings.push('icon is recommended for better visibility');
    }

    if (!manifest.tags || manifest.tags.length === 0) {
      warnings.push('tags are recommended for better discoverability');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Obtiene información del plugin (tamaño, archivos)
   */
  async getPluginInfo(pluginPath: string): Promise<{ size: number; files: string[] }> {
    let totalSize = 0;
    const files: string[] = [];

    async function walkDir(dir: string, baseDir: string = dir) {
      const entries = await fs.readdir(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relativePath = path.relative(baseDir, fullPath);

        // Ignorar node_modules, .git, etc.
        if (entry.name === 'node_modules' || entry.name === '.git' || entry.name.startsWith('.')) {
          continue;
        }

        if (entry.isDirectory()) {
          await walkDir(fullPath, baseDir);
        } else {
          const stats = await fs.stat(fullPath);
          totalSize += stats.size;
          files.push(relativePath);
        }
      }
    }

    await walkDir(pluginPath);

    return { size: totalSize, files };
  }

  /**
   * Lee el contenido de un archivo del plugin
   */
  async readPluginFile(pluginPath: string, filePath: string): Promise<string> {
    const fullPath = path.join(pluginPath, filePath);
    return await fs.readFile(fullPath, 'utf-8');
  }

  /**
   * Obtiene el directorio de plugins
   */
  getPluginsDirectory(): string {
    return this.pluginsDir;
  }
}

export const pluginFileService = new PluginFileService();



