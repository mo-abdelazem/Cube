// src/products/products.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException, // Added missing import
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import {
  UpdateProductDto,
  UpdateProductStatusDto, // Added missing import
  BulkProductActionDto, // Added missing import
} from './dto/update-product.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    const { translations, optionIds, variants, images, ...productData } =
      createProductDto;

    try {
      const product = await this.prisma.product.create({
        data: {
          ...productData,
          translations: {
            create: Object.entries(translations).map(([language, data]) => ({
              language,
              name: data.name,
              description: data.description,
              shortDesc: data.shortDesc,
              metaTitle: data.metaTitle,
              metaDesc: data.metaDesc,
            })),
          },
          options: optionIds
            ? {
                create: optionIds.map((optionId) => ({
                  optionId,
                  required: true,
                })),
              }
            : undefined,
          images: images
            ? {
                create: images.map((image) => ({
                  url: image,
                })),
              }
            : undefined,
        },
        include: {
          translations: true,
          category: {
            include: {
              translations: true,
            },
          },
          images: true,
          options: {
            include: {
              option: {
                include: {
                  translations: true,
                  values: {
                    include: {
                      translations: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      // Create variants if provided
      if (variants && variants.length > 0) {
        for (const variantData of variants) {
          const { optionValueIds, dimensions, images, ...variant } = variantData;

          // Prepare the variant data with proper JSON handling
          const variantCreateData: Prisma.ProductVariantCreateInput = {
            ...variant,
            product: {
              connect: { id: product.id },
            },
            // Handle dimensions properly - use undefined instead of null
            ...(dimensions && {
              dimensions: dimensions as Prisma.InputJsonValue,
            }),
            options:
              optionValueIds.length > 0
                ? {
                    create: optionValueIds.map((optionValueId) => ({
                      optionValue: {
                        connect: { id: optionValueId },
                      },
                    })),
                  }
                : undefined,
            images: images
              ? {
                  create: images.map((image) => ({
                    url: image,
                  })),
                }
              : undefined,
          };

          await this.prisma.productVariant.create({
            data: variantCreateData,
          });
        }
      } else {
        // Create a default variant for products without explicit variants
        await this.prisma.productVariant.create({
          data: {
            product: {
              connect: { id: product.id },
            },
            sku: `${productData.sku}-DEFAULT`,
            price: productData.basePrice,
            stock: 0,
            isDefault: true,
          },
        });
      }

      return this.findOne(product.slug);
    } catch (error) {
      throw new BadRequestException(
        `Failed to create product: ${error.message}`,
      );
    }
  }

  async findAll(page = 1, limit = 20, search?: string, categoryId?: string) {
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {
      isActive: true,
    };

    if (search) {
      where.translations = {
        some: {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
      };
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: {
          translations: true,
          category: {
            include: {
              translations: true,
            },
          },
          images: true,
          variants: {
            where: {
              isActive: true,
            },
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
            orderBy: [{ isDefault: 'desc' }, { price: 'asc' }],
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data: products.map((product) => this.transformProductResponse(product)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        translations: true,
        category: {
          include: {
            translations: true,
          },
        },
        images: true,
        variants: {
          where: {
            isActive: true,
          },
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
          orderBy: [{ isDefault: 'desc' }, { price: 'asc' }],
        },
        options: {
          include: {
            option: {
              include: {
                translations: true,
                values: {
                  include: {
                    translations: true,
                  },
                  orderBy: {
                    position: 'asc',
                  },
                },
              },
            },
          },
          orderBy: {
            option: {
              position: 'asc',
            },
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.transformProductResponse(product);
  }

  async findVariant(variantId: string) {
    const variant = await this.prisma.productVariant.findUnique({
      where: { id: variantId },
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
    });

    if (!variant) {
      throw new NotFoundException('Product variant not found');
    }

    return variant;
  }

  async findFeatured(limit = 10) {
    const products = await this.prisma.product.findMany({
      where: {
        isActive: true,
        isFeatured: true,
      },
      take: limit,
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

    return products.map((product) => this.transformProductResponse(product));
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const { translations, ...productData } = updateProductDto;

    try {
      // Check if product exists
      const existingProduct = await this.prisma.product.findUnique({
        where: { id },
      });

      if (!existingProduct) {
        throw new NotFoundException('Product not found');
      }

      // Update product
      const product = await this.prisma.product.update({
        where: { id },
        data: {
          ...productData,
          updatedAt: new Date(),
        },
        include: {
          translations: true,
          category: {
            include: {
              translations: true,
            },
          },
          images: true,
          variants: {
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
      });

      // Update translations if provided
      if (translations) {
        for (const [language, data] of Object.entries(translations)) {
          // Validate required fields
          if (!data.name) {
            throw new BadRequestException(
              `Translation name is required for language: ${language}`,
            );
          }

          await this.prisma.productTranslation.upsert({
            where: {
              productId_language: {
                productId: id,
                language,
              },
            },
            update: {
              name: data.name,
              description: data.description,
              shortDesc: data.shortDesc,
              metaTitle: data.metaTitle,
              metaDesc: data.metaDesc,
              updatedAt: new Date(),
            },
            create: {
              productId: id,
              language,
              name: data.name,
              description: data.description,
              shortDesc: data.shortDesc,
              metaTitle: data.metaTitle,
              metaDesc: data.metaDesc,
            },
          });
        }
      }

      return this.findOne(product.slug);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to update product: ${error.message}`,
      );
    }
  }

  async remove(id: string) {
    try {
      // Check if product exists
      const existingProduct = await this.prisma.product.findUnique({
        where: { id },
        include: {
          variants: true,
          orderItems: true,
        },
      });

      if (!existingProduct) {
        throw new NotFoundException('Product not found');
      }

      // Check if product has been ordered
      if (existingProduct.orderItems.length > 0) {
        throw new ForbiddenException(
          'Cannot delete product that has been ordered. Consider deactivating instead.',
        );
      }

      // Delete product and all related data (cascading delete)
      await this.prisma.product.delete({
        where: { id },
      });

      return { message: 'Product deleted successfully' };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to delete product: ${error.message}`,
      );
    }
  }

  async updateStatus(id: string, updateStatusDto: UpdateProductStatusDto) {
    try {
      const product = await this.prisma.product.update({
        where: { id },
        data: {
          isActive: updateStatusDto.isActive,
          ...(updateStatusDto.isFeatured !== undefined && {
            isFeatured: updateStatusDto.isFeatured,
          }),
          updatedAt: new Date(),
        },
        include: {
          translations: true,
        },
      });

      return product;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Product not found');
      }
      throw new BadRequestException(
        `Failed to update product status: ${error.message}`,
      );
    }
  }

  async bulkAction(bulkActionDto: BulkProductActionDto) {
    const { productIds, action } = bulkActionDto;

    try {
      let updateData: any = {};
      let result;

      switch (action) {
        case 'activate':
          updateData = { isActive: true };
          break;
        case 'deactivate':
          updateData = { isActive: false };
          break;
        case 'feature':
          updateData = { isFeatured: true };
          break;
        case 'unfeature':
          updateData = { isFeatured: false };
          break;
        case 'delete':
          // Check if any products have orders
          const productsWithOrders = await this.prisma.product.findMany({
            where: {
              id: { in: productIds },
              orderItems: {
                some: {},
              },
            },
            select: { id: true, sku: true },
          });

          if (productsWithOrders.length > 0) {
            throw new ForbiddenException(
              `Cannot delete products that have been ordered: ${productsWithOrders.map((p) => p.sku).join(', ')}`,
            );
          }

          result = await this.prisma.product.deleteMany({
            where: {
              id: { in: productIds },
            },
          });

          return {
            message: `${result.count} products deleted successfully`,
            deletedCount: result.count,
          };
      }

      // Since 'delete' case returns early, we can safely update here
      result = await this.prisma.product.updateMany({
        where: {
          id: { in: productIds },
        },
        data: {
          ...updateData,
          updatedAt: new Date(),
        },
      });

      return {
        message: `${result.count} products updated successfully`,
        updatedCount: result.count,
        action,
      };
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new BadRequestException(`Bulk action failed: ${error.message}`);
    }
  }

  async getLowStockProducts(threshold = 10) {
    const lowStockVariants = await this.prisma.productVariant.findMany({
      where: {
        stock: {
          lte: threshold,
        },
        isActive: true,
      },
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

    return lowStockVariants.map((variant) => ({
      id: variant.id,
      sku: variant.sku,
      stock: variant.stock,
      price: variant.price,
      product: variant.product,
      options: variant.options.map((vo) => ({
        optionName: vo.optionValue.option.name,
        value: vo.optionValue.value,
      })),
    }));
  }

  private transformProductResponse(product: any) {
    return {
      ...product,
      variants: product.variants?.map((variant: any) => ({
        ...variant,
        options: variant.options?.map((vo: any) => ({
          id: vo.optionValue.id,
          optionName: vo.optionValue.option.name,
          optionSlug: vo.optionValue.option.slug,
          value: vo.optionValue.value,
          slug: vo.optionValue.slug,
          hexColor: vo.optionValue.hexColor,
          translations: vo.optionValue.translations,
        })),
      })),
      availableOptions: product.options?.map((po: any) => ({
        id: po.option.id,
        name: po.option.name,
        slug: po.option.slug,
        required: po.required,
        translations: po.option.translations,
        values: po.option.values.map((value: any) => ({
          id: value.id,
          value: value.value,
          slug: value.slug,
          hexColor: value.hexColor,
          translations: value.translations,
        })),
      })),
    };
  }
}
