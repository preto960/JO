import { Request, Response } from 'express';
import { AppDataSource } from '@/config/database';
import { Plugin, PluginStatus, User, UserRole } from '@/entities';
import { asyncHandler } from '@/middleware/errorHandler';
import { pluginValidation, validateRequest } from '@/middleware/validation';
import { AuthenticatedRequest } from '@/middleware/auth';

// Simple test endpoint
export const getPlugins = async (req: Request, res: Response) => {
  try {
    console.log('🔍 Starting getPlugins...');
    
    if (!AppDataSource.isInitialized) {
      console.log('❌ Database not initialized');
      return res.status(500).json({ error: 'Database not initialized' });
    }
    
    const pluginRepository = AppDataSource.getRepository(Plugin);
    console.log('✅ Plugin repository obtained');
    
    const plugins = await pluginRepository.find({
      where: { 
        status: PluginStatus.APPROVED,
        isActive: true 
      },
      take: 10
    });
    
    console.log('🔍 Plugins found:', plugins.length);
    
    const pluginsWithRatings = plugins.map((plugin) => {
      console.log('Processing plugin:', { id: plugin.id, title: plugin.title, authorId: plugin.authorId });
      
      return {
        id: plugin.id,
        title: plugin.title,
        description: plugin.description,
        price: plugin.price,
        category: plugin.category,
        status: plugin.status,
        avgRating: 4.5,
        author: {
          id: plugin.authorId || 'unknown',
          username: 'Admin'
        },
        _count: {
          reviews: 0,
          purchases: plugin.downloadCount || 0
        }
      };
    });

    console.log('✅ Plugins processed successfully');

    res.json({
      plugins: pluginsWithRatings,
      pagination: {
        page: 1,
        limit: 10,
        total: plugins.length,
        pages: 1
      }
    });
  } catch (error: any) {
    console.error('❌ Error in getPlugins:', error);
    console.error('Stack:', error.stack);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
};

export const getPluginsByStatus = asyncHandler(async (req: Request, res: Response) => {
  const pluginRepository = AppDataSource.getRepository(Plugin);
  
  const { status } = req.params;
  const {
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = 'DESC'
  } = req.query;

  // Validate status
  if (!Object.values(PluginStatus).includes(status as PluginStatus)) {
    return res.status(400).json({ error: 'Invalid plugin status' });
  }

  const skip = (Number(page) - 1) * Number(limit);

  // Build query
  const queryBuilder = pluginRepository
    .createQueryBuilder('plugin')
    .leftJoinAndSelect('plugin.author', 'author')
    .where('plugin.status = :status', { status })
    .andWhere('plugin.isActive = :isActive', { isActive: true });

  // Add sorting
  const validSortFields = ['title', 'price', 'createdAt', 'updatedAt', 'downloadCount', 'viewCount'];
  const sortField = validSortFields.includes(sortBy as string) ? sortBy as string : 'createdAt';
  queryBuilder.orderBy(`plugin.${sortField}`, sortOrder as 'ASC' | 'DESC');

  // Get total count
  const total = await queryBuilder.getCount();

  // Get paginated results
  const plugins = await queryBuilder
    .skip(skip)
    .take(Number(limit))
    .getMany();

  // Add placeholder ratings
  const pluginsWithRatings = plugins.map(plugin => ({
    ...plugin,
    avgRating: 4.5, // Placeholder
    purchaseCount: plugin.downloadCount
  }));

  res.json({
    plugins: pluginsWithRatings,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit))
    }
  });
});

