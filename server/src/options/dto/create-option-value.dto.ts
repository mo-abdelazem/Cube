import { IsString, IsNumber, IsOptional, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// Create a separate interface for translation structure
export interface OptionValueTranslation {
  value: string;
}

export interface OptionValueTranslations {
  [languageCode: string]: OptionValueTranslation;
}

export class CreateOptionValueDto {
  @ApiProperty({ example: 'Small' })
  @IsString()
  value: string;

  @ApiProperty({ example: 'small' })
  @IsString()
  slug: string;

  @ApiProperty({ required: false, example: '#FF0000' })
  @IsOptional()
  @IsString()
  hexColor?: string;

  @ApiProperty({ required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  position?: number;

  @ApiProperty({
    description: 'Translations for the option value in different languages',
    example: {
      en: { value: 'Small' },
      ar: { value: 'صغير' },
      fr: { value: 'Petit' },
    },
  })
  @IsObject()
  translations: OptionValueTranslations;
}
