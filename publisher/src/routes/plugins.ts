import express from 'express';
import { authenticateToken } from '../middleware/auth';
import backendApi from '../services/backend';

const router = express.Router();

// Get publisher plugins
router.get('/', authenticateToken, async (req, res) => {
  try {
    const response = await backendApi.get('/publishers/plugins', {
      headers: {
        Authorization: `Bearer ${req.token}`
      }
    });
    
    res.json(response.data);
  } catch (error: any) {
    res.status(500).json({ 
      error: error.response?.data?.error || 'Failed to fetch plugins' 
    });
  }
});

// Create plugin
router.post('/', authenticateToken, async (req, res) => {
  try {
    const pluginData = {
      ...req.body,
      publisherId: req.user?.id
    };
    
    const response = await backendApi.post('/plugins', pluginData, {
      headers: {
        Authorization: `Bearer ${req.token}`
      }
    });
    
    res.status(201).json(response.data);
  } catch (error: any) {
    res.status(500).json({ 
      error: error.response?.data?.error || 'Failed to create plugin' 
    });
  }
});

// Update plugin
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const response = await backendApi.put(`/plugins/${req.params.id}`, req.body, {
      headers: {
        Authorization: `Bearer ${req.token}`
      }
    });
    
    res.json(response.data);
  } catch (error: any) {
    res.status(500).json({ 
      error: error.response?.data?.error || 'Failed to update plugin' 
    });
  }
});

export { router as pluginRoutes };