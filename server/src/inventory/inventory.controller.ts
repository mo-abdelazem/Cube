import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { InventoryService, BulkAdjustmentResponse } from './inventory.service';
import { BulkStockAdjustmentDto, UpdateVariantStockDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Inventory')
@Controller('inventory')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
export class InventoryController {
  constructor(private inventoryService: InventoryService) {}

  @Put('variants/:id/stock')
  @ApiOperation({ summary: 'Update variant stock (Admin only)' })
  @ApiParam({ name: 'id', description: 'Variant ID' })
  updateVariantStock(
    @Param('id') variantId: string,
    @Body() updateStockDto: UpdateVariantStockDto,
  ) {
    return this.inventoryService.updateVariantStock(variantId, updateStockDto);
  }

  @Post('stock-adjustment')
  @ApiOperation({ summary: 'Bulk stock adjustment (Admin only)' })
  bulkStockAdjustment(
    @Body() bulkAdjustmentDto: BulkStockAdjustmentDto,
  ): Promise<BulkAdjustmentResponse> {
    return this.inventoryService.bulkStockAdjustment(bulkAdjustmentDto);
  }

  @Get('report')
  @ApiOperation({ summary: 'Get inventory report (Admin only)' })
  @ApiQuery({ name: 'categoryId', required: false, type: String })
  getInventoryReport(@Query('categoryId') categoryId?: string) {
    return this.inventoryService.getInventoryReport(categoryId);
  }

  @Get('adjustments')
  @ApiOperation({ summary: 'Get stock adjustment history (Admin only)' })
  @ApiQuery({ name: 'variantId', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  getStockAdjustmentHistory(
    @Query('variantId') variantId?: string,
    @Query('limit') limit?: number,
  ) {
    return this.inventoryService.getStockAdjustmentHistory(
      variantId,
      limit ? +limit : 50,
    );
  }
}
