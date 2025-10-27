import { put, del, head } from '@vercel/blob';

export class BlobService {
  private token: string;

  constructor() {
    this.token = process.env.BLOB_READ_WRITE_TOKEN!;
  }

  async uploadPlugin(file: Express.Multer.File, pluginId: string, version: string): Promise<{ url: string; size: number }> {
    try {
      const filename = `plugins/${pluginId}/${version}/${file.originalname}`;
      
      // Convert Buffer to compatible type for Vercel Blob
      const blob = await put(filename, file.buffer as any, {
        access: 'public',
        token: this.token,
        contentType: file.mimetype,
      });

      return {
        url: blob.url,
        size: file.size
      };
    } catch (error) {
      console.error('Blob upload error:', error);
      throw new Error('Failed to upload plugin to storage');
    }
  }

  async deletePlugin(url: string): Promise<void> {
    try {
      await del(url, { token: this.token });
    } catch (error) {
      console.error('Blob delete error:', error);
      throw new Error('Failed to delete plugin from storage');
    }
  }

  async getPluginInfo(url: string): Promise<{ size: number; uploadedAt: Date }> {
    try {
      const info = await head(url, { token: this.token });
      return {
        size: info.size,
        uploadedAt: info.uploadedAt
      };
    } catch (error) {
      console.error('Blob info error:', error);
      throw new Error('Failed to get plugin info');
    }
  }
}

export const blobService = new BlobService();

