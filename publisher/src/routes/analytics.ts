import express from 'express';
import { authenticateToken } from '../middleware/auth';
import backendApi from '../services/backend';

const router = express.Router();

// Get publisher analytics
router.get('/', authenticateToken, async (req, res) => {
  try {
    const response = await backendApi.get('/publishers/analytics', {
      headers: {
        Authorization: `Bearer ${req.token}`
      }
    });
    
    res.json(response.data);
  } catch (error: any) {
    res.status(500).json({ 
      error: error.response?.data?.error || 'Failed to fetch analytics' 
    });
  }
});

export { router as analyticsRoutes };