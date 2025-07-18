import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CategoryTranslationDto {
  @ApiProperty({ example: 'Electronics' })
  @IsString()
  name: string;
}

export class CreateCategoryDto {
  @ApiProperty({ example: 'electronics' })
  @IsString()
  slug: string;

  @ApiProperty({
    type: 'object',
    additionalProperties: {
      type: 'object',
      properties: {
        name: { type: 'string' },
      },
    },
    example: {
      en: { name: 'Electronics' },
      ar: { name: 'إلكترونيات' },
      fr: { name: 'Électronique' },
    },
    description: 'Translations for different languages',
  })
  @IsObject()
  // @ValidateNested({ each: true })
  // @Type(() => CategoryTranslationDto)
  translations: Record<string, CategoryTranslationDto>;

  @ApiProperty({
    example: null,
    required: false,
    description: 'Parent category ID for creating subcategories',
  })
  @IsOptional()
  @IsString()
  parentId?: string;

  @ApiProperty({
    example: true,
    required: false,
    default: true,
    description: 'Whether the category is active',
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    example: 1,
    required: false,
    description: 'Display order for sorting categories',
  })
  @IsOptional()
  sortOrder?: number;
}
