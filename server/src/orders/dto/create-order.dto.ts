import {
  IsArray,
  IsOptional,
  IsString,
  ValidateNested,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class OrderItemDto {
  @ApiProperty()
  @IsString()
  productId: string;

  @ApiProperty({
    required: false,
    description: 'Specific variant ID if product has variants',
  })
  @IsOptional()
  @IsString()
  productVariantId?: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty({
    required: false,
    description:
      'Selected options for products without variants or for order history',
    example: { size: 'medium', color: 'blue' },
  })
  @IsOptional()
  selectedOptions?: Record<string, string>;
}

export class CreateOrderDto {
  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({ required: false })
  @IsOptional()
  shippingAddress?: {
    firstName: string;
    lastName: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone?: string;
  };

  @ApiProperty({ required: false })
  @IsOptional()
  billingAddress?: {
    firstName: string;
    lastName: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone?: string;
  };

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}
