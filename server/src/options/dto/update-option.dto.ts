import { IsString, IsNumber, IsOptional, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOptionDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  position?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  translations?: {
    [key: string]: {
      name?: string;
    };
  };
}
