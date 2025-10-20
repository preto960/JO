import express from 'express';
import { prisma } from '../services/database';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Get publisher plugins
router.get('/plugins', authenticateToken, async (req, res) => {
  try {
    if (req.user?.type !== 'publisher') {
      return res.status(403).json({ error: 'Only publishers can view their plugins' });
    }
    
    const plugins = await prisma.plugin.findMany({
      where: { publisherId: req.user.id },
      include: {
        _count: {
          select: { downloads: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(plugins);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get publisher analytics
router.get('/analytics', authenticateToken, async (req, res) => {
  try {
    if (req.user?.type !== 'publisher') {
      return res.status(403).json({ error: 'Only publishers can view analytics' });
    }
    
    const [totalPlugins, totalDownloads, recentDownloads] = await Promise.all([
      prisma.plugin.count({
        where: { publisherId: req.user.id }
      }),
      prisma.download.count({
        where: {
          plugin: {
            publisherId: req.user.id
          }
        }
      }),
      prisma.download.findMany({
        where: {
          plugin: {
            publisherId: req.user.id
          }
        },
        include: {
          plugin: {
            select: { name: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      })
    ]);
    
    res.json({
      totalPlugins,
      totalDownloads,
      recentDownloads
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { router as publisherRoutes };