export const getPluginById = asyncHandler(async (req: Request, res: Response) => {
  const pluginRepository = AppDataSource.getRepository(Plugin);

  const { id } = req.params;

  const plugin = await pluginRepository
    .createQueryBuilder('plugin')
    .leftJoinAndSelect('plugin.author', 'author')
    .where('plugin.id = :id', { id })
    .andWhere('plugin.isActive = :isActive', { isActive: true })
    .getOne();

  if (!plugin) {
    return res.status(404).json({ error: 'Plugin not found' });
  }

  // Increment view count
  await pluginRepository.increment({ id: plugin.id }, 'viewCount', 1);

  res.json({
    plugin: {
      ...plugin,
      avgRating: 4.5, // Placeholder
      purchaseCount: plugin.downloadCount,
      author: {
        id: plugin.author.id,
        username: plugin.author.username
      }
    }
  });
});

export const createPlugin = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const pluginRepository = AppDataSource.getRepository(Plugin);
  
  const {
    title,
    description,
    price,
    category,
    tags,
    downloadUrl,
    demoUrl,
    githubUrl,
    documentationUrl
  } = req.body;

  const plugin = pluginRepository.create({
    title,
    description,
    price,
    category,
    tags,
    downloadUrl,
    demoUrl,
    githubUrl,
    documentationUrl,
    authorId: req.user!.id,
    status: PluginStatus.PENDING
  });

  await pluginRepository.save(plugin);

  // Load the plugin with author info
  const savedPlugin = await pluginRepository
    .createQueryBuilder('plugin')
    .leftJoinAndSelect('plugin.author', 'author')
    .where('plugin.id = :id', { id: plugin.id })
    .getOne();

  res.status(201).json({
    message: 'Plugin submitted for review',
    plugin: savedPlugin
  });
});

export const updatePlugin = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const pluginRepository = AppDataSource.getRepository(Plugin);
  
  const { id } = req.params;
  const userId = req.user!.id;

  const plugin = await pluginRepository.findOne({
    where: { id, authorId: userId }
  });

  if (!plugin) {
    return res.status(404).json({ error: 'Plugin not found or access denied' });
  }

  const {
    title,
    description,
    price,
    category,
    tags,
    downloadUrl,
    demoUrl,
    githubUrl,
    documentationUrl
  } = req.body;

  // Update plugin
  await pluginRepository.update(id, {
    title,
    description,
    price,
    category,
    tags,
    downloadUrl,
    demoUrl,
    githubUrl,
    documentationUrl,
    status: PluginStatus.PENDING // Reset to pending when updated
  });

  // Get updated plugin
  const updatedPlugin = await pluginRepository
    .createQueryBuilder('plugin')
    .leftJoinAndSelect('plugin.author', 'author')
    .where('plugin.id = :id', { id })
    .getOne();

  res.json({
    message: 'Plugin updated successfully',
    plugin: updatedPlugin
  });
});

export const updatePluginStatus = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const pluginRepository = AppDataSource.getRepository(Plugin);
  
  const { id } = req.params;
  const { status } = req.body;
  const userId = req.user!.id;

  // Validate status
  if (!Object.values(PluginStatus).includes(status)) {
    return res.status(400).json({ error: 'Invalid plugin status' });
  }

  const plugin = await pluginRepository.findOne({
    where: { id }
  });

  if (!plugin) {
    return res.status(404).json({ error: 'Plugin not found' });
  }

  // Update plugin status
  await pluginRepository.update(id, { 
    status,
    ...(status === PluginStatus.APPROVED && { approvedAt: new Date() })
  });

  // Get updated plugin with author
  const updatedPlugin = await pluginRepository
    .createQueryBuilder('plugin')
    .leftJoinAndSelect('plugin.author', 'author')
    .where('plugin.id = :id', { id })
    .getOne();

  res.json({
    message: 'Plugin status updated successfully',
    plugin: updatedPlugin
  });
});

export const deletePlugin = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const pluginRepository = AppDataSource.getRepository(Plugin);
  
  const { id } = req.params;
  const userId = req.user!.id;

  const plugin = await pluginRepository.findOne({
    where: { id, authorId: userId }
  });

  if (!plugin) {
    return res.status(404).json({ error: 'Plugin not found or access denied' });
  }

  // Soft delete
  await pluginRepository.update(id, { isActive: false });

  res.json({ message: 'Plugin deleted successfully' });
});

