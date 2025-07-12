import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAddressDto {
  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsString()
  address1: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  address2?: string;

  @ApiProperty()
  @IsString()
  city: string;

  @ApiProperty()
  @IsString()
  state: string;

  @ApiProperty()
  @IsString()
  zipCode: string;

  @ApiProperty()
  @IsString()
  country: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  type?: string; // 'home', 'work', 'other'
}
