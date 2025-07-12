// src/auth/auth.controller.ts
import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  RegisterDto,
  LoginDto,
  AuthResponseDto,
  UpdateProfileDto,
  ChangePasswordDto,
} from './dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, type: AuthResponseDto })
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, type: AuthResponseDto })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile' })
  async getProfile(@Request() req) {
    return this.authService.getProfile(req.user.id);
  }
  @Put('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user profile' })
  async updateProfile(
    @Request() req,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.authService.updateProfile(req.user.id, updateProfileDto);
  }

  @Put('password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change password' })
  async changePassword(
    @Request() req,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(req.user.id, changePasswordDto);
  }

  @Delete('account')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete user account' })
  async deleteAccount(@Request() req) {
    return this.authService.deleteAccount(req.user.id);
  }

  @Get('orders')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user order history' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getUserOrders(
    @Request() req,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.authService.getUserOrders(
      req.user.id,
      page ? +page : 1,
      limit ? +limit : 20,
    );
  }
}
