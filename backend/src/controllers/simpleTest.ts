import { Request, Response } from 'express';

export const testSimple = async (req: Request, res: Response) => {
  try {
    console.log('🔍 Simple test endpoint');
    
    res.json({
      message: 'Simple test works',
      plugins: [
        {
          id: 'test-1',
          title: 'Test Plugin',
          description: 'This is a test plugin',
          price: 10,
          category: 'test',
          status: 'APPROVED',
          avgRating: 4.5,
          author: {
            id: 'test-author',
            username: 'Test Author'
          },
          _count: {
            reviews: 0,
            purchases: 5
          }
        }
      ],
      pagination: {
        page: 1,
        limit: 10,
        total: 1,
        pages: 1
      }
    });
  } catch (error: any) {
    console.error('❌ Error in simple test:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
};