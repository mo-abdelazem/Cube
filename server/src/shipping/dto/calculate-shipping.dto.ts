import {
  IsString,
  IsNumber,
  IsArray,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class ShippingItemDto {
  @ApiProperty()
  @IsString()
  productVariantId: string;

  @ApiProperty()
  @IsNumber()
  quantity: number;
}

export class CalculateShippingDto {
  @ApiProperty({ type: [ShippingItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ShippingItemDto)
  items: ShippingItemDto[];

  @ApiProperty()
  @IsString()
  destinationCountry: string;

  @ApiProperty()
  @IsString()
  destinationState: string;

  @ApiProperty()
  @IsString()
  destinationCity: string;

  @ApiProperty()
  @IsString()
  destinationZipCode: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  shippingMethod?: 'standard' | 'express' | 'overnight';
}
