import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  Min,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class ProductVariantDto {
  @ApiProperty()
  @IsString()
  sku: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  comparePrice?: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  weight?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  dimensions?: { length: number; width: number; height: number };

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  optionValueIds: string[]; // Array of option value IDs for this variant
}

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  sku: string;

  @ApiProperty()
  @IsString()
  slug: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  basePrice: number;

  @ApiProperty()
  @IsString()
  categoryId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  hasVariants?: boolean;

  @ApiProperty({ type: 'object', additionalProperties: true })
  translations: {
    [key: string]: {
      name: string;
      description?: string;
      shortDesc?: string;
      metaTitle?: string;
      metaDesc?: string;
    };
  };

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  optionIds?: string[]; // Options available for this product

  @ApiProperty({ type: [ProductVariantDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductVariantDto)
  variants?: ProductVariantDto[];
}
