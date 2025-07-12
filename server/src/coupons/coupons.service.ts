import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCouponDto, ValidateCouponDto, CouponType } from './dto';

@Injectable()
export class CouponsService {
  constructor(private prisma: PrismaService) {}

  async create(createCouponDto: CreateCouponDto) {
    const { applicableProductIds, applicableCategoryIds, ...couponData } =
      createCouponDto;

    try {
      // Check if coupon code already exists
      const existingCoupon = await this.prisma.coupon.findUnique({
        where: { code: couponData.code.toUpperCase() },
      });

      if (existingCoupon) {
        throw new BadRequestException('Coupon code already exists');
      }

      const coupon = await this.prisma.coupon.create({
        data: {
          ...couponData,
          code: couponData.code.toUpperCase(),
          applicableProducts: applicableProductIds
            ? {
                connect: applicableProductIds.map((id) => ({ id })),
              }
            : undefined,
          applicableCategories: applicableCategoryIds
            ? {
                connect: applicableCategoryIds.map((id) => ({ id })),
              }
            : undefined,
        },
        include: {
          applicableProducts: {
            include: {
              translations: true,
            },
          },
          applicableCategories: {
            include: {
              translations: true,
            },
          },
        },
      });

      return coupon;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to create coupon: ${error.message}`,
      );
    }
  }

  async findAll() {
    return this.prisma.coupon.findMany({
      include: {
        applicableProducts: {
          include: {
            translations: true,
          },
        },
        applicableCategories: {
          include: {
            translations: true,
          },
        },
        _count: {
          select: {
            orders: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const coupon = await this.prisma.coupon.findUnique({
      where: { id },
      include: {
        applicableProducts: {
          include: {
            translations: true,
          },
        },
        applicableCategories: {
          include: {
            translations: true,
          },
        },
        orders: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 10,
        },
        _count: {
          select: {
            orders: true,
          },
        },
      },
    });

    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }

    return coupon;
  }

  async validateCoupon(userId: string, validateCouponDto: ValidateCouponDto) {
    const { code, orderAmount, productIds = [] } = validateCouponDto;

    try {
      const coupon = await this.prisma.coupon.findUnique({
        where: {
          code: code.toUpperCase(),
          isActive: true,
        },
        include: {
          applicableProducts: true,
          applicableCategories: true,
          orders: {
            where: { userId },
          },
        },
      });

      if (!coupon) {
        throw new NotFoundException('Invalid coupon code');
      }

      const now = new Date();

      // Check date validity
      if (now < coupon.startDate || now > coupon.endDate) {
        throw new BadRequestException(
          'Coupon has expired or is not yet active',
        );
      }

      // Check usage limits
      if (coupon.usageLimit && coupon.usageLimit <= coupon.totalUsage) {
        throw new BadRequestException('Coupon usage limit exceeded');
      }

      if (
        coupon.usageLimitPerUser &&
        coupon.orders.length >= coupon.usageLimitPerUser
      ) {
        throw new BadRequestException(
          'You have exceeded the usage limit for this coupon',
        );
      }

      // Check minimum amount - Convert Decimal to number
      if (
        coupon.minimumAmount &&
        orderAmount < coupon.minimumAmount.toNumber()
      ) {
        throw new BadRequestException(
          `Minimum order amount of $${coupon.minimumAmount.toNumber()} required`,
        );
      }

      // Check product/category restrictions
      if (coupon.applicableProducts.length > 0) {
        const applicableProductIds = coupon.applicableProducts.map((p) => p.id);
        const hasApplicableProduct = productIds.some((id) =>
          applicableProductIds.includes(id),
        );

        if (!hasApplicableProduct) {
          throw new BadRequestException(
            'Coupon is not applicable to items in your cart',
          );
        }
      }

      if (coupon.applicableCategories.length > 0) {
        // Would need to check product categories here
        // This is a simplified version
      }

      // Calculate discount - Convert Decimal values to numbers
      let discountAmount = 0;

      switch (coupon.type) {
        case CouponType.PERCENTAGE:
          discountAmount = (orderAmount * coupon.value.toNumber()) / 100;
          if (coupon.maximumDiscount) {
            discountAmount = Math.min(
              discountAmount,
              coupon.maximumDiscount.toNumber(),
            );
          }
          break;
        case CouponType.FIXED_AMOUNT:
          discountAmount = Math.min(coupon.value.toNumber(), orderAmount);
          break;
        case CouponType.FREE_SHIPPING:
          discountAmount = 0; // Shipping discount handled separately
          break;
      }

      return {
        valid: true,
        coupon: {
          id: coupon.id,
          code: coupon.code,
          type: coupon.type,
          value: coupon.value.toNumber(), // Convert to number for response
          description: coupon.description,
        },
        discount: {
          amount: discountAmount,
          type: coupon.type,
          freeShipping: coupon.type === CouponType.FREE_SHIPPING,
        },
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to validate coupon: ${error.message}`,
      );
    }
  }

  async applyCoupon(userId: string, orderId: string, couponCode: string) {
    try {
      const order = await this.prisma.order.findUnique({
        where: { id: orderId, userId },
      });

      if (!order) {
        throw new NotFoundException('Order not found');
      }

      const coupon = await this.prisma.coupon.findUnique({
        where: { code: couponCode.toUpperCase() },
      });

      if (!coupon) {
        throw new NotFoundException('Coupon not found');
      }

      // Update coupon usage
      await this.prisma.coupon.update({
        where: { id: coupon.id },
        data: {
          totalUsage: {
            increment: 1,
          },
        },
      });

      return { message: 'Coupon applied successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to apply coupon: ${error.message}`);
    }
  }

  async remove(id: string) {
    try {
      const coupon = await this.prisma.coupon.findUnique({
        where: { id },
        include: {
          _count: {
            select: {
              orders: true,
            },
          },
        },
      });

      if (!coupon) {
        throw new NotFoundException('Coupon not found');
      }

      if (coupon._count.orders > 0) {
        // Deactivate instead of delete if it has been used
        return this.prisma.coupon.update({
          where: { id },
          data: {
            isActive: false,
            updatedAt: new Date(),
          },
        });
      } else {
        await this.prisma.coupon.delete({
          where: { id },
        });
        return { message: 'Coupon deleted successfully' };
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to delete coupon: ${error.message}`,
      );
    }
  }
}