export const getMyPlugins = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const pluginRepository = AppDataSource.getRepository(Plugin);
  
  const {
    page = 1,
    limit = 10,
    status,
    sortBy = 'createdAt',
    sortOrder = 'DESC'
  } = req.query;

  const skip = (Number(page) - 1) * Number(limit);
  const userId = req.user!.id;

  // Build query
  const queryBuilder = pluginRepository
    .createQueryBuilder('plugin')
    .leftJoinAndSelect('plugin.author', 'author')
    .where('plugin.authorId = :authorId', { authorId: userId })
    .andWhere('plugin.isActive = :isActive', { isActive: true });

  if (status) {
    queryBuilder.andWhere('plugin.status = :status', { status });
  }

  // Add sorting
  const validSortFields = ['title', 'price', 'createdAt', 'updatedAt', 'downloadCount', 'viewCount'];
  const sortField = validSortFields.includes(sortBy as string) ? sortBy as string : 'createdAt';
  queryBuilder.orderBy(`plugin.${sortField}`, sortOrder as 'ASC' | 'DESC');

  // Get total count
  const total = await queryBuilder.getCount();

  // Get paginated results
  const plugins = await queryBuilder
    .skip(skip)
    .take(Number(limit))
    .getMany();

  // Add placeholder ratings
  const pluginsWithRatings = plugins.map(plugin => ({
    ...plugin,
    avgRating: 4.5, // Placeholder
    purchaseCount: plugin.downloadCount
  }));

  res.json({
    plugins: pluginsWithRatings,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit))
    }
  });
});

export const syncPlugin = asyncHandler(async (req: Request, res: Response) => {
  const pluginRepository = AppDataSource.getRepository(Plugin);
  const userRepository = AppDataSource.getRepository(User);
  
  const {
    title,
    description,
    price,
    category,
    tags,
    downloadUrl,
    demoUrl,
    githubUrl,
    documentationUrl,
    authorId,
    status
  } = req.body;

  // Verificar si el autor existe o crear uno por defecto
  let author = await userRepository.findOne({ where: { id: authorId } });
  
  if (!author) {
    // Crear usuario por defecto si no existe
    author = userRepository.create({
      username: 'admin',
      email: 'admin@example.com',
      password: 'admin123', // En producción esto debería estar hasheado
      role: UserRole.ADMIN
    });
    author = await userRepository.save(author);
    console.log('👤 Usuario admin creado por defecto en backend principal');
  }

  // Verificar si el plugin ya existe
  const existingPlugin = await pluginRepository.findOne({
    where: { title }
  });

  let plugin: Plugin;

  if (existingPlugin) {
    // Actualizar plugin existente
    await pluginRepository.update(existingPlugin.id, {
      title,
      description,
      price,
      category,
      tags,
      downloadUrl,
      demoUrl,
      githubUrl,
      documentationUrl,
      status: status || PluginStatus.APPROVED
    });

    plugin = await pluginRepository.findOne({
      where: { id: existingPlugin.id },
      relations: ['author']
    })!;
    
    console.log(`🔄 Plugin sincronizado y actualizado: ${title}`);
  } else {
    // Crear nuevo plugin
    plugin = pluginRepository.create({
      title,
      description,
      price,
      category,
      tags,
      downloadUrl,
      demoUrl,
      githubUrl,
      documentationUrl,
      authorId: author.id,
      status: status || PluginStatus.APPROVED
    });

    plugin = await pluginRepository.save(plugin);
    
    // Cargar el plugin con autor
    plugin = await pluginRepository.findOne({
      where: { id: plugin.id },
      relations: ['author']
    })!;
    
    console.log(`🆕 Plugin sincronizado y creado: ${title}`);
  }

  res.status(201).json({
    message: 'Plugin synchronized successfully',
    plugin
  });
});