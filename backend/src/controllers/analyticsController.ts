import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Plugin } from '../models/Plugin';
import { Download } from '../models/Download';
import { Purchase } from '../models/Purchase';
import { Review } from '../models/Review';
import { User } from '../models/User';
import { createError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export class AnalyticsController {
  private pluginRepository = AppDataSource.getRepository(Plugin);
  private downloadRepository = AppDataSource.getRepository(Download);
  private purchaseRepository = AppDataSource.getRepository(Purchase);
  private reviewRepository = AppDataSource.getRepository(Review);

  getDashboardStats = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user!.id;

      // Get user's plugins
      const plugins = await this.pluginRepository.find({
        where: { developer: { id: userId } }
      });

      const pluginIds = plugins.map(p => p.id);

      // Calculate stats
      const totalDownloads = await this.downloadRepository
        .createQueryBuilder('download')
        .where('download.pluginId IN (:...pluginIds)', { pluginIds })
        .getCount();

      const totalRevenue = await this.purchaseRepository
        .createQueryBuilder('purchase')
        .where('purchase.pluginId IN (:...pluginIds)', { pluginIds })
        .andWhere('purchase.isRefunded = :isRefunded', { isRefunded: false })
        .select('SUM(purchase.amount)', 'total')
        .getRawOne();

      const totalReviews = await this.reviewRepository
        .createQueryBuilder('review')
        .where('review.pluginId IN (:...pluginIds)', { pluginIds })
        .getCount();

      const averageRating = await this.reviewRepository
        .createQueryBuilder('review')
        .where('review.pluginId IN (:...pluginIds)', { pluginIds })
        .select('AVG(review.rating)', 'avgRating')
        .getRawOne();

      const activePlugins = plugins.filter(p => p.status === 'APPROVED').length;
      const pendingPlugins = plugins.filter(p => p.status === 'PENDING').length;

      res.json({
        stats: {
          totalPlugins: plugins.length,
          activePlugins,
          pendingPlugins,
          totalDownloads,
          totalRevenue: parseFloat(totalRevenue?.total || '0'),
          totalReviews,
          averageRating: parseFloat(averageRating?.avgRating || '0').toFixed(1)
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  getPluginAnalytics = async (req: AuthRequest, res: Response) => {
    try {
      const { pluginId } = req.params;
      const { period = '30d' } = req.query;

      // Verify ownership
      const plugin = await this.pluginRepository.findOne({ 
        where: { id: pluginId },
        relations: ['developer']
      });

      if (!plugin) {
        throw createError('Plugin not found', 404);
      }

      if (plugin.developer.id !== req.user!.id && req.user!.role !== 'ADMIN') {
        throw createError('Not authorized to view analytics for this plugin', 403);
      }

      // Calculate date range based on period
      const now = new Date();
      let startDate: Date;

      switch (period) {
        case '7d':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case '90d':
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        case '1y':
          startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      }

      // Get downloads over time
      const downloadsOverTime = await this.downloadRepository
        .createQueryBuilder('download')
        .select('DATE(download.downloadedAt)', 'date')
        .addSelect('COUNT(*)', 'count')
        .where('download.pluginId = :pluginId', { pluginId })
        .andWhere('download.downloadedAt >= :startDate', { startDate })
        .groupBy('DATE(download.downloadedAt)')
        .orderBy('date', 'ASC')
        .getRawMany();

      // Get revenue over time
      const revenueOverTime = await this.purchaseRepository
        .createQueryBuilder('purchase')
        .select('DATE(purchase.purchasedAt)', 'date')
        .addSelect('SUM(purchase.amount)', 'revenue')
        .where('purchase.pluginId = :pluginId', { pluginId })
        .andWhere('purchase.purchasedAt >= :startDate', { startDate })
        .andWhere('purchase.isRefunded = :isRefunded', { isRefunded: false })
        .groupBy('DATE(purchase.purchasedAt)')
        .orderBy('date', 'ASC')
        .getRawMany();

      // Get recent reviews
      const recentReviews = await this.reviewRepository
        .createQueryBuilder('review')
        .leftJoinAndSelect('review.user', 'user')
        .where('review.pluginId = :pluginId', { pluginId })
        .orderBy('review.createdAt', 'DESC')
        .limit(10)
        .getMany();

      // Top countries (simplified - in real app would use IP geolocation)
      const topCountries = await this.downloadRepository
        .createQueryBuilder('download')
        .select('download.ipAddress', 'country')
        .addSelect('COUNT(*)', 'count')
        .where('download.pluginId = :pluginId', { pluginId })
        .andWhere('download.downloadedAt >= :startDate', { startDate })
        .groupBy('download.ipAddress')
        .orderBy('count', 'DESC')
        .limit(5)
        .getRawMany();

      res.json({
        plugin: {
          id: plugin.id,
          name: plugin.name,
          version: plugin.version,
          downloadCount: plugin.downloadCount,
          rating: plugin.rating,
          reviewCount: plugin.reviewCount
        },
        period,
        analytics: {
          downloadsOverTime,
          revenueOverTime,
          recentReviews,
          topCountries: topCountries.map(c => ({ country: c.country || 'Unknown', count: parseInt(c.count) }))
        }
      });
    } catch (error) {
      if (error instanceof Error) {
        const statusCode = error.message.includes('not found') ? 404 : 
                          error.message.includes('authorized') ? 403 : 500;
        res.status(statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };

  getRevenueAnalytics = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user!.id;
      const { period = '30d' } = req.query;

      // Get user's plugins
      const plugins = await this.pluginRepository.find({
        where: { developer: { id: userId } }
      });

      const pluginIds = plugins.map(p => p.id);

      // Calculate date range
      const now = new Date();
      let startDate: Date;

      switch (period) {
        case '7d':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case '90d':
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        case '1y':
          startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      }

      // Revenue by plugin
      const revenueByPlugin = await this.purchaseRepository
        .createQueryBuilder('purchase')
        .leftJoinAndSelect('purchase.plugin', 'plugin')
        .where('purchase.pluginId IN (:...pluginIds)', { pluginIds })
        .andWhere('purchase.purchasedAt >= :startDate', { startDate })
        .andWhere('purchase.isRefunded = :isRefunded', { isRefunded: false })
        .select('plugin.name', 'pluginName')
        .addSelect('SUM(purchase.amount)', 'revenue')
        .addSelect('COUNT(purchase.id)', 'sales')
        .groupBy('plugin.id')
        .orderBy('revenue', 'DESC')
        .getRawMany();

      // Revenue over time
      const revenueOverTime = await this.purchaseRepository
        .createQueryBuilder('purchase')
        .select('DATE(purchase.purchasedAt)', 'date')
        .addSelect('SUM(purchase.amount)', 'revenue')
        .where('purchase.pluginId IN (:...pluginIds)', { pluginIds })
        .andWhere('purchase.purchasedAt >= :startDate', { startDate })
        .andWhere('purchase.isRefunded = :isRefunded', { isRefunded: false })
        .groupBy('DATE(purchase.purchasedAt)')
        .orderBy('date', 'ASC')
        .getRawMany();

      // Total stats
      const totalRevenue = await this.purchaseRepository
        .createQueryBuilder('purchase')
        .where('purchase.pluginId IN (:...pluginIds)', { pluginIds })
        .andWhere('purchase.purchasedAt >= :startDate', { startDate })
        .andWhere('purchase.isRefunded = :isRefunded', { isRefunded: false })
        .select('SUM(purchase.amount)', 'total')
        .addSelect('COUNT(purchase.id)', 'count')
        .getRawOne();

      res.json({
        period,
        summary: {
          totalRevenue: parseFloat(totalRevenue?.total || '0'),
          totalSales: parseInt(totalRevenue?.count || '0')
        },
        revenueByPlugin: revenueByPlugin.map(p => ({
          pluginName: p.pluginName,
          revenue: parseFloat(p.revenue),
          sales: parseInt(p.sales)
        })),
        revenueOverTime: revenueOverTime.map(r => ({
          date: r.date,
          revenue: parseFloat(r.revenue)
        }))
      });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };
}