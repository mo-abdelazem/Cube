import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddToCartDto, UpdateCartItemDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Cart')
@Controller('cart')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CartController {
  constructor(private cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Get user cart' })
  getCart(@Request() req) {
    return this.cartService.getCart(req.user.id);
  }

  @Post('items')
  @ApiOperation({ summary: 'Add item to cart' })
  addToCart(@Request() req, @Body() addToCartDto: AddToCartDto) {
    return this.cartService.addToCart(req.user.id, addToCartDto);
  }

  @Put('items/:id')
  @ApiOperation({ summary: 'Update cart item quantity' })
  @ApiParam({ name: 'id', description: 'Cart Item ID' })
  updateCartItem(
    @Request() req,
    @Param('id') itemId: string,
    @Body() updateDto: UpdateCartItemDto,
  ) {
    return this.cartService.updateCartItem(req.user.id, itemId, updateDto);
  }

  @Delete('items/:id')
  @ApiOperation({ summary: 'Remove item from cart' })
  @ApiParam({ name: 'id', description: 'Cart Item ID' })
  removeCartItem(@Request() req, @Param('id') itemId: string) {
    return this.cartService.removeCartItem(req.user.id, itemId);
  }

  @Delete()
  @ApiOperation({ summary: 'Clear cart' })
  clearCart(@Request() req) {
    return this.cartService.clearCart(req.user.id);
  }
}
