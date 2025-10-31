import fs from 'fs/promises';
import path from 'path';
import { InstalledPlugin } from '../models/InstalledPlugin';
import { pluginLoaderService } from './pluginLoaderService';

/**
 * Servicio para crear bundles de plugins que pueden ser cargados en el frontend
 */
export class PluginBundleService {
  /**
   * Genera un bundle JavaScript para un plugin que puede ser cargado en el frontend
   */
  async generatePluginBundle(plugin: InstalledPlugin): Promise<string> {
    console.log(`🔧 Generating bundle for plugin: ${plugin.slug}`);
    
    const pluginDir = pluginLoaderService.getPluginDirectory(plugin.id);
    
    if (!pluginDir) {
      console.error(`❌ Plugin ${plugin.slug} not loaded - no directory found`);
      throw new Error('Plugin not loaded');
    }

    console.log(`   Plugin directory: ${pluginDir}`);

    // Para Task Manager, crear un bundle simple que exporte el manifest y las rutas
    if (plugin.slug === 'task-manager') {
      return this.generateTaskManagerBundle(plugin, pluginDir);
    }

    // Para otros plugins, generar bundle genérico
    return this.generateGenericBundle(plugin, pluginDir);
  }

  /**
   * Genera el bundle para Task Manager usando el bundle pre-compilado por Vite
   */
  private async generateTaskManagerBundle(plugin: InstalledPlugin, pluginDir: string): Promise<string> {
    const manifest = plugin.manifest;

    // Verificar si existe el bundle compilado por Vite
    const viteBundlePath = path.join(pluginDir, 'dist-frontend', 'index.js');
    
    try {
      await fs.access(viteBundlePath);
      console.log(`   ✓ Using pre-compiled Vite bundle`);
      
      // Leer el bundle compilado
      let viteBundle = await fs.readFile(viteBundlePath, 'utf-8');
      
      // El bundle de Vite es IIFE que asigna a var task_manager
      // Necesitamos ejecutarlo y re-exportar como ES Module
      const bundle = `
// Task Manager Plugin Bundle v${plugin.version}
// Compiled with Vite (IIFE format)
// Plugin ID: ${plugin.id}

// Metadata del plugin
window.__PLUGIN_METADATA__ = window.__PLUGIN_METADATA__ || {};
window.__PLUGIN_METADATA__['${plugin.slug}'] = {
  id: '${plugin.id}',
  slug: '${plugin.slug}',
  name: '${plugin.name}',
  version: '${plugin.version}',
  description: '${plugin.description || ''}',
  manifest: ${JSON.stringify(manifest, null, 2)}
};

// ============================================
// BUNDLE COMPILADO POR VITE (IIFE)
// ============================================

${viteBundle}

// ============================================
// EXPORTS COMO ES MODULES
// ============================================

// El IIFE asigna las exportaciones a task_manager
// Re-exportar como ES Modules
export const pluginInfo = task_manager.pluginInfo || {};
export const routes = task_manager.routes || [];
export const useTaskStore = task_manager.useTaskStore;
export const TaskList = task_manager.TaskList;
export const TaskBoard = task_manager.TaskBoard;
export const TaskCalendar = task_manager.TaskCalendar;
export const TaskCard = task_manager.TaskCard;
export const TaskForm = task_manager.TaskForm;
export const TaskFilters = task_manager.TaskFilters;

// Función de inicialización
export async function initialize() {
  console.log('📋 Task Manager Plugin v${plugin.version} initialized');
  return true;
}

// Función de limpieza
export async function destroy() {
  console.log('📋 Task Manager Plugin destroyed');
  return true;
}
`;

      console.log(`   Bundle generated for ${plugin.name} (Vite)`);
      return bundle;
      
    } catch (error) {
      // Si no existe el bundle de Vite, usar placeholders
      console.warn(`   ⚠️  Vite bundle not found, using placeholders`);
      return this.generatePlaceholderBundle(plugin, pluginDir, manifest);
    }
  }

