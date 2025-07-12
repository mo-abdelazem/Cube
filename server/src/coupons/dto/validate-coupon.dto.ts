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

export class ValidateCouponDto {
  @ApiProperty()
  @IsString()
  code: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  orderAmount: number;

  @ApiProperty({ required: false })
  @IsOptional()
  productIds?: string[];
}
