import { AppDataSource } from '../config/database';
import { PublishedPlugin } from '../models/PublishedPlugin';

/**
 * Script para verificar el estado de los plugins publicados
 */
async function checkPlugins() {
  try {
    await AppDataSource.initialize();
    console.log('✅ Database connected\n');

    const pluginRepo = AppDataSource.getRepository(PublishedPlugin);

    const plugins = await pluginRepo.find({
      relations: ['developer'],
      order: { createdAt: 'DESC' }
    });

    console.log(`📦 Total plugins: ${plugins.length}\n`);

    plugins.forEach((plugin, index) => {
      console.log(`${index + 1}. ${plugin.name}`);
      console.log(`   ID: ${plugin.id}`);
      console.log(`   Slug: ${plugin.slug}`);
      console.log(`   Version: ${plugin.version}`);
      console.log(`   Status: ${plugin.status}`);
      console.log(`   Public: ${plugin.isPublic}`);
      console.log(`   Package URL: ${plugin.packageUrl || 'Not uploaded'}`);
      console.log(`   Downloads: ${plugin.downloadCount}`);
      console.log(`   Developer: ${plugin.developer?.email || 'N/A'}`);
      console.log('');
    });

    await AppDataSource.destroy();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkPlugins();

