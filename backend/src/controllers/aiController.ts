import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Plugin } from '../models/Plugin';
import { User } from '../models/User';
import { createError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import { aiService } from '../services/aiService';

export class AIController {
  private pluginRepository = AppDataSource.getRepository(Plugin);

  analyzePlugin = async (req: AuthRequest, res: Response) => {
    try {
      const { pluginId } = req.body;

      const plugin = await this.pluginRepository.findOne({ 
        where: { id: pluginId },
        relations: ['developer']
      });

      if (!plugin) {
        throw createError('Plugin not found', 404);
      }

      // Check ownership
      if (plugin.developer.id !== req.user!.id && req.user!.role !== 'ADMIN') {
        throw createError('Not authorized to analyze this plugin', 403);
      }

      const analysisPrompt = `
        Analyze this plugin and provide detailed feedback:
        
        Name: ${plugin.name}
        Description: ${plugin.description}
        Category: ${plugin.category}
        Tags: ${plugin.tags?.join(', ') || 'None'}
        
        Please provide analysis on:
        1. Market potential
        2. Technical quality assessment
        3. SEO optimization suggestions
        4. Marketing recommendations
        5. Competitive advantages
        6. Improvement suggestions
        
        Format as JSON with keys: marketPotential, technicalQuality, seoOptimization, marketingRecommendations, competitiveAdvantages, improvementSuggestions
      `;

      const completion = await aiService.chatCompletions([
        {
          role: 'system',
          content: 'You are an expert plugin analyst providing detailed feedback for plugin developers.'
        },
        {
          role: 'user',
          content: analysisPrompt
        }
      ]);

      const analysisData = JSON.parse(completion.choices[0]?.message?.content || '{}');

      // Save analysis to plugin
      plugin.aiAnalysis = analysisData;
      await this.pluginRepository.save(plugin);

      res.json({
        message: 'Plugin analysis completed',
        analysis: analysisData
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

  generateContent = async (req: AuthRequest, res: Response) => {
    try {
      const { pluginId, contentType, targetAudience, tone } = req.body;

      const plugin = await this.pluginRepository.findOne({ 
        where: { id: pluginId },
        relations: ['developer']
      });

      if (!plugin) {
        throw createError('Plugin not found', 404);
      }

      // Check ownership
      if (plugin.developer.id !== req.user!.id && req.user!.role !== 'ADMIN') {
        throw createError('Not authorized to generate content for this plugin', 403);
      }

      let contentPrompt = '';

      switch (contentType) {
        case 'description':
          contentPrompt = `
            Generate a compelling plugin description for:
            Name: ${plugin.name}
            Category: ${plugin.category}
            Current description: ${plugin.description}
            
            Target audience: ${targetAudience || 'General users'}
            Tone: ${tone || 'Professional'}
            
            Make it engaging, highlight key benefits, and include a call to action.
          `;
          break;
        case 'documentation':
          contentPrompt = `
            Generate comprehensive documentation for:
            Name: ${plugin.name}
            Description: ${plugin.description}
            Category: ${plugin.category}
            
            Include installation, usage examples, API reference, and troubleshooting.
          `;
          break;
        case 'marketing':
          contentPrompt = `
            Generate marketing copy for:
            Name: ${plugin.name}
            Description: ${plugin.description}
            Category: ${plugin.category}
            
            Create social media posts, email newsletter content, and ad copy.
          `;
          break;
        default:
          throw createError('Invalid content type', 400);
      }

      const completion = await aiService.chatCompletions([
        {
          role: 'system',
          content: 'You are an expert content writer specializing in plugin marketing and documentation.'
        },
        {
          role: 'user',
          content: contentPrompt
        }
      ]);

      const generatedContent = completion.choices[0]?.message?.content;

      res.json({
        message: 'Content generated successfully',
        contentType,
        content: generatedContent
      });
    } catch (error) {
      if (error instanceof Error) {
        const statusCode = error.message.includes('not found') ? 404 : 
                          error.message.includes('authorized') ? 403 : 
                          error.message.includes('Invalid') ? 400 : 500;
        res.status(statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };

  generateImage = async (req: AuthRequest, res: Response) => {
    try {
      const { pluginId, imageType, prompt, size = '1024x1024' } = req.body;

      const plugin = await this.pluginRepository.findOne({ 
        where: { id: pluginId },
        relations: ['developer']
      });

      if (!plugin) {
        throw createError('Plugin not found', 404);
      }

      // Check ownership
      if (plugin.developer.id !== req.user!.id && req.user!.role !== 'ADMIN') {
        throw createError('Not authorized to generate images for this plugin', 403);
      }

      let imagePrompt = prompt;

      if (!imagePrompt) {
        switch (imageType) {
          case 'icon':
            imagePrompt = `Create a modern, professional app icon for a plugin called "${plugin.name}" in the ${plugin.category} category. Minimalist design, clean lines, suitable for app store.`;
            break;
          case 'screenshot':
            imagePrompt = `Create a professional screenshot/mockup for a plugin called "${plugin.name}" - ${plugin.description}. Show the plugin interface in use, clean and modern design.`;
            break;
          case 'banner':
            imagePrompt = `Create a promotional banner for a plugin called "${plugin.name}" - ${plugin.description}. Professional marketing design, include the plugin name prominently.`;
            break;
          default:
            throw createError('Invalid image type', 400);
        }
      }

      const response = await aiService.generateImage(imagePrompt, size);

      const imageBase64 = response.data[0]?.base64 || response.data[0]?.url;

      res.json({
        message: 'Image generated successfully',
        imageType,
        image: imageBase64,
        size
      });
    } catch (error) {
      if (error instanceof Error) {
        const statusCode = error.message.includes('not found') ? 404 : 
                          error.message.includes('authorized') ? 403 : 
                          error.message.includes('Invalid') ? 400 : 500;
        res.status(statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };

  recommendPlugins = async (req: Request, res: Response) => {
    try {
      const { userId, category, preferences, limit = 10 } = req.body;

      const recommendationPrompt = `
        Based on the following user preferences, recommend plugins:
        
        User preferences: ${preferences || 'General productivity and efficiency'}
        Preferred category: ${category || 'All categories'}
        
        Search our plugin database and recommend the top ${limit} plugins that would be most valuable.
        Consider: user needs, plugin quality, ratings, and relevance.
        
        Format as JSON array with plugin IDs and reasoning.
      `;

      const completion = await aiService.chatCompletions([
        {
          role: 'system',
          content: 'You are an expert recommendation engine for plugin discovery.'
        },
        {
          role: 'user',
          content: recommendationPrompt
        }
      ]);

      const recommendations = JSON.parse(completion.choices[0]?.message?.content || '[]');

      res.json({
        message: 'Recommendations generated',
        recommendations
      });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  optimizeSEO = async (req: AuthRequest, res: Response) => {
    try {
      const { pluginId } = req.body;

      const plugin = await this.pluginRepository.findOne({ 
        where: { id: pluginId },
        relations: ['developer']
      });

      if (!plugin) {
        throw createError('Plugin not found', 404);
      }

      // Check ownership
      if (plugin.developer.id !== req.user!.id && req.user!.role !== 'ADMIN') {
        throw createError('Not authorized to optimize SEO for this plugin', 403);
      }

      const seoPrompt = `
        Analyze and optimize SEO for this plugin:
        
        Name: ${plugin.name}
        Description: ${plugin.description}
        Category: ${plugin.category}
        Tags: ${plugin.tags?.join(', ') || 'None'}
        
        Provide SEO optimization suggestions:
        1. Improved title/meta title
        2. Meta description
        3. Keywords (10-15 relevant keywords)
        4. Suggested tags
        5. Content optimization tips
        
        Format as JSON with keys: metaTitle, metaDescription, keywords, suggestedTags, contentOptimization
      `;

      const completion = await aiService.chatCompletions([
        {
          role: 'system',
          content: 'You are an SEO expert specializing in plugin marketplace optimization.'
        },
        {
          role: 'user',
          content: seoPrompt
        }
      ]);

      const seoData = JSON.parse(completion.choices[0]?.message?.content || '{}');

      // Save SEO metadata to plugin
      plugin.seoMetadata = seoData;
      await this.pluginRepository.save(plugin);

      res.json({
        message: 'SEO optimization completed',
        seoData
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
}