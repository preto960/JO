import { Router } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { query, get } from '../database';
import { AnalyticsData } from '../types';

const router = Router();

// Get analytics data for the authenticated publisher
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const publisherId = req.publisher!.id;

    // Get total downloads
    const totalDownloadsResult = await get(
      `SELECT COUNT(*) as count 
       FROM downloads d 
       JOIN plugins p ON d.pluginId = p.id 
       WHERE p.publisherId = ?`,
      [publisherId]
    );

    // Get total revenue
    const totalRevenueResult = await get(
      `SELECT SUM(p.price) as revenue 
       FROM downloads d 
       JOIN plugins p ON d.pluginId = p.id 
       WHERE p.publisherId = ?`,
      [publisherId]
    );

    // Get active plugins count
    const activePluginsResult = await get(
      'SELECT COUNT(*) as count FROM plugins WHERE publisherId = ? AND status = "approved"',
      [publisherId]
    );

    // Get downloads by month (last 6 months)
    const downloadsByMonth = await query(
      `SELECT 
        strftime('%Y-%m', d.createdAt) as month,
        COUNT(*) as downloads
       FROM downloads d
       JOIN plugins p ON d.pluginId = p.id
       WHERE p.publisherId = ? 
         AND d.createdAt >= date('now', '-6 months')
       GROUP BY strftime('%Y-%m', d.createdAt)
       ORDER BY month`,
      [publisherId]
    );

    // Get top plugins
    const topPlugins = await query(
      `SELECT 
        p.id,
        p.name,
        COUNT(d.id) as downloads,
        COUNT(d.id) * p.price as revenue
       FROM plugins p
       LEFT JOIN downloads d ON p.id = d.pluginId
       WHERE p.publisherId = ?
       GROUP BY p.id, p.name, p.price
       ORDER BY downloads DESC
       LIMIT 5`,
      [publisherId]
    );

    const analyticsData: AnalyticsData = {
      totalDownloads: totalDownloadsResult?.count || 0,
      totalRevenue: totalRevenueResult?.revenue || 0,
      activePlugins: activePluginsResult?.count || 0,
      downloadsByMonth: downloadsByMonth.map((row: any) => ({
        month: row.month,
        downloads: row.downloads
      })),
      topPlugins: topPlugins.map((row: any) => ({
        id: row.id,
        name: row.name,
        downloads: row.downloads,
        revenue: row.revenue
      }))
    };

    res.json({
      success: true,
      analytics: analyticsData
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get plugin-specific analytics
router.get('/plugin/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const publisherId = req.publisher!.id;

    // Verify plugin belongs to publisher
    const plugin = await get(
      'SELECT * FROM plugins WHERE id = ? AND publisherId = ?',
      [id, publisherId]
    );

    if (!plugin) {
      return res.status(404).json({
        success: false,
        message: 'Plugin not found'
      });
    }

    // Get download count
    const downloadCount = await get(
      'SELECT COUNT(*) as count FROM downloads WHERE pluginId = ?',
      [id]
    );

    // Get downloads by date (last 30 days)
    const downloadsByDate = await query(
      `SELECT 
        strftime('%Y-%m-%d', createdAt) as date,
        COUNT(*) as downloads
       FROM downloads
       WHERE pluginId = ? 
         AND createdAt >= date('now', '-30 days')
       GROUP BY strftime('%Y-%m-%d', createdAt)
       ORDER BY date`,
      [id]
    );

    res.json({
      success: true,
      analytics: {
        plugin: {
          id: plugin.id,
          name: plugin.name,
          totalDownloads: downloadCount?.count || 0,
          revenue: (downloadCount?.count || 0) * plugin.price,
          downloadsByDate: downloadsByDate.map((row: any) => ({
            date: row.date,
            downloads: row.downloads
          }))
        }
      }
    });
  } catch (error) {
    console.error('Get plugin analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export { router as analyticsRoutes };