import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsDate,
  IsEnum,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export enum CouponType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED_AMOUNT = 'FIXED_AMOUNT',
  FREE_SHIPPING = 'FREE_SHIPPING',
}

export class CreateCouponDto {
  @ApiProperty()
  @IsString()
  code: string;

  @ApiProperty({ enum: CouponType })
  @IsEnum(CouponType)
  type: CouponType;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  value: number; // Percentage (0-100) or fixed amount

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minimumAmount?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maximumDiscount?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  usageLimit?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  usageLimitPerUser?: number;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  applicableProductIds?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  applicableCategoryIds?: string[];
}
