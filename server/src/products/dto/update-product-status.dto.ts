import { IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class UpdateProductStatusDto {
  @ApiProperty()
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;
}
