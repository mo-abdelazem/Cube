import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateOptionDto,
  UpdateOptionDto,
  CreateOptionValueDto,
  UpdateOptionValueDto,
} from './dto';

@Injectable()
export class OptionsService {
  constructor(private prisma: PrismaService) {}

  // Options CRUD
  async createOption(createOptionDto: CreateOptionDto) {
    const { translations, ...optionData } = createOptionDto;

    try {
      // Check if slug already exists
      const existingOption = await this.prisma.option.findUnique({
        where: { slug: optionData.slug },
      });

      if (existingOption) {
        throw new ConflictException('Option with this slug already exists');
      }

      const option = await this.prisma.option.create({
        data: {
          ...optionData,
          translations: {
            create: Object.entries(translations).map(([language, data]) => ({
              language,
              name: data.name, // Explicitly set required fields
            })),
          },
        },
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
      });

      return option;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to create option: ${error.message}`,
      );
    }
  }

  async findAllOptions() {
    return this.prisma.option.findMany({
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
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: {
        position: 'asc',
      },
    });
  }

  async findOneOption(id: string) {
    const option = await this.prisma.option.findUnique({
      where: { id },
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
        products: {
          include: {
            product: {
              include: {
                translations: true,
              },
            },
          },
        },
      },
    });

    if (!option) {
      throw new NotFoundException('Option not found');
    }

    return option;
  }

  async updateOption(id: string, updateOptionDto: UpdateOptionDto) {
    const { translations, ...optionData } = updateOptionDto;

    try {
      // Check if option exists
      const existingOption = await this.prisma.option.findUnique({
        where: { id },
      });

      if (!existingOption) {
        throw new NotFoundException('Option not found');
      }

      // Check slug uniqueness if slug is being updated
      if (optionData.slug && optionData.slug !== existingOption.slug) {
        const slugExists = await this.prisma.option.findUnique({
          where: { slug: optionData.slug },
        });

        if (slugExists) {
          throw new ConflictException('Option with this slug already exists');
        }
      }

      // Update option
      const option = await this.prisma.option.update({
        where: { id },
        data: {
          ...optionData,
          updatedAt: new Date(),
        },
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

          await this.prisma.optionTranslation.upsert({
            where: {
              optionId_language: {
                optionId: id,
                language,
              },
            },
            update: {
              name: data.name,
              updatedAt: new Date(),
            },
            create: {
              optionId: id,
              language,
              name: data.name, // Explicitly set required field
            },
          });
        }
      }

      return option;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to update option: ${error.message}`,
      );
    }
  }

  async removeOption(id: string) {
    try {
      // Check if option exists and has values
      const existingOption = await this.prisma.option.findUnique({
        where: { id },
        include: {
          values: true,
          products: true,
        },
      });

      if (!existingOption) {
        throw new NotFoundException('Option not found');
      }

      // Check if option is being used by products
      if (existingOption.products.length > 0) {
        throw new BadRequestException(
          'Cannot delete option that is being used by products',
        );
      }

      // Delete option (will cascade delete values and translations)
      await this.prisma.option.delete({
        where: { id },
      });

      return { message: 'Option deleted successfully' };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to delete option: ${error.message}`,
      );
    }
  }

  // Option Values CRUD
  async createOptionValue(
    optionId: string,
    createOptionValueDto: CreateOptionValueDto,
  ) {
    const { translations, ...valueData } = createOptionValueDto;

    try {
      // Check if option exists
      const option = await this.prisma.option.findUnique({
        where: { id: optionId },
      });

      if (!option) {
        throw new NotFoundException('Option not found');
      }

      // Check if slug already exists for this option
      const existingValue = await this.prisma.optionValue.findFirst({
        where: {
          optionId,
          slug: valueData.slug,
        },
      });

      if (existingValue) {
        throw new ConflictException(
          'Option value with this slug already exists for this option',
        );
      }

      const optionValue = await this.prisma.optionValue.create({
        data: {
          ...valueData,
          optionId,
          translations: {
            create: Object.entries(translations).map(([language, data]) => ({
              language,
              value: data.value, // Explicitly set required fields
            })),
          },
        },
        include: {
          translations: true,
          option: {
            include: {
              translations: true,
            },
          },
        },
      });

      return optionValue;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to create option value: ${error.message}`,
      );
    }
  }

  async findOptionValues(optionId: string) {
    // Verify option exists
    const option = await this.prisma.option.findUnique({
      where: { id: optionId },
      include: {
        translations: true,
      },
    });

    if (!option) {
      throw new NotFoundException('Option not found');
    }

    const values = await this.prisma.optionValue.findMany({
      where: { optionId },
      include: {
        translations: true,
      },
      orderBy: {
        position: 'asc',
      },
    });

    return {
      option,
      values,
    };
  }

  async updateOptionValue(
    id: string,
    updateOptionValueDto: UpdateOptionValueDto,
  ) {
    const { translations, ...valueData } = updateOptionValueDto;

    try {
      // Check if option value exists
      const existingValue = await this.prisma.optionValue.findUnique({
        where: { id },
        include: {
          option: true,
        },
      });

      if (!existingValue) {
        throw new NotFoundException('Option value not found');
      }

      // Check slug uniqueness if slug is being updated
      if (valueData.slug && valueData.slug !== existingValue.slug) {
        const slugExists = await this.prisma.optionValue.findFirst({
          where: {
            optionId: existingValue.optionId,
            slug: valueData.slug,
            NOT: { id },
          },
        });

        if (slugExists) {
          throw new ConflictException(
            'Option value with this slug already exists for this option',
          );
        }
      }

      // Update option value
      const optionValue = await this.prisma.optionValue.update({
        where: { id },
        data: {
          ...valueData,
          updatedAt: new Date(),
        },
        include: {
          translations: true,
          option: {
            include: {
              translations: true,
            },
          },
        },
      });

      // Update translations if provided
      if (translations) {
        for (const [language, data] of Object.entries(translations)) {
          // Ensure required fields are present
          if (!data.value) {
            throw new BadRequestException(
              `Translation value is required for language: ${language}`,
            );
          }

          await this.prisma.optionValueTranslation.upsert({
            where: {
              optionValueId_language: {
                optionValueId: id,
                language,
              },
            },
            update: {
              value: data.value,
              updatedAt: new Date(),
            },
            create: {
              optionValueId: id,
              language,
              value: data.value, // Explicitly set required field
            },
          });
        }
      }

      return optionValue;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to update option value: ${error.message}`,
      );
    }
  }

  async removeOptionValue(id: string) {
    try {
      // Check if option value exists and is being used
      const existingValue = await this.prisma.optionValue.findUnique({
        where: { id },
        include: {
          variantOptions: {
            include: {
              variant: {
                include: {
                  product: {
                    select: {
                      sku: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!existingValue) {
        throw new NotFoundException('Option value not found');
      }

      // Check if option value is being used by variants
      if (existingValue.variantOptions.length > 0) {
        const productSkus = existingValue.variantOptions.map(
          (vo) => vo.variant.product.sku,
        );
        throw new BadRequestException(
          `Cannot delete option value that is being used by product variants: ${productSkus.join(', ')}`,
        );
      }

      // Delete option value
      await this.prisma.optionValue.delete({
        where: { id },
      });

      return { message: 'Option value deleted successfully' };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to delete option value: ${error.message}`,
      );
    }
  }
}
