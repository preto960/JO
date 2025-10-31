import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import archiver from 'archiver';
import crypto from 'crypto';
import { createReadStream, createWriteStream } from 'fs';
import { PluginBuildResult, LocalPlugin } from '../types/plugin';
import { blobService } from './blobService';
import * as esbuild from 'esbuild';
import { compileScript, compileTemplate, parse } from '@vue/compiler-sfc';

const execAsync = promisify(exec);

export class PluginBuildService {
  private buildDir: string;
  private distDir: string;

  constructor() {
    this.buildDir = path.join(process.cwd(), '.build');
    this.distDir = path.join(process.cwd(), 'dist-plugins');
  }

  /**
   * Inicializa los directorios de build
   */
  async initialize(): Promise<void> {
    await fs.mkdir(this.buildDir, { recursive: true });
    await fs.mkdir(this.distDir, { recursive: true });
  }

  /**
   * Construye y empaqueta un plugin
   */
  async buildPlugin(plugin: LocalPlugin, developerId: string): Promise<PluginBuildResult> {
    const errors: string[] = [];

    try {
      await this.initialize();

      console.log(`🔨 Building plugin: ${plugin.manifest.name}`);

      // 1. Validar plugin
      if (!plugin.isValid) {
        return {
          success: false,
          pluginSlug: plugin.manifest.slug,
          version: plugin.manifest.version,
          errors: plugin.errors
        };
      }

      // 2. Crear directorio temporal de build
      const buildPath = path.join(this.buildDir, plugin.manifest.slug);
      await this.cleanDirectory(buildPath);
      await fs.mkdir(buildPath, { recursive: true });

      // 3. Copiar archivos del plugin
      await this.copyPluginFiles(plugin.path, buildPath);

      // 4. Instalar dependencias si existen
      if (plugin.packageJson?.dependencies) {
        console.log('📦 Installing dependencies...');
        try {
          await execAsync('npm install --production', { cwd: buildPath });
        } catch (error: any) {
          errors.push(`Failed to install dependencies: ${error.message}`);
        }
      }

      // 5. Build Backend TypeScript (CommonJS)
      const hasBackendTsConfig = await this.fileExists(path.join(buildPath, 'tsconfig.backend.json'));
      
      if (hasBackendTsConfig) {
        console.log('🔧 Compiling TypeScript (Backend - CommonJS)...');
        try {
          await execAsync('npx tsc -p tsconfig.backend.json', { cwd: buildPath });
        } catch (error: any) {
          errors.push(`Backend TypeScript compilation failed: ${error.message}`);
          console.error('Backend TS compilation error:', error);
        }
      }
      
      // 5.5. Build Frontend con Vite (Vue + TypeScript)
      const hasFrontend = await this.fileExists(path.join(buildPath, 'frontend'));
      if (hasFrontend) {
        console.log('⚡ Building frontend with Vite...');
        try {
          await this.buildFrontendWithVite(buildPath, plugin.manifest.slug);
        } catch (error: any) {
          errors.push(`Frontend build failed: ${error.message}`);
          console.error('Vite build error:', error);
        }
      }

      // 6. Empaquetar a .zip
      const zipFileName = `${plugin.manifest.slug}-${plugin.manifest.version}.zip`;
      const zipPath = path.join(this.distDir, zipFileName);
      
      console.log('📦 Creating package...');
      await this.createZipArchive(buildPath, zipPath);

      // 7. Calcular checksum
      const checksum = await this.calculateChecksum(zipPath);

      // 8. Obtener tamaño
      const stats = await fs.stat(zipPath);
      const size = stats.size;

      // 9. Subir a Vercel Blob
      console.log('☁️  Uploading to Vercel Blob...');
      const blobUrl = await this.uploadToBlob(
        zipPath,
        plugin.manifest.slug,
        plugin.manifest.version,
        developerId
      );

      // 10. Limpiar archivos temporales
      await this.cleanDirectory(buildPath);

      console.log(`✅ Plugin built successfully: ${plugin.manifest.name}`);

      return {
        success: true,
        pluginSlug: plugin.manifest.slug,
        version: plugin.manifest.version,
        outputPath: buildPath,
        zipPath,
        blobUrl,
        size,
        checksum,
        errors: errors.length > 0 ? errors : undefined
      };
    } catch (error: any) {
      console.error('❌ Build failed:', error);
      return {
        success: false,
        pluginSlug: plugin.manifest.slug,
        version: plugin.manifest.version,
        errors: [...errors, error.message]
      };
    }
  }

