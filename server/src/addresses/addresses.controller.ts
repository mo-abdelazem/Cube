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
import { AddressesService } from './addresses.service';
import { CreateAddressDto, UpdateAddressDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User, UserPayload } from '../auth/decorators/user.decorator';

@ApiTags('Addresses')
@Controller('addresses')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AddressesController {
  constructor(private addressesService: AddressesService) {}

  @Post()
  @ApiOperation({ summary: 'Create new address' })
  create(
    @User() user: UserPayload,
    @Body() createAddressDto: CreateAddressDto,
  ) {
    return this.addressesService.create(user.id, createAddressDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get user addresses' })
  findUserAddresses(@User() user: UserPayload) {
    return this.addressesService.findUserAddresses(user.id);
  }

  // ✅ Move specific routes BEFORE parameterized routes
  @Get('example')
  @ApiOperation({ summary: 'Example using specific user property' })
  exampleMethod(@User('id') userId: string) {
    // Directly get just the user ID as a string
    return { userId };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get address by ID' })
  @ApiParam({ name: 'id', description: 'Address ID' })
  findOne(@Param('id') id: string, @User() user: UserPayload) {
    return this.addressesService.findOne(id, user.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update address' })
  @ApiParam({ name: 'id', description: 'Address ID' })
  update(
    @Param('id') id: string,
    @User() user: UserPayload,
    @Body() updateAddressDto: UpdateAddressDto,
  ) {
    return this.addressesService.update(id, user.id, updateAddressDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete address' })
  @ApiParam({ name: 'id', description: 'Address ID' })
  remove(@Param('id') id: string, @User() user: UserPayload) {
    return this.addressesService.remove(id, user.id);
  }
}
