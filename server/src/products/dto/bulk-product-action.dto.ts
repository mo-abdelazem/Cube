import { IsString, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class BulkProductActionDto {
  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  productIds: string[];

  @ApiProperty({
    enum: ['activate', 'deactivate', 'delete', 'feature', 'unfeature'],
  })
  @IsString()
  action: 'activate' | 'deactivate' | 'delete' | 'feature' | 'unfeature';
}