  /**
   * Compila componentes Vue (.vue) a JavaScript (.js)
   */
  private async compileVueComponents(buildPath: string): Promise<void> {
    const frontendDir = path.join(buildPath, 'frontend');
    
    // Verificar si existe directorio frontend
    try {
      await fs.access(frontendDir);
    } catch {
      console.log('No frontend directory found, skipping Vue compilation');
      return;
    }

    // Buscar todos los archivos .vue recursivamente
    const vueFiles = await this.findVueFiles(frontendDir);
    
    if (vueFiles.length === 0) {
      console.log('No Vue components found');
      return;
    }

    console.log(`Found ${vueFiles.length} Vue component(s) to compile`);

    for (const vueFilePath of vueFiles) {
      try {
        await this.compileVueFile(vueFilePath);
      } catch (error: any) {
        console.error(`Failed to compile ${vueFilePath}:`, error.message);
        throw error;
      }
    }
  }

  /**
   * Busca archivos .vue recursivamente
   */
  private async findVueFiles(dir: string): Promise<string[]> {
    const files: string[] = [];
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        const subFiles = await this.findVueFiles(fullPath);
        files.push(...subFiles);
      } else if (entry.name.endsWith('.vue')) {
        files.push(fullPath);
      }
    }

    return files;
  }

  /**
   * Compila un archivo .vue individual a .js
   */
  /**
   * Arregla los imports en archivos JS compilados
   * - Cambia .vue a .js
   * - Elimina type imports
   */
  private async fixImportsInCompiledFiles(buildPath: string): Promise<void> {
    const jsFiles = await this.findJsFiles(buildPath);
    
    for (const jsFile of jsFiles) {
      let content = await fs.readFile(jsFile, 'utf-8');
      let modified = false;
      
      // Cambiar imports de .vue a .js
      const vueImportRegex = /from\s+['"](.+?)\.vue['"]/g;
      if (vueImportRegex.test(content)) {
        content = content.replace(vueImportRegex, "from '$1.js'");
        modified = true;
      }
      
      // Eliminar type imports
      const typeImportRegex = /import\s+type\s+\{[^}]+\}\s+from\s+['"][^'"]+['"]\s*;?\s*/g;
      if (typeImportRegex.test(content)) {
        content = content.replace(typeImportRegex, '');
        modified = true;
      }
      
      if (modified) {
        await fs.writeFile(jsFile, content, 'utf-8');
        console.log(`  ✓ Fixed imports in ${path.basename(jsFile)}`);
      }
    }
  }

  /**
   * Encuentra todos los archivos .js en un directorio
   */
  private async findJsFiles(dir: string): Promise<string[]> {
    const jsFiles: string[] = [];
    
    async function scan(currentDir: string) {
      const entries = await fs.readdir(currentDir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);
        
        if (entry.isDirectory() && entry.name !== 'node_modules') {
          await scan(fullPath);
        } else if (entry.isFile() && entry.name.endsWith('.js')) {
          jsFiles.push(fullPath);
        }
      }
    }
    
    await scan(dir);
    return jsFiles;
  }

  private async compileVueFile(vueFilePath: string): Promise<void> {
    const source = await fs.readFile(vueFilePath, 'utf-8');
    const filename = path.basename(vueFilePath);
    const componentName = filename.replace('.vue', '');
    
    console.log(`  Compiling ${filename}...`);

    // Parse del componente Vue
    const { descriptor, errors } = parse(source, { filename });
    
    if (errors.length > 0) {
      throw new Error(`Parse errors in ${filename}: ${errors.map(e => e.message).join(', ')}`);
    }

    let scriptContent = '';
    let setupCode = '';
    let templateFunction = '';
    let stylesCode = '';
    let imports = '';

    // Compilar script
    if (descriptor.scriptSetup) {
      // Script setup
      const compiled = compileScript(descriptor, {
        id: componentName,
        inlineTemplate: true
      });
      
      // Extraer imports y código
      const lines = compiled.content.split('\n');
      const importLines: string[] = [];
      const codeLines: string[] = [];
      
      for (const line of lines) {
        if (line.trim().startsWith('import ') && !line.includes('import type')) {
          // Reemplazar imports de Vue con referencias globales
          if (line.includes('from \'vue\'') || line.includes('from "vue"')) {
            // Extraer los nombres importados
            const match = line.match(/import\s+\{([^}]+)\}\s+from/);
            if (match) {
              const vueImports = match[1].split(',').map(s => s.trim());
              importLines.push(`const { ${vueImports.join(', ')} } = Vue;`);
            }
          } else {
            importLines.push(line);
          }
        } else if (!line.includes('export default') && line.trim()) {
          codeLines.push(line);
        }
      }
      
      imports = importLines.join('\n');
      setupCode = codeLines.join('\n');
      
      // Obtener la función render si está inline
      if (compiled.content.includes('return (')) {
        templateFunction = 'render: ' + compiled.content.substring(
          compiled.content.indexOf('return ('),
          compiled.content.lastIndexOf('}')
        );
      }
    } else if (descriptor.script) {
      // Script normal (Options API)
      scriptContent = descriptor.script.content;
      
      // Reemplazar imports de Vue
      scriptContent = scriptContent.replace(
        /import\s+\{([^}]+)\}\s+from\s+['"]vue['"]/g,
        'const { $1 } = Vue'
      );
    }

    // Compilar template si no está inline
    if (descriptor.template && !descriptor.scriptSetup?.attrs.inlineTemplate) {
      const template = compileTemplate({
        source: descriptor.template.content,
        filename,
        id: componentName,
        scoped: descriptor.styles.some(s => s.scoped),
        compilerOptions: {
          mode: 'module'
        }
      });
      
      if (template.errors.length > 0) {
        throw new Error(`Template errors in ${filename}: ${template.errors.join(', ')}`);
      }
      
      // Extraer solo la función render
      templateFunction = template.code
        .replace(/^import[^;]+;/gm, '')
        .replace(/^export /gm, '')
        .trim();
    }

    // Compilar styles (inline en el JS)
    if (descriptor.styles.length > 0) {
      const styles = descriptor.styles.map(s => s.content).join('\n');
      stylesCode = `
// Inject styles
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = \`${styles.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`;
  document.head.appendChild(style);
}
`;
    }

    // Generar código final usando Options API (más compatible)
    let finalCode = '';
    
    if (descriptor.scriptSetup) {
      // Convertir script setup a Options API
      finalCode = `