  /**
   * Genera un bundle con placeholders (fallback)
   */
  private async generatePlaceholderBundle(plugin: InstalledPlugin, pluginDir: string, manifest: any): Promise<string> {
    const componentsCode = await this.loadVueComponentsAsText(plugin, pluginDir, manifest);
    const storeCode = await this.loadPluginStoreAsText(pluginDir, manifest);

    const bundle = `
// Task Manager Plugin Bundle
// Placeholder mode

export const pluginInfo = {
  id: '${plugin.id}',
  slug: '${plugin.slug}',
  name: '${plugin.name}',
  version: '${plugin.version}',
  description: '${plugin.description || ''}',
  manifest: ${JSON.stringify(manifest, null, 2)}
};

export const routes = ${JSON.stringify(manifest.frontend?.routes || [], null, 2)};

${componentsCode}

${storeCode}

export async function initialize() {
  console.log('📋 Task Manager Plugin initialized (placeholder mode)');
  return true;
}

export async function destroy() {
  console.log('📋 Task Manager Plugin destroyed');
  return true;
}

export default {
  pluginInfo,
  routes,
  components,
  store: useTaskStore,
  initialize,
  destroy
};
`;

    return bundle;
  }

  /**
   * Genera un bundle genérico para cualquier plugin
   */
  private async generateGenericBundle(plugin: InstalledPlugin, pluginDir: string): Promise<string> {
    const manifest = plugin.manifest;

    const bundle = `
// ${plugin.name} Plugin Bundle
// Auto-generated by PluginBundleService

export const pluginInfo = {
  id: '${plugin.id}',
  slug: '${plugin.slug}',
  name: '${plugin.name}',
  version: '${plugin.version}',
  description: '${plugin.description || ''}',
  manifest: ${JSON.stringify(manifest, null, 2)}
};

export const routes = ${JSON.stringify(manifest.frontend?.routes || [], null, 2)};

export const components = {};

export async function initialize() {
  console.log('📦 ${plugin.name} Plugin initialized');
  return true;
}

export async function destroy() {
  console.log('📦 ${plugin.name} Plugin destroyed');
  return true;
}

export default {
  pluginInfo,
  routes,
  components,
  initialize,
  destroy
};
`;

    return bundle;
  }

  /**
   * Carga y concatena todos los componentes del plugin
   */
  private async loadPluginComponents(pluginDir: string, manifest: any): Promise<{ code: string, names: string[] }> {
    console.log(`   Loading components from: ${pluginDir}`);
    const componentsExports: string[] = [];
    const componentNames: string[] = [];
    
    // Cargar views - usar placeholders por ahora
    if (manifest.frontend?.routes) {
      console.log(`   Found ${manifest.frontend.routes.length} routes in manifest`);
      for (const route of manifest.frontend.routes) {
        const componentPath = route.component;
        if (componentPath) {
          const componentName = path.basename(componentPath, '.vue');
          componentsExports.push(`export const ${componentName} = createPlaceholderComponentAlt('${componentName}');`);
          componentNames.push(componentName);
          console.log(`   ✓ Created placeholder for: ${componentName}`);
        }
      }
    }

    // Cargar components adicionales - usar placeholders
    if (manifest.frontend?.components) {
      for (const [name, componentPath] of Object.entries(manifest.frontend.components)) {
        componentsExports.push(`export const ${name} = createPlaceholderComponentAlt('${name}');`);
        componentNames.push(name);
        console.log(`   ✓ Created placeholder for: ${name}`);
      }
    }

    console.log(`   Total components exported: ${componentNames.length}`);
    return {
      code: componentsExports.join('\n'),
      names: componentNames
    };
  }

  /**
   * Extrae los nombres de componentes del código generado
   */
  private extractComponentNames(code: string): string[] {
    const names: string[] = [];
    const exportRegex = /export const (\w+) =/g;
    let match;
    while ((match = exportRegex.exec(code)) !== null) {
      names.push(match[1]);
    }
    return names;
  }

