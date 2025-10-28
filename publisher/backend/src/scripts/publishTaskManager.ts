import { AppDataSource } from '../config/database';
import { PublishedPlugin, PluginStatus } from '../models/PublishedPlugin';
import { Developer } from '../models/Developer';
import fs from 'fs/promises';
import path from 'path';

/**
 * Script para publicar el plugin Task Manager en la base de datos
 */
async function publishTaskManager() {
  try {
    await AppDataSource.initialize();
    console.log('✅ Database connected');

    const pluginRepo = AppDataSource.getRepository(PublishedPlugin);
    const developerRepo = AppDataSource.getRepository(Developer);

    // Buscar o crear un developer de sistema
    let developer = await developerRepo.findOne({
      where: { email: 'system@njo.com' }
    });

    if (!developer) {
      developer = developerRepo.create({
        email: 'system@njo.com',
        password: 'system', // En producción, usar hash
        firstName: 'System',
        lastName: 'Developer',
        company: 'NJO Team',
        role: 'DEVELOPER'
      });
      await developerRepo.save(developer);
      console.log('✅ System developer created');
    }

    // Leer el manifest del plugin
    const manifestPath = path.join(process.cwd(), 'plugins', 'task-manager', 'manifest.json');
    const manifestContent = await fs.readFile(manifestPath, 'utf-8');
    const manifest = JSON.parse(manifestContent);

    // Verificar si el plugin ya existe
    let plugin = await pluginRepo.findOne({
      where: { slug: manifest.slug }
    });

    const pluginData = {
      name: manifest.name,
      slug: manifest.slug,
      version: manifest.version,
      description: manifest.description,
      longDescription: manifest.longDescription,
      category: manifest.category,
      manifest: manifest,
      tags: manifest.tags || [],
      icon: manifest.icon,
      screenshots: manifest.screenshots || [],
      license: manifest.license || 'MIT',
      homepage: manifest.homepage,
      repository: manifest.repository,
      price: 0, // Free plugin
      status: PluginStatus.PUBLISHED,
      isPublic: true,
      developer: developer
    };

    if (plugin) {
      // Actualizar plugin existente
      Object.assign(plugin, pluginData);
      await pluginRepo.save(plugin);
      console.log('✅ Plugin updated:', plugin.name);
    } else {
      // Crear nuevo plugin
      plugin = pluginRepo.create(pluginData);
      await pluginRepo.save(plugin);
      console.log('✅ Plugin created:', plugin.name);
    }

    console.log('\n📦 Plugin Details:');
    console.log('  ID:', plugin.id);
    console.log('  Name:', plugin.name);
    console.log('  Slug:', plugin.slug);
    console.log('  Version:', plugin.version);
    console.log('  Status:', plugin.status);
    console.log('  Package URL:', plugin.packageUrl || 'Not uploaded yet');

    await AppDataSource.destroy();
    console.log('\n✅ Script completed successfully');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

publishTaskManager();

