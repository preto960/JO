import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import archiver from 'archiver';
import crypto from 'crypto';
import { createReadStream, createWriteStream } from 'fs';
import { PluginBuildResult, LocalPlugin } from '../types/plugin';
import { blobService } from './blobService';

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

      // 5. Build TypeScript si existe tsconfig.json
      const hasTsConfig = await this.fileExists(path.join(buildPath, 'tsconfig.json'));
      if (hasTsConfig) {
        console.log('🔧 Compiling TypeScript...');
        try {
          await execAsync('npx tsc', { cwd: buildPath });
        } catch (error: any) {
          errors.push(`TypeScript compilation failed: ${error.message}`);
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
}

export const pluginBuildService = new PluginBuildService();

