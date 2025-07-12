// src/auth/auth.service.ts
import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import {
  RegisterDto,
  LoginDto,
  AuthResponseDto,
  UpdateProfileDto,
  ChangePasswordDto,
} from './dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const { email, password, firstName, lastName } = registerDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    });

    // Generate JWT token
    const payload = { sub: user.id, email: user.email, role: user.role };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user,
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;

    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const payload = { sub: user.id, email: user.email, role: user.role };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  async getProfile(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
      },
    });
  }
  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    try {
      const user = await this.prisma.user.update({
        where: { id: userId },
        data: {
          ...updateProfileDto,
          updatedAt: new Date(),
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          dateOfBirth: true,
          language: true,
          currency: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return user;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('User not found');
      }
      throw new BadRequestException(
        `Failed to update profile: ${error.message}`,
      );
    }
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    const { currentPassword, newPassword } = changePasswordDto;

    try {
      // Get current user with password
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password,
      );
      if (!isCurrentPasswordValid) {
        throw new UnauthorizedException('Current password is incorrect');
      }

      // Hash new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 12);

      // Update password
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          password: hashedNewPassword,
          updatedAt: new Date(),
        },
      });

      return { message: 'Password changed successfully' };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to change password: ${error.message}`,
      );
    }
  }

  async deleteAccount(userId: string) {
    try {
      // Check if user has any pending orders
      const pendingOrders = await this.prisma.order.findMany({
        where: {
          userId,
          status: {
            in: ['PENDING', 'PROCESSING'],
          },
        },
      });

      if (pendingOrders.length > 0) {
        throw new BadRequestException(
          'Cannot delete account with pending orders. Please contact support.',
        );
      }

      // Anonymize completed orders instead of deleting them for business records
      await this.prisma.order.updateMany({
        where: { userId },
        data: {
          // Keep order data but remove user reference
          userId: null,
          // Add anonymization data
          shippingAddress: { anonymized: true },
          billingAddress: { anonymized: true },
          notes: 'User account deleted',
        },
      });

      // Delete user account
      await this.prisma.user.delete({
        where: { id: userId },
      });

      return { message: 'Account deleted successfully' };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to delete account: ${error.message}`,
      );
    }
  }

  async getUserOrders(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where: { userId },
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
      }),
      this.prisma.order.count({
        where: { userId },
      }),
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
