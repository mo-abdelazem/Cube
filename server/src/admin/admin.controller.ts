import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get dashboard statistics (Admin only)' })
  getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('sales-report')
  @ApiOperation({ summary: 'Get sales report (Admin only)' })
  @ApiQuery({ name: 'startDate', required: false, type: Date })
  @ApiQuery({ name: 'endDate', required: false, type: Date })
  getSalesReport(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.adminService.getSalesReport(
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @Get('customers')
  @ApiOperation({ summary: 'Get customer analytics (Admin only)' })
  getCustomerAnalytics() {
    return this.adminService.getCustomerAnalytics();
  }
}
