import { IsString, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddToCartDto {
  @ApiProperty()
  @IsString()
  productId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  productVariantId?: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({ required: false })
  @IsOptional()
  selectedOptions?: Record<string, string>;
}
