import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CalculateShippingDto } from './dto';

// Define interface for dimensions to fix type safety
interface PackageDimensions {
  length?: number;
  width?: number;
  height?: number;
}

@Injectable()
export class ShippingService {
  constructor(private prisma: PrismaService) {}

  async calculateShipping(calculateShippingDto: CalculateShippingDto) {
    const {
      items,
      destinationCountry,
      destinationState,
      shippingMethod = 'standard',
    } = calculateShippingDto;

    try {
      // Get variant details for weight and dimensions
      const variantIds = items.map((item) => item.productVariantId);
      const variants = await this.prisma.productVariant.findMany({
        where: {
          id: { in: variantIds },
          isActive: true,
        },
        include: {
          product: {
            include: {
              translations: true,
            },
          },
        },
      });

      if (variants.length !== variantIds.length) {
        throw new BadRequestException('One or more product variants not found');
      }

      // Calculate total weight and dimensions
      let totalWeight = 0;
      let totalValue = 0;
      const packageDimensions = { length: 0, width: 0, height: 0 };

      items.forEach((item) => {
        const variant = variants.find((v) => v.id === item.productVariantId);
        if (variant) {
          // ✅ Fix: Properly convert weight to number
          const weight = Number(variant.weight) || 500; // Default 500g per item
          totalWeight += weight * item.quantity;

          totalValue += Number(variant.price) * item.quantity;

          if (variant.dimensions) {
            // ✅ Fix: Properly type the dimensions instead of using 'any'
            const dims = variant.dimensions as PackageDimensions;
            packageDimensions.length = Math.max(
              packageDimensions.length,
              Number(dims.length) || 0,
            );
            packageDimensions.width = Math.max(
              packageDimensions.width,
              Number(dims.width) || 0,
            );
            packageDimensions.height +=
              (Number(dims.height) || 5) * item.quantity;
          }
        }
      });

      // Shipping rate calculation (simplified)
      const baseRates = {
        domestic: {
          standard: 5.99,
          express: 12.99,
          overnight: 24.99,
        },
        international: {
          standard: 15.99,
          express: 29.99,
          overnight: 49.99,
        },
      };

      const isDomestic = destinationCountry === 'US';
      const rateType = isDomestic ? 'domestic' : 'international';
      let baseRate = baseRates[rateType][shippingMethod];

      // State-specific adjustments (using destinationState)
      if (destinationState && isDomestic) {
        // Example: Alaska and Hawaii have higher shipping costs
        const highCostStates = ['AK', 'HI'];
        if (highCostStates.includes(destinationState)) {
          baseRate *= 1.3; // 30% increase for remote states
        }
      }

      // Weight-based adjustments
      if (totalWeight > 2000) {
        // Over 2kg
        baseRate *= 1.5;
      } else if (totalWeight > 1000) {
        // Over 1kg
        baseRate *= 1.2;
      }

      // Value-based adjustments (insurance)
      if (totalValue > 500) {
        baseRate += totalValue * 0.01; // 1% insurance
      }

      // Free shipping threshold
      const freeShippingThreshold = isDomestic ? 100 : 200;
      const finalRate = totalValue >= freeShippingThreshold ? 0 : baseRate;

      const estimatedDelivery = this.calculateDeliveryDate(
        shippingMethod,
        isDomestic,
      );

      return {
        shippingOptions: [
          {
            method: 'standard',
            name: 'Standard Shipping',
            rate: isDomestic ? 5.99 : 15.99,
            estimatedDays: isDomestic ? '5-7' : '10-15',
            estimatedDelivery: this.calculateDeliveryDate(
              'standard',
              isDomestic,
            ),
          },
          {
            method: 'express',
            name: 'Express Shipping',
            rate: isDomestic ? 12.99 : 29.99,
            estimatedDays: isDomestic ? '2-3' : '5-7',
            estimatedDelivery: this.calculateDeliveryDate(
              'express',
              isDomestic,
            ),
          },
          {
            method: 'overnight',
            name: 'Overnight Shipping',
            rate: isDomestic ? 24.99 : 49.99,
            estimatedDays: isDomestic ? '1' : '2-3',
            estimatedDelivery: this.calculateDeliveryDate(
              'overnight',
              isDomestic,
            ),
          },
        ],
        recommended: {
          method: shippingMethod,
          rate: finalRate,
          originalRate: baseRate,
          savings: baseRate - finalRate,
          estimatedDelivery,
          freeShippingEligible: totalValue >= freeShippingThreshold,
          freeShippingThreshold,
        },
        packageInfo: {
          totalWeight,
          totalValue,
          dimensions: packageDimensions,
          itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
        },
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      // ✅ Fix: Properly handle error typing
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(
        `Failed to calculate shipping: ${errorMessage}`,
      );
    }
  }

  private calculateDeliveryDate(method: string, isDomestic: boolean): Date {
    const today = new Date();
    let daysToAdd = 7; // Default

    switch (method) {
      case 'standard':
        daysToAdd = isDomestic ? 7 : 15;
        break;
      case 'express':
        daysToAdd = isDomestic ? 3 : 7;
        break;
      case 'overnight':
        daysToAdd = isDomestic ? 1 : 3;
        break;
    }

    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + daysToAdd);
    return deliveryDate;
  }
}
