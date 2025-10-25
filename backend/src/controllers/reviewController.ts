import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Review } from '../models/Review';
import { Plugin } from '../models/Plugin';
import { User } from '../models/User';
import { createError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export class ReviewController {
  private reviewRepository = AppDataSource.getRepository(Review);
  private pluginRepository = AppDataSource.getRepository(Plugin);

  getReviews = async (req: Request, res: Response) => {
    try {
      const { pluginId, page = 1, limit = 20, rating } = req.query;

      const queryBuilder = this.reviewRepository
        .createQueryBuilder('review')
        .leftJoinAndSelect('review.user', 'user')
        .leftJoinAndSelect('review.plugin', 'plugin')
        .where('review.isPublic = :isPublic', { isPublic: true });

      if (pluginId) {
        queryBuilder.andWhere('review.pluginId = :pluginId', { pluginId });
      }

      if (rating) {
        queryBuilder.andWhere('review.rating = :rating', { rating });
      }

      queryBuilder
        .orderBy('review.createdAt', 'DESC')
        .skip((Number(page) - 1) * Number(limit))
        .take(Number(limit));

      const [reviews, total] = await queryBuilder.getManyAndCount();

      res.json({
        reviews,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit))
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  createReview = async (req: AuthRequest, res: Response) => {
    try {
      const { pluginId, rating, title, content } = req.body;

      // Check if plugin exists
      const plugin = await this.pluginRepository.findOne({ where: { id: pluginId } });
      if (!plugin) {
        throw createError('Plugin not found', 404);
      }

      // Check if user already reviewed this plugin
      const existingReview = await this.reviewRepository.findOne({
        where: {
          user: { id: req.user!.id },
          plugin: { id: pluginId }
        }
      });

      if (existingReview) {
        throw createError('You have already reviewed this plugin', 409);
      }

      const review = this.reviewRepository.create({
        rating,
        title,
        content,
        user: req.user!,
        plugin
      });

      await this.reviewRepository.save(review);

      // Update plugin rating
      await this.updatePluginRating(pluginId);

      res.status(201).json({
        message: 'Review created successfully',
        review
      });
    } catch (error) {
      if (error instanceof Error) {
        const statusCode = error.message.includes('not found') ? 404 : 
                          error.message.includes('already reviewed') ? 409 : 500;
        res.status(statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };

  updateReview = async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { rating, title, content } = req.body;

      const review = await this.reviewRepository.findOne({
        where: { id },
        relations: ['user']
      });

      if (!review) {
        throw createError('Review not found', 404);
      }

      // Check ownership
      if (review.user.id !== req.user!.id) {
        throw createError('Not authorized to update this review', 403);
      }

      review.rating = rating || review.rating;
      review.title = title || review.title;
      review.content = content || review.content;

      await this.reviewRepository.save(review);

      // Update plugin rating
      await this.updatePluginRating(review.plugin.id);

      res.json({
        message: 'Review updated successfully',
        review
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

  deleteReview = async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;

      const review = await this.reviewRepository.findOne({
        where: { id },
        relations: ['user']
      });

      if (!review) {
        throw createError('Review not found', 404);
      }

      // Check ownership or admin
      if (review.user.id !== req.user!.id && req.user!.role !== 'ADMIN') {
        throw createError('Not authorized to delete this review', 403);
      }

      const pluginId = review.plugin.id;
      await this.reviewRepository.remove(review);

      // Update plugin rating
      await this.updatePluginRating(pluginId);

      res.json({ message: 'Review deleted successfully' });
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

  respondToReview = async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { response } = req.body;

      const review = await this.reviewRepository.findOne({
        where: { id },
        relations: ['plugin', 'plugin.developer']
      });

      if (!review) {
        throw createError('Review not found', 404);
      }

      // Check if user is the plugin developer
      if (review.plugin.developer.id !== req.user!.id) {
        throw createError('Not authorized to respond to this review', 403);
      }

      review.response = response;
      review.respondedAt = new Date();

      await this.reviewRepository.save(review);

      res.json({
        message: 'Response added successfully',
        review
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

  private async updatePluginRating(pluginId: string) {
    const stats = await this.reviewRepository
      .createQueryBuilder('review')
      .where('review.pluginId = :pluginId', { pluginId })
      .andWhere('review.isPublic = :isPublic', { isPublic: true })
      .select('AVG(review.rating)', 'avgRating')
      .addSelect('COUNT(review.id)', 'count')
      .getRawOne();

    await this.pluginRepository.update(pluginId, {
      rating: parseFloat(stats?.avgRating || '0'),
      reviewCount: parseInt(stats?.count || '0')
    });
  }
}