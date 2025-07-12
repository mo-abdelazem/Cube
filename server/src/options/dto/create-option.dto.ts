import { IsString, IsNumber, IsOptional, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// Create a separate interface for translation structure
export interface OptionTranslation {
  name: string;
}

export interface OptionTranslations {
  [languageCode: string]: OptionTranslation;
}

export class CreateOptionDto {
  @ApiProperty({ example: 'Size' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'size' })
  @IsString()
  slug: string;

  @ApiProperty({ required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  position?: number;

  @ApiProperty({
    description: 'Translations for the option in different languages',
    example: {
      en: { name: 'Size' },
      ar: { name: 'الحجم' },
      fr: { name: 'Taille' },
    },
  })
  @IsObject()
  translations: OptionTranslations;
}
