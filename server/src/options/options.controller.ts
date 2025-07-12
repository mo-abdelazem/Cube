import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { OptionsService } from './options.service';
import {
  CreateOptionDto,
  UpdateOptionDto,
  CreateOptionValueDto,
  UpdateOptionValueDto,
} from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Options')
@Controller('options')
export class OptionsController {
  constructor(private optionsService: OptionsService) {}

  // Options endpoints
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new option (Admin only)' })
  createOption(@Body() createOptionDto: CreateOptionDto) {
    return this.optionsService.createOption(createOptionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all options with values' })
  findAllOptions() {
    return this.optionsService.findAllOptions();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get option by ID with values' })
  @ApiParam({ name: 'id', description: 'Option ID' })
  findOneOption(@Param('id') id: string) {
    return this.optionsService.findOneOption(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update option (Admin only)' })
  @ApiParam({ name: 'id', description: 'Option ID' })
  updateOption(
    @Param('id') id: string,
    @Body() updateOptionDto: UpdateOptionDto,
  ) {
    return this.optionsService.updateOption(id, updateOptionDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete option (Admin only)' })
  @ApiParam({ name: 'id', description: 'Option ID' })
  removeOption(@Param('id') id: string) {
    return this.optionsService.removeOption(id);
  }

  // Option Values endpoints
  @Post(':id/values')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add value to option (Admin only)' })
  @ApiParam({ name: 'id', description: 'Option ID' })
  createOptionValue(
    @Param('id') optionId: string,
    @Body() createOptionValueDto: CreateOptionValueDto,
  ) {
    return this.optionsService.createOptionValue(
      optionId,
      createOptionValueDto,
    );
  }

  @Get(':id/values')
  @ApiOperation({ summary: 'Get values for option' })
  @ApiParam({ name: 'id', description: 'Option ID' })
  findOptionValues(@Param('id') optionId: string) {
    return this.optionsService.findOptionValues(optionId);
  }
}

@ApiTags('Option Values')
@Controller('option-values')
export class OptionValuesController {
  constructor(private optionsService: OptionsService) {}

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update option value (Admin only)' })
  @ApiParam({ name: 'id', description: 'Option Value ID' })
  updateOptionValue(
    @Param('id') id: string,
    @Body() updateOptionValueDto: UpdateOptionValueDto,
  ) {
    return this.optionsService.updateOptionValue(id, updateOptionValueDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete option value (Admin only)' })
  @ApiParam({ name: 'id', description: 'Option Value ID' })
  removeOptionValue(@Param('id') id: string) {
    return this.optionsService.removeOptionValue(id);
  }
}
