import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const { translations, ...categoryData } = createCategoryDto;

    try {
      // Check if slug already exists
      const existingCategory = await this.prisma.category.findUnique({
        where: { slug: categoryData.slug },
      });

      if (existingCategory) {
        throw new ConflictException('Category with this slug already exists');
      }

      // If parentId is provided, check if parent exists
      if (categoryData.parentId) {
        const parentCategory = await this.prisma.category.findUnique({
          where: { id: categoryData.parentId },
        });

        if (!parentCategory) {
          throw new NotFoundException('Parent category not found');
        }
      }

      const category = await this.prisma.category.create({
        data: {
          ...categoryData,
          translations: {
            create: Object.entries(translations).map(([language, data]) => ({
              language,
              ...data,
            })),
          },
        },
        include: {
          translations: true,
          parent: {
            include: {
              translations: true,
            },
          },
          children: {
            include: {
              translations: true,
            },
          },
          _count: {
            select: {
              products: true,
            },
          },
        },
      });

      return category;
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to create category: ${error.message}`,
      );
    }
  }

  async findAll(includeInactive = false) {
    // Combine the where conditions properly
    const whereCondition = {
      parentId: null, // Only root categories
      ...(includeInactive ? {} : { isActive: true }),
    };

    return this.prisma.category.findMany({
      where: whereCondition,
      include: {
        translations: true,
        children: {
          include: {
            translations: true,
            _count: {
              select: {
                products: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async findOne(slug: string) {
    const category = await this.prisma.category.findUnique({
      where: { slug },
      include: {
        translations: true,
        parent: {
          include: {
            translations: true,
          },
        },
        children: {
          include: {
            translations: true,
            _count: {
              select: {
                products: true,
              },
            },
          },
        },
        products: {
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
          },
          where: {
            isActive: true,
          },
          take: 20, // Limit products in category response
        },
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const { translations, ...categoryData } = updateCategoryDto;

    try {
      // Check if category exists
      const existingCategory = await this.prisma.category.findUnique({
        where: { id },
      });

      if (!existingCategory) {
        throw new NotFoundException('Category not found');
      }

      // Check slug uniqueness if slug is being updated
      if (categoryData.slug && categoryData.slug !== existingCategory.slug) {
        const slugExists = await this.prisma.category.findUnique({
          where: { slug: categoryData.slug },
        });

        if (slugExists) {
          throw new ConflictException('Category with this slug already exists');
        }
      }

      // Check parent validity if parentId is being updated
      if (categoryData.parentId !== undefined) {
        if (categoryData.parentId) {
          // Check if parent exists
          const parentCategory = await this.prisma.category.findUnique({
            where: { id: categoryData.parentId },
          });

          if (!parentCategory) {
            throw new NotFoundException('Parent category not found');
          }

          // Prevent circular reference
          if (categoryData.parentId === id) {
            throw new BadRequestException('Category cannot be its own parent');
          }

          // Check if the parent is a descendant of this category
          const isDescendant = await this.isDescendant(
            id,
            categoryData.parentId,
          );
          if (isDescendant) {
            throw new BadRequestException(
              'Category cannot have its descendant as parent',
            );
          }
        }
      }

      // Update category
      const category = await this.prisma.category.update({
        where: { id },
        data: {
          ...categoryData,
          updatedAt: new Date(),
        },
        include: {
          translations: true,
          parent: {
            include: {
              translations: true,
            },
          },
          children: {
            include: {
              translations: true,
            },
          },
          _count: {
            select: {
              products: true,
            },
          },
        },
      });

      // Update translations if provided
      if (translations) {
        for (const [language, data] of Object.entries(translations)) {
          // Ensure required fields are present
          if (!data.name) {
            throw new BadRequestException(
              `Translation name is required for language: ${language}`,
            );
          }

          await this.prisma.categoryTranslation.upsert({
            where: {
              categoryId_language: {
                categoryId: id,
                language,
              },
            },
            update: {
              name: data.name,
              updatedAt: new Date(),
            },
            create: {
              categoryId: id,
              language,
              name: data.name,
            },
          });
        }
      }

      return category;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to update category: ${error.message}`,
      );
    }
  }

  async remove(id: string) {
    try {
      // Check if category exists
      const existingCategory = await this.prisma.category.findUnique({
        where: { id },
        include: {
          products: true,
          children: true,
        },
      });

      if (!existingCategory) {
        throw new NotFoundException('Category not found');
      }

      // Check if category has products
      if (existingCategory.products.length > 0) {
        throw new BadRequestException(
          'Cannot delete category that contains products. Move products to another category first.',
        );
      }

      // Check if category has subcategories
      if (existingCategory.children.length > 0) {
        throw new BadRequestException(
          'Cannot delete category that has subcategories. Delete or move subcategories first.',
        );
      }

      // Delete category
      await this.prisma.category.delete({
        where: { id },
      });

      return { message: 'Category deleted successfully' };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to delete category: ${error.message}`,
      );
    }
  }

  async getCategoryTree() {
    const categories = await this.prisma.category.findMany({
      include: {
        translations: true,
        children: {
          include: {
            translations: true,
            children: {
              include: {
                translations: true,
                _count: {
                  select: {
                    products: true,
                  },
                },
              },
            },
            _count: {
              select: {
                products: true,
              },
            },
          },
        },
        _count: {
          select: {
            products: true,
          },
        },
      },
      where: {
        parentId: null,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return categories;
  }

  private async isDescendant(
    ancestorId: string,
    potentialDescendantId: string,
  ): Promise<boolean> {
    const descendants = await this.prisma.category.findMany({
      where: {
        parentId: ancestorId,
      },
      select: {
        id: true,
      },
    });

    if (descendants.some((desc) => desc.id === potentialDescendantId)) {
      return true;
    }

    for (const descendant of descendants) {
      if (await this.isDescendant(descendant.id, potentialDescendantId)) {
        return true;
      }
    }

    return false;
  }
}
