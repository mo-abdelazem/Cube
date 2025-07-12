import {
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class SearchProductsDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  q?: string; // Search query

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categoryIds?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  minPrice?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  maxPrice?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  brands?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  sortBy?: 'price' | 'name' | 'createdAt' | 'popularity';

  @ApiProperty({ required: false, enum: ['asc', 'desc'] })
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc';

  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  page?: number;

  @ApiProperty({ required: false, default: 20 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  language?: string;

  // Option filters (e.g., size, color)
  @ApiProperty({
    required: false,
    description:
      'Option filters as key-value pairs (e.g., {"size": ["S", "M"], "color": ["red", "blue"]})',
    example: { size: ['S', 'M'], color: ['red', 'blue'] },
  })
  @IsOptional()
  options?: Record<string, string[]>;
}