  /**
   * Carga el store del plugin
   */
  private async loadPluginStore(pluginDir: string, manifest: any): Promise<string> {
    // Por ahora, deshabilitar stores hasta que tengamos un sistema de build completo
    // Los stores requieren pinia que no está disponible en el bundle
    return '// Store disabled - requires proper build system\nexport const useTaskStore = null;';
  }

  /**
   * Carga componentes Vue compilados (.js) y genera código para importarlos dinámicamente
   * Por ahora, usa placeholders hasta que tengamos un sistema de build completo
   */
  private async loadVueComponentsAsText(plugin: InstalledPlugin, pluginDir: string, manifest: any): Promise<string> {
    console.log(`   Loading Vue components (placeholder mode)`);
    const componentExports: string[] = [];
    const componentsList: string[] = [];
    
    // Función helper para crear placeholders
    const placeholderFunction = `
// Función para crear componentes placeholder
function createPluginPlaceholder(componentName, pluginName) {
  return {
    name: componentName,
    data() {
      return {
        componentName,
        pluginName
      }
    },
    template: \`
      <div class="flex items-center justify-center min-h-[400px] bg-gray-800/50 rounded-lg border border-gray-700">
        <div class="text-center p-8 max-w-2xl">
          <div class="text-6xl mb-4">🚧</div>
          <h2 class="text-2xl font-bold text-white mb-4">Plugin Component</h2>
          <p class="text-gray-400 mb-6">
            Dynamic Vue component loading is currently in development.
            This is a placeholder for the actual component.
          </p>
          <div class="bg-gray-700/50 p-4 rounded text-left space-y-2">
            <p class="text-sm text-gray-300"><span class="font-semibold">Component:</span> {{ componentName }}</p>
            <p class="text-sm text-gray-300"><span class="font-semibold">Plugin:</span> {{ pluginName }}</p>
          </div>
          <p class="text-gray-500 text-sm mt-6">
            The plugin is installed and active. Full UI support coming soon.
          </p>
        </div>
      </div>
    \`
  };
}
`;
    
    componentExports.push(placeholderFunction);
    
    // Cargar views desde las rutas
    if (manifest.frontend?.routes) {
      console.log(`   Found ${manifest.frontend.routes.length} routes in manifest`);
      for (const route of manifest.frontend.routes) {
        const componentPath = route.component;
        if (componentPath) {
          const componentName = path.basename(componentPath, '.vue');
          
          componentExports.push(`
// ${componentName} Component (Placeholder)
export const ${componentName} = createPluginPlaceholder('${componentName}', '${plugin.name}');
`);
          componentsList.push(componentName);
          console.log(`   ✓ Created placeholder: ${componentName}`);
        }
      }
    }
    
    // Cargar componentes adicionales
    if (manifest.frontend?.components) {
      for (const [name, componentPath] of Object.entries(manifest.frontend.components)) {
        componentExports.push(`
// ${name} Component (Placeholder)
export const ${name} = createPluginPlaceholder('${name}', '${plugin.name}');
`);
        componentsList.push(name);
        console.log(`   ✓ Created placeholder: ${name}`);
      }
    }
    
    // Generar objeto de componentes
    const componentsObject = componentsList.length > 0 
      ? `export const components = { ${componentsList.join(', ')} };`
      : 'export const components = {};';
    
    console.log(`   Total components: ${componentsList.length}`);
    return componentExports.join('\n') + '\n\n' + componentsObject;
  }

  /**
   * Carga el store del plugin como texto
   */
  private async loadPluginStoreAsText(pluginDir: string, manifest: any): Promise<string> {
    // Por ahora, deshabilitar stores completamente hasta que tengamos un sistema de build robusto
    // Los stores de Pinia requieren un manejo especial de dependencias y estado
    console.log(`   ⚠️  Store disabled (requires proper build system)`);
    return '// Store disabled - requires proper build system\nexport const useTaskStore = null;';
  }

  /**
   * Obtiene la URL del bundle de un plugin
   */
  getPluginBundleUrl(pluginSlug: string): string {
    return `/api/plugin-bundles/${pluginSlug}/bundle.js`;
  }
}

export const pluginBundleService = new PluginBundleService();

