import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class StockAdjustmentItemDto {
  @ApiProperty()
  @IsString()
  variantId: string;

  @ApiProperty()
  @IsNumber()
  quantity: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  reason?: string;
}

export class BulkStockAdjustmentDto {
  @ApiProperty({ type: [StockAdjustmentItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StockAdjustmentItemDto)
  adjustments: StockAdjustmentItemDto[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}
