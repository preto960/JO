import { Router, Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { PublishedPlugin } from '../models/PublishedPlugin';
import axios from 'axios';

const router = Router();

/**
 * GET /api/download/:pluginId
 * Descarga el paquete de un plugin publicado
 */
router.get('/:pluginId', async (req: Request, res: Response) => {
  try {
    const { pluginId } = req.params;

    const pluginRepo = AppDataSource.getRepository(PublishedPlugin);
    const plugin = await pluginRepo.findOne({
      where: { id: pluginId }
    });

    if (!plugin) {
      return res.status(404).json({ message: 'Plugin not found' });
    }

    if (!plugin.packageUrl) {
      return res.status(404).json({ message: 'Plugin package not available' });
    }

    // Descargar el archivo desde Vercel Blob
    const response = await axios.get(plugin.packageUrl, {
      responseType: 'arraybuffer',
      timeout: 60000
    });

    // Configurar headers para descarga
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${plugin.slug}-${plugin.version}.zip"`);
    res.setHeader('Content-Length', response.data.length);

    res.send(response.data);
  } catch (error: any) {
    console.error('Plugin download error:', error);
    res.status(500).json({ message: 'Failed to download plugin', error: error.message });
  }
});

export { router as pluginDownloadRoutes };

