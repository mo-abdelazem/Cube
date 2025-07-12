import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import * as fs from 'fs';
import { promisify } from 'util';

const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);

@Injectable()
export class UploadService {
  private readonly uploadDir: string;
  private readonly maxFileSize: number;
  private readonly allowedTypes: string[];

  constructor(private configService: ConfigService) {
    this.uploadDir = path.join(process.cwd(), 'uploads');
    this.maxFileSize =
      this.configService.get<number>('MAX_FILE_SIZE') || 5 * 1024 * 1024; // 5MB
    this.allowedTypes = this.configService
      .get<string>('ALLOWED_FILE_TYPES')
      ?.split(',') || ['jpg', 'jpeg', 'png', 'webp'];
  }

  async uploadImage(
    file: Express.Multer.File,
    subfolder = 'products',
  ): Promise<string> {
    try {
      // Validate file
      if (!file) {
        throw new BadRequestException('No file provided');
      }

      if (file.size > this.maxFileSize) {
        throw new BadRequestException(
          `File size exceeds limit of ${this.maxFileSize / 1024 / 1024}MB`,
        );
      }

      const fileExtension = path
        .extname(file.originalname)
        .toLowerCase()
        .substring(1);
      if (!this.allowedTypes.includes(fileExtension)) {
        throw new BadRequestException(
          `File type not allowed. Allowed types: ${this.allowedTypes.join(', ')}`,
        );
      }

      // Create upload directory if it doesn't exist
      const uploadPath = path.join(this.uploadDir, subfolder);
      try {
        await mkdir(uploadPath, { recursive: true });
      } catch (error) {
        // Directory might already exist
      }

      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const filename = `${timestamp}-${randomString}.${fileExtension}`;
      const filePath = path.join(uploadPath, filename);

      // Save file
      await writeFile(filePath, file.buffer);

      // Return relative URL
      return `/uploads/${subfolder}/${filename}`;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Failed to upload image: ${error.message}`);
    }
  }

  async uploadMultipleImages(
    files: Express.Multer.File[],
    subfolder = 'products',
  ): Promise<string[]> {
    const uploadPromises = files.map((file) =>
      this.uploadImage(file, subfolder),
    );
    return Promise.all(uploadPromises);
  }

  async deleteImage(imagePath: string): Promise<void> {
    try {
      const fullPath = path.join(process.cwd(), imagePath);

      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    } catch (error) {
      // Log error but don't throw - image might already be deleted
      console.error('Failed to delete image:', error);
    }
  }
}
