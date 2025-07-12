import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAddressDto, UpdateAddressDto } from './dto';

@Injectable()
export class AddressesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, createAddressDto: CreateAddressDto) {
    try {
      // If this is set as default, unset other default addresses
      if (createAddressDto.isDefault) {
        await this.prisma.address.updateMany({
          where: {
            userId,
            isDefault: true,
          },
          data: {
            isDefault: false,
          },
        });
      }

      const address = await this.prisma.address.create({
        data: {
          ...createAddressDto,
          userId,
        },
      });

      return address;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(
        `Failed to create address: ${errorMessage}`,
      );
    }
  }

  async findUserAddresses(userId: string) {
    return await this.prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async findOne(id: string, userId: string) {
    const address = await this.prisma.address.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    return address;
  }

  async update(id: string, userId: string, updateAddressDto: UpdateAddressDto) {
    try {
      // Check if address exists and belongs to user
      await this.findOne(id, userId);

      // If this is set as default, unset other default addresses
      if (updateAddressDto.isDefault) {
        await this.prisma.address.updateMany({
          where: {
            userId,
            isDefault: true,
            NOT: { id },
          },
          data: {
            isDefault: false,
          },
        });
      }

      const address = await this.prisma.address.update({
        where: { id },
        data: {
          ...updateAddressDto,
          updatedAt: new Date(),
        },
      });

      return address;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(
        `Failed to update address: ${errorMessage}`,
      );
    }
  }

  async remove(id: string, userId: string) {
    try {
      // Check if address exists and belongs to user
      await this.findOne(id, userId);

      await this.prisma.address.delete({
        where: { id },
      });

      return { message: 'Address deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(
        `Failed to delete address: ${errorMessage}`,
      );
    }
  }
}
