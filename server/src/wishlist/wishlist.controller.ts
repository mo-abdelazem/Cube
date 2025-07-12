import {
  Controller,
  Get,
  Post,
  Delete,
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
import { WishlistService } from './wishlist.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Wishlist')
@Controller('wishlist')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WishlistController {
  constructor(private wishlistService: WishlistService) {}

  @Get()
  @ApiOperation({ summary: 'Get user wishlist' })
  getWishlist(@Request() req) {
    return this.wishlistService.getWishlist(req.user.id);
  }

  @Post('items/:productId')
  @ApiOperation({ summary: 'Add product to wishlist' })
  @ApiParam({ name: 'productId', description: 'Product ID' })
  addToWishlist(@Request() req, @Param('productId') productId: string) {
    return this.wishlistService.addToWishlist(req.user.id, productId);
  }

  @Delete('items/:id')
  @ApiOperation({ summary: 'Remove item from wishlist' })
  @ApiParam({ name: 'id', description: 'Wishlist Item ID' })
  removeFromWishlist(@Request() req, @Param('id') itemId: string) {
    return this.wishlistService.removeFromWishlist(req.user.id, itemId);
  }
}
