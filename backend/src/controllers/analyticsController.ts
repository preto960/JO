import { Request, Response } from 'express';
import { AppDataSource } from '@/config/database';
import { Plugin, PluginAnalytics, User, PluginStatus } from '@/entities';
import { asyncHandler } from '@/middleware/errorHandler';
import { AuthenticatedRequest } from '@/middleware/auth';

export const getAnalytics = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const pluginRepository = AppDataSource.getRepository(Plugin);
  const analyticsRepository = AppDataSource.getRepository(PluginAnalytics);
  
  const userId = req.user!.id;
  const { days = 30 } = req.query;
  
  const daysNum = Number(days);
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - daysNum);
  
  // Get user's plugins
  const plugins = await pluginRepository
    .createQueryBuilder('plugin')
    .where('plugin.authorId = :authorId', { authorId: userId })
    .andWhere('plugin.isActive = :isActive', { isActive: true })
    .getMany();
  
  // Calculate total stats
  const totalRevenue = plugins.reduce((sum, plugin) => {
    return sum + (plugin.downloadCount * plugin.price);
  }, 0);
  
  const totalSales = plugins.reduce((sum, plugin) => {
    return sum + plugin.downloadCount;
  }, 0);
  
  const totalDownloads = plugins.reduce((sum, plugin) => {
    return sum + plugin.downloadCount;
  }, 0);
  
  const avgRating = 4.5; // Placeholder - would calculate from reviews
  
  // Get daily analytics for the period
  const dailyStats = await analyticsRepository
    .createQueryBuilder('analytics')
    .leftJoin('analytics.plugin', 'plugin')
    .select([
      'analytics.date',
      'SUM(analytics.downloads) as downloads',
      'SUM(analytics.views) as views',
      'SUM(analytics.revenue) as revenue'
    ])
    .where('plugin.authorId = :authorId', { authorId: userId })
    .andWhere('analytics.date >= :startDate', { startDate })
    .groupBy('analytics.date')
    .orderBy('analytics.date', 'ASC')
    .getRawMany();
  
  // Get plugin performance stats
  const pluginStats = plugins.map(plugin => ({
    pluginId: plugin.id,
    pluginTitle: plugin.title,
    downloads: plugin.downloadCount,
    revenue: plugin.downloadCount * plugin.price,
    rating: avgRating,
    status: plugin.status
  }));
  
  res.json({
    totalRevenue: totalRevenue.toFixed(2),
    totalSales,
    totalPlugins: plugins.length,
    avgRating: avgRating.toFixed(1),
    totalDownloads,
    dailyStats: dailyStats.map(stat => ({
      date: stat.date,
      downloads: parseInt(stat.downloads) || 0,
      revenue: parseFloat(stat.revenue) || 0,
      views: parseInt(stat.views) || 0
    })),
    pluginStats
  });
});