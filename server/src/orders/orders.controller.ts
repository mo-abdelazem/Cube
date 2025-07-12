import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query, // Added missing import
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam, // Added missing import
  ApiQuery, // Added missing import
} from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Orders')
@Controller('orders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order with product variants' })
  create(@Request() req, @Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(req.user.id, createOrderDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get user orders' })
  findUserOrders(@Request() req) {
    return this.ordersService.findUserOrders(req.user.id);
  }

  @Get('statistics')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get order statistics (Admin only)' })
  getStatistics() {
    return this.ordersService.getOrderStatistics();
  }

  @Get('history')
  @ApiOperation({ summary: 'Get paginated order history' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, type: String })
  getOrderHistory(
    @Request() req,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: string,
  ) {
    return this.ordersService.getOrderHistory(
      req.user.id,
      page ? +page : 1,
      limit ? +limit : 20,
      status,
    );
  }

  @Get('tracking/:trackingNumber')
  @ApiOperation({ summary: 'Track order by tracking number' })
  @ApiParam({ name: 'trackingNumber', description: 'Order tracking number' })
  trackOrder(@Param('trackingNumber') trackingNumber: string) {
    return this.ordersService.trackOrder(trackingNumber);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by ID' })
  findOne(@Param('id') id: string, @Request() req) {
    // Admin can see any order, users can only see their own
    const userId = req.user.role === UserRole.ADMIN ? undefined : req.user.id;
    return this.ordersService.findOne(id, userId);
  }

  @Put(':id/status')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update order status (Admin only)' })
  updateOrderStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.ordersService.updateOrderStatus(id, body.status);
  }

  @Put(':id/cancel')
  @ApiOperation({ summary: 'Cancel order' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  cancelOrder(@Param('id') id: string, @Request() req) {
    const userId = req.user.role === UserRole.ADMIN ? undefined : req.user.id;
    return this.ordersService.cancelOrder(id, userId);
  }

  @Post(':id/refund')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Process refund (Admin only)' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  processRefund(
    @Param('id') id: string,
    @Body() refundDto: { amount?: number; reason?: string },
  ) {
    return this.ordersService.processRefund(
      id,
      refundDto.amount,
      refundDto.reason,
    );
  }
}