${imports}

${stylesCode}

export default {
  name: '${componentName}',
  setup() {
    ${setupCode}
    
    return {
      // Exportar todo lo necesario
    };
  }
};
`;
    } else {
      // Options API directo
      finalCode = `
${scriptContent.replace(/export default\s*{/, `${stylesCode}\n\nexport default {`)}
`;
    }

    // Escribir archivo .js
    const jsFilePath = vueFilePath.replace(/\.vue$/, '.js');
    await fs.writeFile(jsFilePath, finalCode, 'utf-8');
    
    console.log(`  ✓ Compiled to ${path.basename(jsFilePath)}`);
  }

  /**
   * Copia archivos del plugin al directorio de build
   */
  private async copyPluginFiles(source: string, dest: string): Promise<void> {
    const entries = await fs.readdir(source, { withFileTypes: true });

    for (const entry of entries) {
      const sourcePath = path.join(source, entry.name);
      const destPath = path.join(dest, entry.name);

      // Ignorar node_modules, .git, archivos de build
      if (
        entry.name === 'node_modules' ||
        entry.name === '.git' ||
        entry.name === 'dist' ||
        entry.name === '.build' ||
        entry.name.startsWith('.')
      ) {
        continue;
      }

      if (entry.isDirectory()) {
        await fs.mkdir(destPath, { recursive: true });
        await this.copyPluginFiles(sourcePath, destPath);
      } else {
        await fs.copyFile(sourcePath, destPath);
      }
    }
  }

  /**
   * Crea un archivo .zip del plugin
   */
  private async createZipArchive(sourceDir: string, outputPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const output = createWriteStream(outputPath);
      const archive = archiver('zip', { zlib: { level: 9 } });

      output.on('close', () => resolve());
      archive.on('error', (err) => reject(err));

      archive.pipe(output);
      
      // Agregar todos los archivos excepto node_modules
      archive.glob('**/*', {
        cwd: sourceDir,
        ignore: ['node_modules/**', '.git/**', '**/.DS_Store']
      });

      archive.finalize();
    });
  }

  /**
   * Calcula el checksum SHA256 de un archivo
   */
  private async calculateChecksum(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const hash = crypto.createHash('sha256');
      const stream = createReadStream(filePath);

      stream.on('data', (data) => hash.update(data));
      stream.on('end', () => resolve(hash.digest('hex')));
      stream.on('error', reject);
    });
  }

  /**
   * Sube el plugin a Vercel Blob
   */
  private async uploadToBlob(
    zipPath: string,
    pluginSlug: string,
    version: string,
    developerId: string
  ): Promise<string> {
    const buffer = await fs.readFile(zipPath);
    const fileName = `${pluginSlug}-${version}.zip`;
    
    // Usar carpeta específica por developer
    const blobPath = `plugins/${developerId}/${pluginSlug}/${version}/${fileName}`;
    
    const result = await blobService.uploadPluginPackage(buffer, blobPath);
    return result.url;
  }

  /**
   * Limpia un directorio
   */
  private async cleanDirectory(dir: string): Promise<void> {
    try {
      await fs.rm(dir, { recursive: true, force: true });
    } catch {
      // Directorio no existe, está bien
    }
  }

  /**
   * Verifica si un archivo existe
   */
  private async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Construye un plugin para sandbox (testing)
   */
  async buildForSandbox(plugin: LocalPlugin, developerId: string): Promise<PluginBuildResult> {
    const result = await this.buildPlugin(plugin, developerId);
    
    if (result.success && result.blobUrl) {
      // Subir también a carpeta sandbox
      const sandboxUrl = result.blobUrl.replace('/plugins/', '/sandbox/');
      // El blob ya está subido, solo cambiamos la referencia
      return {
        ...result,
        blobUrl: sandboxUrl
      };
    }
    
    return result;
  }

  /**
   * Compila el frontend del plugin usando Vite CLI
   */
  private async buildFrontendWithVite(pluginPath: string, pluginSlug: string): Promise<void> {
    console.log(`   Building frontend for ${pluginSlug}...`);
    
    const frontendPath = path.join(pluginPath, 'frontend');
    const distPath = path.join(pluginPath, 'dist-frontend');
    
    // Verificar que exista el directorio frontend
    try {
      await fs.access(frontendPath);
    } catch {
      console.log(`   ⚠️  No frontend directory found, skipping Vite build`);
      return;
    }
    
    // Crear configuración temporal de Vite
    const viteConfigContent = `
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: '${distPath.replace(/\\/g, '/')}',
    emptyOutDir: true,
    lib: {
      entry: path.resolve('${frontendPath.replace(/\\/g, '/')}', 'index.ts'),
      name: '${pluginSlug.replace(/-/g, '_')}',
      formats: ['iife'],
      fileName: () => 'index.js'
    },
    rollupOptions: {
      external: ['vue', 'pinia', 'vue-router', 'axios'],
      output: {
        globals: {
          vue: 'Vue',
          pinia: 'Pinia',
          'vue-router': 'VueRouter',
          axios: 'axios'
        },
        inlineDynamicImports: true
      }
    },
    minify: false,
    target: 'es2020'
  },
  resolve: {
    alias: {
      '@': '${frontendPath.replace(/\\/g, '/')}'
    }
  }
})
`;
    
    const viteConfigPath = path.join(pluginPath, 'vite.config.mjs');
    
    try {
      // Escribir configuración temporal como módulo ESM
      await fs.writeFile(viteConfigPath, viteConfigContent, 'utf-8');
      
      // Ejecutar Vite build
      await execAsync('npx vite build --config vite.config.mjs', { cwd: pluginPath });
      
      // Limpiar configuración temporal
      await fs.unlink(viteConfigPath);
      
      console.log(`   ✓ Frontend built successfully`);
    } catch (error: any) {
      console.error(`   ✗ Vite build failed:`, error.message);
      // Intentar limpiar el archivo de configuración
      try {
        await fs.unlink(viteConfigPath);
      } catch {}
      throw error;
    }
  }
}

export const pluginBuildService = new PluginBuildService();

