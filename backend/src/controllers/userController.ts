import { Request, Response } from 'express';
import { AppDataSource } from '@/config/database';
import { User, Plugin, PluginStatus } from '@/entities';
import { asyncHandler } from '@/middleware/errorHandler';
import { AuthenticatedRequest } from '@/middleware/auth';

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const userRepository = AppDataSource.getRepository(User);
  const pluginRepository = AppDataSource.getRepository(Plugin);

  const { id } = req.params;

  const user = await userRepository.findOne({
    where: { id, isActive: true },
    relations: ['profile'],
    select: ['id', 'email', 'username', 'role', 'createdAt', 'updatedAt']
  });

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Get user's plugins
  const plugins = await pluginRepository.find({
    where: { 
      authorId: id, 
      isActive: true,
      status: PluginStatus.APPROVED
    },
    select: ['id', 'title', 'description', 'price', 'category', 'createdAt', 'downloadCount', 'viewCount']
  });

  res.json({
    user: {
      ...user,
      plugins
    }
  });
});

export const getMyStats = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const pluginRepository = AppDataSource.getRepository(Plugin);

  // Get user's plugins
  const plugins = await pluginRepository.find({
    where: { authorId: userId }
  });

  // Calculate stats
  const totalPlugins = plugins.length;
  const totalRevenue = plugins.reduce((sum, plugin) => {
    return sum + (plugin.price * plugin.downloadCount);
  }, 0);

  const totalDownloads = plugins.reduce((sum, plugin) => sum + plugin.downloadCount, 0);

  res.json({
    stats: {
      totalPlugins,
      totalRevenue,
      totalDownloads
    }
  });
});