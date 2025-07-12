import {
  Controller,
  Post,
  Delete,
  Param,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiConsumes,
  ApiParam,
} from '@nestjs/swagger';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Upload')
@Controller('upload')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post('images')
  @ApiOperation({ summary: 'Upload single image (Admin only)' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    const imageUrl = await this.uploadService.uploadImage(file, 'products');
    return { imageUrl };
  }

  @Post('images/multiple')
  @ApiOperation({ summary: 'Upload multiple images (Admin only)' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('images', 10))
  async uploadMultipleImages(@UploadedFiles() files: Express.Multer.File[]) {
    const imageUrls = await this.uploadService.uploadMultipleImages(
      files,
      'products',
    );
    return { imageUrls };
  }

  @Delete('images/:filename')
  @ApiOperation({ summary: 'Delete image (Admin only)' })
  @ApiParam({ name: 'filename', description: 'Image filename' })
  async deleteImage(@Param('filename') filename: string) {
    await this.uploadService.deleteImage(`/uploads/products/${filename}`);
    return { message: 'Image deleted successfully' };
  }
}
