import { Controller, Get, Query, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiParam } from '@nestjs/swagger';
import { SearchService } from './search.service';
import { SearchProductsDto, AutocompleteDto } from './dto';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Get('products')
  @ApiOperation({ summary: 'Advanced product search with filters' })
  searchProducts(@Query() searchDto: SearchProductsDto) {
    return this.searchService.searchProducts(searchDto);
  }

  @Get('autocomplete')
  @ApiOperation({ summary: 'Product name autocomplete' })
  autocomplete(@Query() autocompleteDto: AutocompleteDto) {
    return this.searchService.autocomplete(autocompleteDto);
  }

  @Get('price-range')
  @ApiOperation({ summary: 'Get price range for products' })
  @ApiQuery({ name: 'categoryId', required: false, type: String })
  getPriceRange(@Query('categoryId') categoryId?: string) {
    return this.searchService.getPriceRange(categoryId);
  }

  @Get('filters/:categoryId')
  @ApiOperation({ summary: 'Get available filters for category' })
  @ApiParam({ name: 'categoryId', description: 'Category ID' })
  getCategoryFilters(@Param('categoryId') categoryId: string) {
    return this.searchService.getAvailableFilters(
      { categoryId, isActive: true },
      'en',
    );
  }
}
