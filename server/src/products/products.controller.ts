import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import {
  CreateProductDto,
  ProductResponseDto,
  UpdateProductDto,
  UpdateProductStatusDto,
  BulkProductActionDto,
} from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

// TODO: Create these DTOs when you implement search functionality
interface SearchProductsDto {
  query: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
}

interface AutocompleteDto {
  query: string;
  limit?: number;
}

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(
    private productsService: ProductsService,
    // TODO: Inject SearchService if you have one
    // private searchService: SearchService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new product with variants (Admin only)' })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all products with variants' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'categoryId', required: false, type: String })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('categoryId') categoryId?: string,
  ) {
    return this.productsService.findAll(
      page ? +page : 1,
      limit ? +limit : 20,
      search,
      categoryId,
    );
  }

  @Get('featured')
  @ApiOperation({ summary: 'Get featured products with default variants' })
  findFeatured(@Query('limit') limit?: number) {
    return this.productsService.findFeatured(limit ? +limit : 10);
  }

  @Get('low-stock')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get products with low stock (Admin only)' })
  @ApiQuery({
    name: 'threshold',
    required: false,
    type: Number,
    description: 'Stock threshold (default: 10)',
  })
  getLowStock(@Query('threshold') threshold?: number) {
    return this.productsService.getLowStockProducts(
      threshold ? +threshold : 10,
    );
  }

  // TODO: Implement these methods when SearchService is available
  /*
  @Get('search')
  @ApiOperation({ summary: 'Advanced product search with filters' })
  async searchProducts(@Query() searchDto: SearchProductsDto) {
    return this.searchService.searchProducts(searchDto);
  }

  @Get('autocomplete')
  @ApiOperation({ summary: 'Product name autocomplete' })
  async autocomplete(@Query() autocompleteDto: AutocompleteDto) {
    return this.searchService.autocomplete(autocompleteDto);
  }

  @Get('price-range')
  @ApiOperation({ summary: 'Get price range for products' })
  @ApiQuery({ name: 'categoryId', required: false, type: String })
  async getPriceRange(@Query('categoryId') categoryId?: string) {
    return this.searchService.getPriceRange(categoryId);
  }
  */

  @Get('variants/:variantId')
  @ApiOperation({ summary: 'Get specific product variant' })
  findVariant(@Param('variantId') variantId: string) {
    return this.productsService.findVariant(variantId);
  }

  @Get(':slug')
  @ApiOperation({
    summary: 'Get product by slug with all variants and options',
  })
  findOne(@Param('slug') slug: string) {
    return this.productsService.findOne(slug);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update product (Admin only)' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete product (Admin only)' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update product status (Admin only)' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateProductStatusDto,
  ) {
    return this.productsService.updateStatus(id, updateStatusDto);
  }

  @Post('bulk')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Bulk product operations (Admin only)' })
  bulkAction(@Body() bulkActionDto: BulkProductActionDto) {
    return this.productsService.bulkAction(bulkActionDto);
  }
}
