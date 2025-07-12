import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class WishlistService {
  constructor(private prisma: PrismaService) {}

  async getWishlist(userId: string) {
    const wishlistItems = await this.prisma.wishlistItem.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            translations: true,
            images: true,
            variants: {
              where: {
                isActive: true,
                isDefault: true,
              },
              include: {
                images: true,
              },
            },
            category: {
              include: {
                translations: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      items: wishlistItems,
      totalItems: wishlistItems.length,
    };
  }

  async addToWishlist(userId: string, productId: string) {
    try {
      // Check if product exists
      const product = await this.prisma.product.findUnique({
        where: { id: productId, isActive: true },
      });

      if (!product) {
        throw new NotFoundException('Product not found');
      }

      // Check if already in wishlist
      const existingItem = await this.prisma.wishlistItem.findFirst({
        where: {
          userId,
          productId,
        },
      });

      if (existingItem) {
        throw new ConflictException('Product already in wishlist');
      }

      const wishlistItem = await this.prisma.wishlistItem.create({
        data: {
          userId,
          productId,
        },
        include: {
          product: {
            include: {
              translations: true,
              images: true,
            },
          },
        },
      });

      return wishlistItem;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to add to wishlist: ${error.message}`,
      );
    }
  }

  async removeFromWishlist(userId: string, itemId: string) {
    try {
      const wishlistItem = await this.prisma.wishlistItem.findFirst({
        where: {
          id: itemId,
          userId,
        },
      });

      if (!wishlistItem) {
        throw new NotFoundException('Wishlist item not found');
      }

      await this.prisma.wishlistItem.delete({
        where: { id: itemId },
      });

      return { message: 'Item removed from wishlist' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to remove from wishlist: ${error.message}`,
      );
    }
  }
}
