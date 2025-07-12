import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateVariantStockDto {
  @ApiProperty()
  @IsNumber()
  stock: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  reason?: string;
}
