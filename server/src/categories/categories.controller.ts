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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new category (Admin only)' })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  @ApiQuery({
    name: 'includeInactive',
    required: false,
    type: Boolean,
    description: 'Include inactive categories',
  })
  findAll(@Query('includeInactive') includeInactive?: boolean) {
    return this.categoriesService.findAll(includeInactive === true);
  }

  @Get('tree')
  @ApiOperation({ summary: 'Get category tree with all levels' })
  getCategoryTree() {
    return this.categoriesService.getCategoryTree();
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get category by slug with products' })
  @ApiParam({ name: 'slug', description: 'Category slug' })
  findOne(@Param('slug') slug: string) {
    return this.categoriesService.findOne(slug);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update category (Admin only)' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete category (Admin only)' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
