import { IsString, IsNumber, IsOptional, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOptionValueDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  value?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  hexColor?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  position?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  translations?: {
    [key: string]: {
      value?: string;
    };
  };
}
