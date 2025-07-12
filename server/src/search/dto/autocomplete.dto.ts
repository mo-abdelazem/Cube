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

export class AutocompleteDto {
  @ApiProperty()
  @IsString()
  q: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiProperty({ required: false, default: 10 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(20)
  @Type(() => Number)
  limit?: number;
}
