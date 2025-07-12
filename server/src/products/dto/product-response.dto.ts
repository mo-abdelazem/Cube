import { ApiProperty } from '@nestjs/swagger';

export class ProductResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  sku: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  basePrice: number;

  @ApiProperty()
  hasVariants: boolean;

  @ApiProperty()
  translations: any[];

  @ApiProperty()
  category: any;

  @ApiProperty()
  variants: any[];
}
