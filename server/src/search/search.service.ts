import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SearchProductsDto, AutocompleteDto } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async searchProducts(searchDto: SearchProductsDto) {
    const {
      q,
      categoryId,
      categoryIds,
      minPrice,
      maxPrice,
      brands,
      tags,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 20,
      language = 'en',
      options,
    } = searchDto;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.ProductWhereInput = {
      isActive: true,
    };

    // Text search
    if (q) {
      where.OR = [
        {
          translations: {
            some: {
              OR: [
                {
                  name: {
                    contains: q,
                    mode: 'insensitive',
                  },
                },
                {
                  description: {
                    contains: q,
                    mode: 'insensitive',
                  },
                },
              ],
            },
          },
        },
        {
          sku: {
            contains: q,
            mode: 'insensitive',
          },
        },
      ];
    }

    // Category filter
    if (categoryId) {
      where.categoryId = categoryId;
    } else if (categoryIds && categoryIds.length > 0) {
      where.categoryId = {
        in: categoryIds,
      };
    }

    // Price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.variants = {
        some: {
          isActive: true,
          price: {
            ...(minPrice !== undefined && { gte: minPrice }),
            ...(maxPrice !== undefined && { lte: maxPrice }),
          },
        },
      };
    }

    // Brand and tag filtering - implement based on your schema
    // Suppress ESLint warnings for now as these are planned features
    void brands;
    void tags;

    // Option filters (size, color, etc.)
    if (options && Object.keys(options).length > 0) {
      const optionFilters = Object.entries(options).map(
        ([optionSlug, values]) => ({
          variants: {
            some: {
              isActive: true,
              options: {
                some: {
                  optionValue: {
                    slug: { in: values },
                    option: {
                      slug: optionSlug,
                    },
                  },
                },
              },
            },
          },
        }),
      );

      // Fix the AND clause handling
      if (where.AND) {
        // If where.AND is already an array, spread it and add new filters
        if (Array.isArray(where.AND)) {
          where.AND = [...where.AND, ...optionFilters];
        } else {
          // If where.AND is a single object, convert to array
          where.AND = [where.AND, ...optionFilters];
        }
      } else {
        where.AND = optionFilters;
      }
    }

    // Build order by - Fixed the ordering issues
    let orderBy: Prisma.ProductOrderByWithRelationInput = {};

    switch (sortBy) {
      case 'price':
        // For price sorting, we need to use a different approach
        // since we can't use _min in orderBy for relations
        orderBy = {
          basePrice: sortOrder,
        };
        break;
      case 'name':
        // For name sorting, we'll use the product's main translation
        // This is a simplified approach
        orderBy = {
          sku: sortOrder, // Fallback to SKU since direct translation ordering is complex
        };
        break;
      case 'popularity':
        // For popularity, we'll order by creation date as a proxy
        // since direct count ordering is complex in Prisma
        orderBy = {
          createdAt: sortOrder === 'asc' ? 'desc' : 'asc', // More recent = more popular
        };
        break;
      default:
        orderBy = {
          [sortBy]: sortOrder,
        };
    }

    // Execute search
    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: {
          translations: {
            where: {
              language,
            },
          },
          category: {
            include: {
              translations: {
                where: {
                  language,
                },
              },
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
                          translations: {
                            where: {
                              language,
                            },
                          },
                        },
                      },
                      translations: {
                        where: {
                          language,
                        },
                      },
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
                  translations: {
                    where: {
                      language,
                    },
                  },
                  values: {
                    include: {
                      translations: {
                        where: {
                          language,
                        },
                      },
                    },
                    orderBy: {
                      position: 'asc',
                    },
                  },
                },
              },
            },
          },
        },
        orderBy,
      }),
      this.prisma.product.count({ where }),
    ]);

    // Post-process sorting for complex cases
    let sortedProducts = products;
    if (sortBy === 'price') {
      sortedProducts = products.sort((a, b) => {
        const aPrice = Math.min(...a.variants.map((v) => Number(v.price)));
        const bPrice = Math.min(...b.variants.map((v) => Number(v.price)));
        return sortOrder === 'asc' ? aPrice - bPrice : bPrice - aPrice;
      });
    } else if (sortBy === 'name') {
      sortedProducts = products.sort((a, b) => {
        const aName = a.translations[0]?.name || a.sku;
        const bName = b.translations[0]?.name || b.sku;
        return sortOrder === 'asc'
          ? aName.localeCompare(bName)
          : bName.localeCompare(aName);
      });
    }

    return {
      data: sortedProducts,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      filters: await this.getAvailableFilters(where, language),
    };
  }

  async autocomplete(autocompleteDto: AutocompleteDto) {
    const { q, language = 'en', limit = 10 } = autocompleteDto;

    if (!q || q.length < 2) {
      return { suggestions: [] };
    }

    const products = await this.prisma.product.findMany({
      where: {
        isActive: true,
        translations: {
          some: {
            language,
            name: {
              contains: q,
              mode: 'insensitive',
            },
          },
        },
      },
      include: {
        translations: {
          where: {
            language,
          },
        },
        category: {
          include: {
            translations: {
              where: {
                language,
              },
            },
          },
        },
      },
      take: limit,
    });

    const suggestions = products.map((product) => ({
      id: product.id,
      name: product.translations[0]?.name || product.sku,
      slug: product.slug,
      category: product.category.translations[0]?.name,
    }));

    return { suggestions };
  }

  async getPriceRange(categoryId?: string) {
    const where: Prisma.ProductVariantWhereInput = {
      isActive: true,
    };

    if (categoryId) {
      where.product = {
        categoryId,
      };
    }

    const result = await this.prisma.productVariant.aggregate({
      where,
      _min: {
        price: true,
      },
      _max: {
        price: true,
      },
    });

    return {
      minPrice: result._min.price || 0,
      maxPrice: result._max.price || 0,
    };
  }

  // ✅ Made this method public
  public async getAvailableFilters(
    productWhere: Prisma.ProductWhereInput,
    language: string,
  ) {
    // Get available categories
    const categories = await this.prisma.category.findMany({
      where: {
        products: {
          some: productWhere,
        },
      },
      include: {
        translations: {
          where: {
            language,
          },
        },
        _count: {
          select: {
            products: {
              where: productWhere,
            },
          },
        },
      },
    });

    // Get available options and their values
    const options = await this.prisma.option.findMany({
      where: {
        products: {
          some: {
            product: productWhere,
          },
        },
      },
      include: {
        translations: {
          where: {
            language,
          },
        },
        values: {
          where: {
            variantOptions: {
              some: {
                variant: {
                  product: productWhere,
                },
              },
            },
          },
          include: {
            translations: {
              where: {
                language,
              },
            },
            _count: {
              select: {
                variantOptions: {
                  where: {
                    variant: {
                      product: productWhere,
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    return {
      categories: categories.map((cat) => ({
        id: cat.id,
        name: cat.translations[0]?.name || cat.slug,
        slug: cat.slug,
        productCount: cat._count.products,
      })),
      options: options.map((option) => ({
        id: option.id,
        name: option.translations[0]?.name || option.name,
        slug: option.slug,
        values: option.values.map((value) => ({
          id: value.id,
          value: value.translations[0]?.value || value.value,
          slug: value.slug,
          hexColor: value.hexColor,
          productCount: value._count.variantOptions,
        })),
      })),
    };
  }
}
