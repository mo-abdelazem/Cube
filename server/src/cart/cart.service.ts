import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AddToCartDto, UpdateCartItemDto } from './dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getCart(userId: string) {
    const cartItems = await this.prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            translations: true,
            images: true,
          },
        },
        productVariant: {
          include: {
            images: true,
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
    });

    const subtotal = cartItems.reduce((sum, item) => {
      const price = item.productVariant?.price || item.product.basePrice;
      return sum + Number(price) * item.quantity;
    }, 0);

    return {
      items: cartItems,
      summary: {
        itemCount: cartItems.length,
        totalQuantity: cartItems.reduce((sum, item) => sum + item.quantity, 0),
        subtotal,
        estimatedTax: subtotal * 0.1,
        estimatedTotal: subtotal * 1.1,
      },
    };
  }

  async addToCart(userId: string, addToCartDto: AddToCartDto) {
    const { productId, productVariantId, quantity, selectedOptions } =
      addToCartDto;

    try {
      // Validate product and variant
      const product = await this.prisma.product.findUnique({
        where: { id: productId, isActive: true },
        include: {
          variants: {
            where: {
              isActive: true,
            },
          },
        },
      });

      if (!product) {
        throw new NotFoundException('Product not found or inactive');
      }

      let variant;
      if (productVariantId) {
        variant = await this.prisma.productVariant.findUnique({
          where: { id: productVariantId, isActive: true },
        });

        if (!variant) {
          throw new NotFoundException('Product variant not found or inactive');
        }

        if (variant.stock < quantity) {
          throw new BadRequestException(
            `Insufficient stock. Available: ${variant.stock}`,
          );
        }
      } else if (product.hasVariants) {
        throw new BadRequestException(
          'This product requires variant selection',
        );
      }

      // Check if item already exists in cart
      const existingCartItem = await this.prisma.cartItem.findFirst({
        where: {
          userId,
          productId,
          productVariantId: productVariantId || null,
        },
      });

      if (existingCartItem) {
        // Update existing item
        const newQuantity = existingCartItem.quantity + quantity;

        if (variant && variant.stock < newQuantity) {
          throw new BadRequestException(
            `Insufficient stock. Available: ${variant.stock}`,
          );
        }

        return this.prisma.cartItem.update({
          where: { id: existingCartItem.id },
          data: {
            quantity: newQuantity,
            selectedOptions,
            updatedAt: new Date(),
          },
          include: {
            product: {
              include: {
                translations: true,
                images: true,
              },
            },
            productVariant: {
              include: {
                images: true,
              },
            },
          },
        });
      } else {
        // Create new cart item
        return this.prisma.cartItem.create({
          data: {
            userId,
            productId,
            productVariantId,
            quantity,
            selectedOptions,
          },
          include: {
            product: {
              include: {
                translations: true,
                images: true,
              },
            },
            productVariant: {
              include: {
                images: true,
              },
            },
          },
        });
      }
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(`Failed to add to cart: ${error.message}`);
    }
  }

  async updateCartItem(
    userId: string,
    itemId: string,
    updateDto: UpdateCartItemDto,
  ) {
    try {
      const cartItem = await this.prisma.cartItem.findFirst({
        where: {
          id: itemId,
          userId,
        },
        include: {
          productVariant: true,
        },
      });

      if (!cartItem) {
        throw new NotFoundException('Cart item not found');
      }

      // Check stock if variant exists
      if (
        cartItem.productVariant &&
        cartItem.productVariant.stock < updateDto.quantity
      ) {
        throw new BadRequestException(
          `Insufficient stock. Available: ${cartItem.productVariant.stock}`,
        );
      }

      return this.prisma.cartItem.update({
        where: { id: itemId },
        data: {
          quantity: updateDto.quantity,
          updatedAt: new Date(),
        },
        include: {
          product: {
            include: {
              translations: true,
              images: true,
            },
          },
          productVariant: {
            include: {
              images: true,
            },
          },
        },
      });
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to update cart item: ${error.message}`,
      );
    }
  }

  async removeCartItem(userId: string, itemId: string) {
    try {
      const cartItem = await this.prisma.cartItem.findFirst({
        where: {
          id: itemId,
          userId,
        },
      });

      if (!cartItem) {
        throw new NotFoundException('Cart item not found');
      }

      await this.prisma.cartItem.delete({
        where: { id: itemId },
      });

      return { message: 'Item removed from cart' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to remove cart item: ${error.message}`,
      );
    }
  }

  async clearCart(userId: string) {
    const result = await this.prisma.cartItem.deleteMany({
      where: { userId },
    });

    return {
      message: 'Cart cleared',
      deletedCount: result.count,
    };
  }
}
