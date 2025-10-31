import { pluginFileService } from '../src/services/pluginFileService';
import { pluginBuildService } from '../src/services/pluginBuildService';

const pluginSlug = process.argv[2] || 'task-manager';

async function buildPlugin() {
  try {
    console.log(`🔨 Building plugin: ${pluginSlug}`);
    
    // Detectar plugins
    const plugins = await pluginFileService.detectPlugins();
    const plugin = plugins.find(p => p.manifest.slug === pluginSlug);
    
    if (!plugin) {
      console.error(`❌ Plugin "${pluginSlug}" not found`);
      process.exit(1);
    }
    
    if (!plugin.isValid) {
      console.error(`❌ Plugin is not valid:`);
      plugin.errors.forEach(err => console.error(`   - ${err}`));
      process.exit(1);
    }
    
    // Build del plugin
    const result = await pluginBuildService.buildPlugin(plugin, 'local-dev');
    
    if (!result.success) {
      console.error(`❌ Build failed:`);
      result.errors?.forEach(err => console.error(`   - ${err}`));
      process.exit(1);
    }
    
    console.log(`✅ Plugin built successfully!`);
    if (result.zipPath) {
      console.log(`   Package: ${result.zipPath}`);
    }
    if (result.size) {
      console.log(`   Size: ${(result.size / 1024 / 1024).toFixed(2)} MB`);
    }
    if (result.blobUrl) {
      console.log(`   Blob URL: ${result.blobUrl}`);
    }
    
  } catch (error: any) {
    console.error(`❌ Error building plugin:`, error.message);
    process.exit(1);
  }
}

buildPlugin();

