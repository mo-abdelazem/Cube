import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto, UpdateReviewDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Reviews')
@Controller('products/:productId/reviews')
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create product review' })
  @ApiParam({ name: 'productId', description: 'Product ID' })
  createReview(
    @Request() req,
    @Param('productId') productId: string,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    return this.reviewsService.createReview(
      req.user.id,
      productId,
      createReviewDto,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get product reviews' })
  @ApiParam({ name: 'productId', description: 'Product ID' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  getProductReviews(
    @Param('productId') productId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.reviewsService.getProductReviews(
      productId,
      page ? +page : 1,
      limit ? +limit : 20,
    );
  }
}

@ApiTags('Reviews')
@Controller('reviews')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Put(':id')
  @ApiOperation({ summary: 'Update user review' })
  @ApiParam({ name: 'id', description: 'Review ID' })
  updateReview(
    @Request() req,
    @Param('id') reviewId: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    return this.reviewsService.updateReview(
      req.user.id,
      reviewId,
      updateReviewDto,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user review' })
  @ApiParam({ name: 'id', description: 'Review ID' })
  deleteReview(@Request() req, @Param('id') reviewId: string) {
    return this.reviewsService.deleteReview(req.user.id, reviewId);
  }

  @Get('pending')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get pending reviews (Admin only)' })
  getPendingReviews() {
    // Implementation would get reviews pending moderation
    return { message: 'Feature coming soon' };
  }
}
