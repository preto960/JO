import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface PluginManifest {
  name: string;
  version: string;
  description: string;
  author: string;
  category: string;
  price: number;
  main: string;
  dependencies?: Record<string, string>;
  permissions?: string[];
  screenshots?: string[];
  tags?: string[];
}

export interface ProcessedPlugin {
  title: string;
  description: string;
  price: number;
  category: string;
  downloadUrl: string;
  status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED';
  metadata: Record<string, any>;
}

export class PluginProcessor {
  
  validateManifest(manifest: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!manifest.name || typeof manifest.name !== 'string') {
      errors.push('El nombre es requerido y debe ser un string');
    }

    if (!manifest.version || typeof manifest.version !== 'string') {
      errors.push('La versión es requerida y debe ser un string');
    }

    if (!manifest.description || typeof manifest.description !== 'string') {
      errors.push('La descripción es requerida y debe ser un string');
    }

    if (!manifest.author || typeof manifest.author !== 'string') {
      errors.push('El autor es requerido y debe ser un string');
    }

    if (!manifest.category || typeof manifest.category !== 'string') {
      errors.push('La categoría es requerida y debe ser un string');
    }

    if (typeof manifest.price !== 'number' || manifest.price < 0) {
      errors.push('El precio es requerido y debe ser un número mayor o igual a 0');
    }

    if (!manifest.main || typeof manifest.main !== 'string') {
      errors.push('El archivo principal es requerido y debe ser un string');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  async processPlugin(pluginPath: string, manifest: PluginManifest): Promise<ProcessedPlugin> {
    // Verificar que el archivo principal existe
    const mainFilePath = path.join(pluginPath, manifest.main);
    if (!fs.existsSync(mainFilePath)) {
      throw new Error(`Archivo principal no encontrado: ${manifest.main}`);
    }

    // Generar URL de descarga (simulada)
    const downloadUrl = `/api/plugins/download/${manifest.name}`;

    // Generar hash único para el plugin
    const pluginHash = this.generatePluginHash(pluginPath, manifest);

    // Procesar screenshots si existen
    const screenshots = this.processScreenshots(pluginPath, manifest.screenshots || []);

    // Validar dependencias
    const dependencyValidation = this.validateDependencies(pluginPath, manifest.dependencies || {});

    return {
      title: manifest.name,
      description: manifest.description,
      price: manifest.price,
      category: manifest.category,
      downloadUrl,
      status: 'PENDING', // Los plugins nuevos requieren aprobación manual
      metadata: {
        version: manifest.version,
        author: manifest.author,
        main: manifest.main,
        dependencies: manifest.dependencies || {},
        permissions: manifest.permissions || [],
        screenshots,
        tags: manifest.tags || [],
        hash: pluginHash,
        dependencyValidation,
        createdAt: new Date().toISOString(),
        pluginPath
      }
    };
  }

  private generatePluginHash(pluginPath: string, manifest: PluginManifest): string {
    const hashInput = `${manifest.name}-${manifest.version}-${pluginPath}`;
    return crypto.createHash('sha256').update(hashInput).digest('hex');
  }

  private processScreenshots(pluginPath: string, screenshots: string[]): string[] {
    const processedScreenshots: string[] = [];

    for (const screenshot of screenshots) {
      const screenshotPath = path.join(pluginPath, screenshot);
      if (fs.existsSync(screenshotPath)) {
        // Generar URL para la screenshot
        processedScreenshots.push(`/api/plugins/screenshots/${path.basename(screenshotPath)}`);
      }
    }

    return processedScreenshots;
  }

  private validateDependencies(pluginPath: string, dependencies: Record<string, string>): { valid: boolean; missing: string[] } {
    const missing: string[] = [];

    // Verificar package.json si existe
    const packageJsonPath = path.join(pluginPath, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      try {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
        const installedDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };

        for (const [dep, version] of Object.entries(dependencies)) {
          if (!installedDeps[dep]) {
            missing.push(dep);
          }
        }
      } catch (error) {
        console.warn('No se pudo leer package.json del plugin');
      }
    }

    return {
      valid: missing.length === 0,
      missing
    };
  }

  async createPluginTemplate(pluginName: string, outputPath: string): Promise<void> {
    const template: PluginManifest = {
      name: pluginName,
      version: "1.0.0",
      description: `Plugin ${pluginName} creado automáticamente`,
      author: "Developer",
      category: "utility",
      price: 0,
      main: "index.js",
      dependencies: {},
      permissions: [],
      screenshots: [],
      tags: []
    };

    const pluginDir = path.join(outputPath, pluginName);
    fs.mkdirSync(pluginDir, { recursive: true });

    // Crear manifest.json
    fs.writeFileSync(
      path.join(pluginDir, 'plugin.json'),
      JSON.stringify(template, null, 2)
    );

    // Crear archivo principal básico
    fs.writeFileSync(
      path.join(pluginDir, 'index.js'),
      `// Plugin ${pluginName}
console.log('Plugin ${pluginName} cargado');

module.exports = {
  init: function() {
    console.log('Plugin ${pluginName} inicializado');
  },
  
  destroy: function() {
    console.log('Plugin ${pluginName} destruido');
  }
};
`
    );

    // Crear README básico
    fs.writeFileSync(
      path.join(pluginDir, 'README.md'),
      `# ${pluginName}

## Descripción
${template.description}

## Instalación
1. Coloca esta carpeta en el directorio de plugins
2. El sistema detectará automáticamente el plugin

## Uso
El plugin se inicializará automáticamente al ser detectado.
`
    );
  }
}