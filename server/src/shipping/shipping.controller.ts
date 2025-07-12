import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ShippingService } from './shipping.service';
import { CalculateShippingDto } from './dto';

@ApiTags('Shipping')
@Controller('shipping')
export class ShippingController {
  constructor(private shippingService: ShippingService) {}

  @Post('rates')
  @ApiOperation({ summary: 'Calculate shipping rates' })
  calculateShipping(@Body() calculateShippingDto: CalculateShippingDto) {
    return this.shippingService.calculateShipping(calculateShippingDto);
  }
}
