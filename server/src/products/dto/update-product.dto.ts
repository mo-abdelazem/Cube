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

export class UpdateProductDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  basePrice?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  categoryId?: string;

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
  translations?: {
    [key: string]: {
      name?: string;
      description?: string;
      shortDesc?: string;
      metaTitle?: string;
      metaDesc?: string;
    };
  };
}

export class BulkProductActionDto {
  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  productIds: string[];

  @ApiProperty({
    enum: ['activate', 'deactivate', 'delete', 'feature', 'unfeature'],
  })
  @IsString()
  action: 'activate' | 'deactivate' | 'delete' | 'feature' | 'unfeature';
}

export class UpdateProductStatusDto {
  @ApiProperty()
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;
}
