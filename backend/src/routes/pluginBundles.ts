import { Router, Request, Response } from 'express';
import { pluginInstallationService } from '../services/pluginInstallationService';
import { pluginBundleService } from '../services/pluginBundleService';

const router = Router();

/**
 * GET /api/plugin-bundles/:pluginSlug/bundle.js
 * Sirve el bundle JavaScript de un plugin
 */
router.get('/:pluginSlug/bundle.js', async (req: Request, res: Response) => {
  try {
    const { pluginSlug } = req.params;

    // Buscar el plugin instalado
    const plugins = await pluginInstallationService.getInstalledPlugins({ isActive: true });
    const plugin = plugins.find(p => p.slug === pluginSlug);

    if (!plugin) {
      return res.status(404).json({ message: 'Plugin not found or not active' });
    }

    // Generar el bundle
    const bundle = await pluginBundleService.generatePluginBundle(plugin);

    // Configurar headers para JavaScript module
    res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Cache-Control', 'no-cache'); // En producción, usar cache

    res.send(bundle);
  } catch (error: any) {
    console.error('Error serving plugin bundle:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

/**
 * GET /api/plugin-bundles/:pluginSlug/info
 * Obtiene información del bundle de un plugin
 */
router.get('/:pluginSlug/info', async (req: Request, res: Response) => {
  try {
    const { pluginSlug } = req.params;

    const plugins = await pluginInstallationService.getInstalledPlugins({ isActive: true });
    const plugin = plugins.find(p => p.slug === pluginSlug);

    if (!plugin) {
      return res.status(404).json({ message: 'Plugin not found or not active' });
    }

    res.json({
      id: plugin.id,
      slug: plugin.slug,
      name: plugin.name,
      version: plugin.version,
      bundleUrl: pluginBundleService.getPluginBundleUrl(plugin.slug),
      manifest: plugin.manifest
    });
  } catch (error: any) {
    console.error('Error getting plugin bundle info:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export { router as pluginBundlesRoutes };

