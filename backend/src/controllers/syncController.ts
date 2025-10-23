import { Request, Response } from 'express';
import { AppDataSource } from '@/config/database';
import { Plugin, User, PluginStatus, UserRole } from '@/entities';

export const syncPluginsManually = async (req: Request, res: Response) => {
  try {
    const pluginRepository = AppDataSource.getRepository(Plugin);
    const userRepository = AppDataSource.getRepository(User);

    // Datos del plugin desde la imagen (hardcodeado temporalmente)
    const examplePlugin = {
      name: 'example-plugin',
      version: '1.0.0',
      description: 'Este es un plugin de ejemplo que demuestra las capacidades del sistema.',
      author: 'Juan Orellana',
      category: 'productivity',
      status: 'approved'
    };

    // Obtener o crear usuario admin
    let adminUser = await userRepository.findOne({ 
      where: { email: 'admin@example.com' } 
    });
    
    if (!adminUser) {
      adminUser = userRepository.create({
        username: 'admin',
        email: 'admin@example.com',
        password: 'admin123',
        role: UserRole.ADMIN
      });
      adminUser = await userRepository.save(adminUser);
    }

    // Verificar si el plugin ya existe
    const existingPlugin = await pluginRepository.findOne({
      where: { title: examplePlugin.name }
    });

    if (existingPlugin) {
      return res.json({ 
        message: 'Plugin already exists',
        plugin: existingPlugin 
      });
    }

    // Crear el plugin
    const newPlugin = pluginRepository.create({
      title: examplePlugin.name,
      description: examplePlugin.description,
      version: examplePlugin.version,
      price: 0,
      category: examplePlugin.category,
      tags: ['example', 'demo'],
      downloadUrl: '',
      demoUrl: '',
      githubUrl: '',
      documentationUrl: '',
      authorId: adminUser.id,
      status: PluginStatus.APPROVED,
      isActive: true
    });

    const savedPlugin = await pluginRepository.save(newPlugin);

    res.json({ 
      message: 'Plugin created successfully',
      plugin: savedPlugin 
    });
  } catch (error) {
    console.error('Error creating plugin:', error);
    res.status(500).json({ error: 'Failed to create plugin' });
  }
};