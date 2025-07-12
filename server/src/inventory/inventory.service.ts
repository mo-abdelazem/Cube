import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BulkStockAdjustmentDto, UpdateVariantStockDto } from './dto';

// Define the adjustment result type
export interface AdjustmentResult {
  variantId: string;
  previousStock: number;
  newStock: number;
  adjustment: number;
}

// Define the bulk adjustment response type
export interface BulkAdjustmentResponse {
  message: string;
  results: AdjustmentResult[];
}

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  async updateVariantStock(
    variantId: string,
    updateStockDto: UpdateVariantStockDto,
  ) {
    try {
      const variant = await this.prisma.productVariant.findUnique({
        where: { id: variantId },
        include: {
          product: {
            include: {
              translations: true,
            },
          },
        },
      });

      if (!variant) {
        throw new NotFoundException('Product variant not found');
      }

      const updatedVariant = await this.prisma.productVariant.update({
        where: { id: variantId },
        data: {
          stock: updateStockDto.stock,
          updatedAt: new Date(),
        },
      });

      // Log stock adjustment
      await this.prisma.stockAdjustment.create({
        data: {
          variantId,
          previousStock: variant.stock,
          newStock: updateStockDto.stock,
          adjustment: updateStockDto.stock - variant.stock,
          reason: updateStockDto.reason || 'Manual adjustment',
          userId: null, // Would be set from request context in real implementation
        },
      });

      return updatedVariant;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to update stock: ${error.message}`);
    }
  }

  async bulkStockAdjustment(
    bulkAdjustmentDto: BulkStockAdjustmentDto,
  ): Promise<BulkAdjustmentResponse> {
    const { adjustments, notes } = bulkAdjustmentDto;

    try {
      const results = await this.prisma.$transaction(async (tx) => {
        // Explicitly type the adjustmentResults array
        const adjustmentResults: AdjustmentResult[] = [];

        for (const adjustment of adjustments) {
          // Get current variant
          const variant = await tx.productVariant.findUnique({
            where: { id: adjustment.variantId },
          });

          if (!variant) {
            throw new NotFoundException(
              `Variant ${adjustment.variantId} not found`,
            );
          }

          const previousStock = variant.stock;
          const newStock = adjustment.quantity;

          // Update variant stock
          const updatedVariant = await tx.productVariant.update({
            where: { id: adjustment.variantId },
            data: {
              stock: newStock,
              updatedAt: new Date(),
            },
          });

          // Log adjustment
          await tx.stockAdjustment.create({
            data: {
              variantId: adjustment.variantId,
              previousStock,
              newStock,
              adjustment: newStock - previousStock,
              reason: adjustment.reason || 'Bulk adjustment',
              notes,
              userId: null,
            },
          });

          adjustmentResults.push({
            variantId: adjustment.variantId,
            previousStock,
            newStock,
            adjustment: newStock - previousStock,
          });
        }

        return adjustmentResults;
      });

      return {
        message: `${results.length} variants updated successfully`,
        results,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Bulk adjustment failed: ${error.message}`);
    }
  }

  async getInventoryReport(categoryId?: string) {
    const where: any = {
      isActive: true,
    };

    if (categoryId) {
      where.product = {
        categoryId,
      };
    }

    const variants = await this.prisma.productVariant.findMany({
      where,
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
      orderBy: {
        stock: 'asc',
      },
    });

    const totalVariants = variants.length;
    const lowStockVariants = variants.filter((v) => v.stock <= 10);
    const outOfStockVariants = variants.filter((v) => v.stock === 0);
    const totalValue = variants.reduce(
      (sum, v) => sum + Number(v.price) * v.stock,
      0,
    );

    return {
      summary: {
        totalVariants,
        lowStockCount: lowStockVariants.length,
        outOfStockCount: outOfStockVariants.length,
        totalInventoryValue: totalValue,
      },
      variants: variants.map((variant) => ({
        id: variant.id,
        sku: variant.sku,
        stock: variant.stock,
        price: variant.price,
        value: Number(variant.price) * variant.stock,
        product: variant.product,
        options: variant.options.map((vo) => ({
          optionName: vo.optionValue.option.name,
          value: vo.optionValue.value,
        })),
        status:
          variant.stock === 0
            ? 'OUT_OF_STOCK'
            : variant.stock <= 10
              ? 'LOW_STOCK'
              : 'IN_STOCK',
      })),
    };
  }

  async getStockAdjustmentHistory(variantId?: string, limit = 50) {
    const where = variantId ? { variantId } : {};

    const adjustments = await this.prisma.stockAdjustment.findMany({
      where,
      include: {
        variant: {
          include: {
            product: {
              include: {
                translations: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });

    return adjustments;
  }
}
