import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateReviewDto, UpdateReviewDto } from './dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async createReview(
    userId: string,
    productId: string,
    createReviewDto: CreateReviewDto,
  ) {
    try {
      // Check if product exists
      const product = await this.prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        throw new NotFoundException('Product not found');
      }

      // Check if user has purchased this product
      const hasPurchased = await this.prisma.orderItem.findFirst({
        where: {
          productId,
          order: {
            userId,
            status: 'DELIVERED',
          },
        },
      });

      if (!hasPurchased) {
        throw new ForbiddenException(
          'You can only review products you have purchased',
        );
      }

      // Check if user has already reviewed this product
      const existingReview = await this.prisma.review.findFirst({
        where: {
          userId,
          productId,
        },
      });

      if (existingReview) {
        throw new BadRequestException('You have already reviewed this product');
      }

      const review = await this.prisma.review.create({
        data: {
          userId,
          productId,
          ...createReviewDto,
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          productVariant: {
            include: {
              options: {
                include: {
                  optionValue: {
                    include: {
                      option: {
                        include: {
                          translations: true,
                        },
                      },
                      translations: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      // Update product average rating
      await this.updateProductRating(productId);

      return review;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to create review: ${error.message}`,
      );
    }
  }

  async getProductReviews(productId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [reviews, total, summary] = await Promise.all([
      this.prisma.review.findMany({
        where: { productId },
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          productVariant: {
            include: {
              options: {
                include: {
                  optionValue: {
                    include: {
                      option: {
                        include: {
                          translations: true,
                        },
                      },
                      translations: true,
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.review.count({
        where: { productId },
      }),
      this.prisma.review.groupBy({
        by: ['rating'],
        where: { productId },
        _count: {
          rating: true,
        },
      }),
    ]);

    const ratingDistribution = [1, 2, 3, 4, 5].map((rating) => {
      const found = summary.find((s) => s.rating === rating);
      return {
        rating,
        count: found?._count.rating || 0,
      };
    });

    const averageRating =
      total > 0
        ? summary.reduce(
            (sum, item) => sum + item.rating * item._count.rating,
            0,
          ) / total
        : 0;

    return {
      data: reviews,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      summary: {
        averageRating: Math.round(averageRating * 10) / 10,
        totalReviews: total,
        ratingDistribution,
      },
    };
  }

  async updateReview(
    userId: string,
    reviewId: string,
    updateReviewDto: UpdateReviewDto,
  ) {
    try {
      const existingReview = await this.prisma.review.findFirst({
        where: {
          id: reviewId,
          userId,
        },
      });

      if (!existingReview) {
        throw new NotFoundException('Review not found');
      }

      const review = await this.prisma.review.update({
        where: { id: reviewId },
        data: {
          ...updateReviewDto,
          updatedAt: new Date(),
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      // Update product average rating
      await this.updateProductRating(existingReview.productId);

      return review;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to update review: ${error.message}`,
      );
    }
  }

  async deleteReview(userId: string, reviewId: string) {
    try {
      const existingReview = await this.prisma.review.findFirst({
        where: {
          id: reviewId,
          userId,
        },
      });

      if (!existingReview) {
        throw new NotFoundException('Review not found');
      }

      await this.prisma.review.delete({
        where: { id: reviewId },
      });

      // Update product average rating
      await this.updateProductRating(existingReview.productId);

      return { message: 'Review deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to delete review: ${error.message}`,
      );
    }
  }

  private async updateProductRating(productId: string) {
    const result = await this.prisma.review.aggregate({
      where: { productId },
      _avg: {
        rating: true,
      },
      _count: {
        rating: true,
      },
    });

    await this.prisma.product.update({
      where: { id: productId },
      data: {
        averageRating: result._avg.rating || 0,
        reviewCount: result._count.rating,
      },
    });
  }
}
