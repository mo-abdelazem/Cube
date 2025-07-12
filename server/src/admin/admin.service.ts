import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const [
      totalProducts,
      totalUsers,
      totalOrders,
      totalRevenue,
      pendingOrders,
      lowStockProducts,
      recentOrders,
      topProducts,
    ] = await Promise.all([
      this.prisma.product.count({ where: { isActive: true } }),
      this.prisma.user.count(),
      this.prisma.order.count(),
      this.prisma.order.aggregate({
        _sum: { total: true },
        where: { status: { not: 'CANCELLED' } },
      }),
      this.prisma.order.count({ where: { status: 'PENDING' } }),
      this.prisma.productVariant.count({ where: { stock: { lte: 10 } } }),
      this.prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      }),
      this.prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: { quantity: true },
        _count: { productId: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 10,
      }),
    ]);

    // Get product details for top products
    const topProductsWithDetails = await Promise.all(
      topProducts.map(async (item) => {
        const product = await this.prisma.product.findUnique({
          where: { id: item.productId },
          include: {
            translations: true,
            images: true,
          },
        });
        return {
          ...product,
          totalSold: item._sum.quantity,
          orderCount: item._count.productId,
        };
      }),
    );

    return {
      overview: {
        totalProducts,
        totalUsers,
        totalOrders,
        totalRevenue: totalRevenue._sum.total || 0,
        pendingOrders,
        lowStockProducts,
      },
      recentOrders,
      topProducts: topProductsWithDetails,
    };
  }

  async getSalesReport(startDate?: Date, endDate?: Date) {
    const where: any = {
      status: { not: 'CANCELLED' },
    };

    if (startDate && endDate) {
      where.createdAt = {
        gte: startDate,
        lte: endDate,
      };
    }

    const [orders, dailySales, monthlySales] = await Promise.all([
      this.prisma.order.findMany({
        where,
        include: {
          items: {
            include: {
              product: {
                include: {
                  translations: true,
                  category: {
                    include: {
                      translations: true,
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.$queryRaw`
        SELECT DATE(created_at) as date, COUNT(*) as order_count, SUM(total) as revenue
        FROM orders 
        WHERE status != 'CANCELLED'
        ${startDate && endDate ? `AND created_at BETWEEN ${startDate} AND ${endDate}` : ''}
        GROUP BY DATE(created_at)
        ORDER BY date DESC
        LIMIT 30
      `,
      this.prisma.$queryRaw`
        SELECT DATE_TRUNC('month', created_at) as month, COUNT(*) as order_count, SUM(total) as revenue
        FROM orders 
        WHERE status != 'CANCELLED'
        GROUP BY DATE_TRUNC('month', created_at)
        ORDER BY month DESC
        LIMIT 12
      `,
    ]);

    return {
      orders,
      dailySales,
      monthlySales,
      summary: {
        totalOrders: orders.length,
        totalRevenue: orders.reduce(
          (sum, order) => sum + Number(order.total),
          0,
        ),
        averageOrderValue:
          orders.length > 0
            ? orders.reduce((sum, order) => sum + Number(order.total), 0) /
              orders.length
            : 0,
      },
    };
  }

  async getCustomerAnalytics() {
    const [
      totalCustomers,
      newCustomersThisMonth,
      topCustomers,
      customersByLocation,
    ] = await Promise.all([
      this.prisma.user.count({ where: { role: 'CUSTOMER' } }),
      this.prisma.user.count({
        where: {
          role: 'CUSTOMER',
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
      this.prisma.user.findMany({
        where: { role: 'CUSTOMER' },
        include: {
          orders: {
            where: { status: { not: 'CANCELLED' } },
          },
          _count: {
            select: {
              orders: {
                where: { status: { not: 'CANCELLED' } },
              },
            },
          },
        },
        orderBy: {
          orders: {
            _count: 'desc',
          },
        },
        take: 10,
      }),
      this.prisma.$queryRaw`
        SELECT country, COUNT(*) as customer_count
        FROM users 
        WHERE role = 'CUSTOMER'
        GROUP BY country
        ORDER BY customer_count DESC
        LIMIT 10
      `,
    ]);

    return {
      summary: {
        totalCustomers,
        newCustomersThisMonth,
      },
      topCustomers: topCustomers.map((customer) => ({
        ...customer,
        totalSpent: customer.orders.reduce(
          (sum, order) => sum + Number(order.total),
          0,
        ),
        orderCount: customer._count.orders,
      })),
      customersByLocation,
    };
  }
}
