import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createOrderDto: CreateOrderDto) {
    const { items, shippingAddress, billingAddress, notes } = createOrderDto;

    // Validate items and gather product/variant information
    const orderItems: any[] = [];
    let subtotal = 0;

    for (const item of items) {
      let variant;
      let product;

      if (item.productVariantId) {
        // Get specific variant
        variant = await this.prisma.productVariant.findUnique({
          where: {
            id: item.productVariantId,
            isActive: true,
          },
          include: {
            product: {
              include: {
                translations: true,
              },
            },
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
        });

        if (!variant) {
          throw new BadRequestException(
            `Product variant ${item.productVariantId} not found or inactive`,
          );
        }

        product = variant.product;

        // Check stock availability
        if (variant.stock < item.quantity) {
          throw new BadRequestException(
            `Insufficient stock for variant ${variant.sku}. Available: ${variant.stock}, Requested: ${item.quantity}`,
          );
        }
      } else {
        // Get product and use default variant
        product = await this.prisma.product.findUnique({
          where: {
            id: item.productId,
            isActive: true,
          },
          include: {
            translations: true,
            variants: {
              where: {
                isActive: true,
                isDefault: true,
              },
            },
          },
        });

        if (!product) {
          throw new BadRequestException(
            `Product ${item.productId} not found or inactive`,
          );
        }

        if (product.hasVariants && !item.productVariantId) {
          throw new BadRequestException(
            `Product ${product.sku} requires variant selection. Please specify productVariantId.`,
          );
        }

        variant = product.variants[0]; // Use default variant

        if (!variant) {
          throw new BadRequestException(
            `No available variant found for product ${product.sku}`,
          );
        }

        // Check stock availability
        if (variant.stock < item.quantity) {
          throw new BadRequestException(
            `Insufficient stock for product ${product.sku}. Available: ${variant.stock}, Requested: ${item.quantity}`,
          );
        }
      }

      const itemPrice = Number(variant.price);
      const itemTotal = itemPrice * item.quantity;
      subtotal += itemTotal;

      // Prepare selected options for storage
      let selectedOptions = item.selectedOptions || {};

      if (variant.options && variant.options.length > 0) {
        // Store variant options for order history
        selectedOptions = variant.options.reduce(
          (acc, vo) => {
            const optionSlug = vo.optionValue.option.slug;
            const valueSlug = vo.optionValue.slug;
            acc[optionSlug] = valueSlug;
            return acc;
          },
          {} as Record<string, string>,
        );
      }

      orderItems.push({
        productId: product.id,
        productVariantId: variant.id,
        quantity: item.quantity,
        price: itemPrice,
        total: itemTotal,
        selectedOptions,
      });
    }

    // Calculate taxes and shipping
    const tax = subtotal * 0.1; // 10% tax
    const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
    const total = subtotal + tax + shipping;

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    try {
      // Create order in a transaction
      const order = await this.prisma.$transaction(async (tx) => {
        // Create the order
        const newOrder = await tx.order.create({
          data: {
            orderNumber,
            userId,
            subtotal,
            tax,
            shipping,
            total,
            shippingAddress,
            billingAddress,
            notes,
            items: {
              create: orderItems,
            },
          },
          include: {
            items: {
              include: {
                product: {
                  include: {
                    translations: true,
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
            },
          },
        });

        // Update variant stock
        for (const item of items) {
          const variantId =
            item.productVariantId ||
            (
              await tx.productVariant.findFirst({
                where: {
                  productId: item.productId,
                  isDefault: true,
                  isActive: true,
                },
              })
            )?.id;

          if (variantId) {
            await tx.productVariant.update({
              where: { id: variantId },
              data: {
                stock: {
                  decrement: item.quantity,
                },
              },
            });
          }
        }

        return newOrder;
      });

      return order;
    } catch (error) {
      throw new BadRequestException(`Failed to create order: ${error.message}`);
    }
  }

  async findUserOrders(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        items: {
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
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string, userId?: string) {
    const where: any = { id };
    if (userId) {
      where.userId = userId;
    }

    const order = await this.prisma.order.findUnique({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        items: {
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
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async updateOrderStatus(orderId: string, status: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return this.prisma.order.update({
      where: { id: orderId },
      data: { status: status as any },
    });
  }

  async getOrderStatistics() {
    const [totalOrders, totalRevenue, pendingOrders] = await Promise.all([
      this.prisma.order.count(),
      this.prisma.order.aggregate({
        _sum: {
          total: true,
        },
      }),
      this.prisma.order.count({
        where: {
          status: 'PENDING',
        },
      }),
    ]);

    return {
      totalOrders,
      totalRevenue: totalRevenue._sum.total || 0,
      pendingOrders,
    };
  }

  async cancelOrder(orderId: string, userId?: string) {
    try {
      const where: any = { id: orderId };
      if (userId) {
        where.userId = userId;
      }

      const order = await this.prisma.order.findUnique({
        where,
        include: {
          items: {
            include: {
              productVariant: true,
            },
          },
        },
      });

      if (!order) {
        throw new NotFoundException('Order not found');
      }

      if (order.status !== 'PENDING' && order.status !== 'PROCESSING') {
        throw new BadRequestException(
          'Order cannot be cancelled at this stage',
        );
      }

      // Update order status
      const updatedOrder = await this.prisma.order.update({
        where: { id: orderId },
        data: {
          status: 'CANCELLED',
          updatedAt: new Date(),
        },
      });

      // Restore stock for cancelled items
      for (const item of order.items) {
        // Check if productVariantId exists and is not null
        if (item.productVariantId && item.productVariant) {
          await this.prisma.productVariant.update({
            where: { id: item.productVariantId },
            data: {
              stock: {
                increment: item.quantity,
              },
            },
          });
        }
      }

      return updatedOrder;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(`Failed to cancel order: ${error.message}`);
    }
  }

  async trackOrder(trackingNumber: string) {
    const order = await this.prisma.order.findUnique({
      where: { orderNumber: trackingNumber },
      include: {
        items: {
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
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Mock tracking information
    const trackingEvents = [
      {
        status: 'Order Placed',
        date: order.createdAt,
        description: 'Your order has been received and is being processed.',
      },
    ];

    if (order.status !== 'PENDING') {
      trackingEvents.push({
        status: 'Processing',
        date: new Date(order.createdAt.getTime() + 24 * 60 * 60 * 1000), // +1 day
        description: 'Your order is being prepared for shipment.',
      });
    }

    if (order.status === 'SHIPPED' || order.status === 'DELIVERED') {
      trackingEvents.push({
        status: 'Shipped',
        date: new Date(order.createdAt.getTime() + 2 * 24 * 60 * 60 * 1000), // +2 days
        description: 'Your order has been shipped and is on its way.',
      });
    }

    if (order.status === 'DELIVERED') {
      trackingEvents.push({
        status: 'Delivered',
        date: new Date(order.createdAt.getTime() + 5 * 24 * 60 * 60 * 1000), // +5 days
        description: 'Your order has been delivered successfully.',
      });
    }

    return {
      order: {
        orderNumber: order.orderNumber,
        status: order.status,
        total: order.total,
        items: order.items,
      },
      trackingEvents,
      estimatedDelivery:
        order.status === 'DELIVERED'
          ? null
          : new Date(order.createdAt.getTime() + 7 * 24 * 60 * 60 * 1000), // +7 days
    };
  }

  async processRefund(orderId: string, amount?: number, reason?: string) {
    try {
      const order = await this.prisma.order.findUnique({
        where: { id: orderId },
      });

      if (!order) {
        throw new NotFoundException('Order not found');
      }

      if (order.status !== 'DELIVERED') {
        throw new BadRequestException('Can only refund delivered orders');
      }

      const refundAmount = amount || Number(order.total);

      // Create refund record
      const refund = await this.prisma.refund.create({
        data: {
          orderId,
          amount: refundAmount,
          reason: reason || 'Customer request',
          status: 'PENDING',
        },
      });

      // Update order status if full refund
      if (refundAmount >= Number(order.total)) {
        await this.prisma.order.update({
          where: { id: orderId },
          data: {
            status: 'REFUNDED',
            updatedAt: new Date(),
          },
        });
      }

      return refund;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to process refund: ${error.message}`,
      );
    }
  }

  async getOrderHistory(userId: string, page = 1, limit = 20, status?: string) {
    const skip = (page - 1) * limit;

    const where: any = { userId };
    if (status) {
      where.status = status;
    }

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        include: {
          items: {
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
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      data: orders,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
