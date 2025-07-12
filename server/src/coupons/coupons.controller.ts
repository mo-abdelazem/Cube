import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { CouponsService } from './coupons.service';
import { CreateCouponDto, ValidateCouponDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Coupons')
@Controller('coupons')
export class CouponsController {
  constructor(private couponsService: CouponsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create coupon (Admin only)' })
  create(@Body() createCouponDto: CreateCouponDto) {
    return this.couponsService.create(createCouponDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all coupons (Admin only)' })
  findAll() {
    return this.couponsService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get coupon by ID (Admin only)' })
  @ApiParam({ name: 'id', description: 'Coupon ID' })
  findOne(@Param('id') id: string) {
    return this.couponsService.findOne(id);
  }

  @Post('validate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Validate coupon code' })
  validateCoupon(@Request() req, @Body() validateCouponDto: ValidateCouponDto) {
    return this.couponsService.validateCoupon(req.user.id, validateCouponDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete coupon (Admin only)' })
  @ApiParam({ name: 'id', description: 'Coupon ID' })
  remove(@Param('id') id: string) {
    return this.couponsService.remove(id);
  }
}
