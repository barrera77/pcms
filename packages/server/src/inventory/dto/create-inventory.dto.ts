import { ApiProperty } from '@nestjs/swagger';

export class CreateInventoryDto {
  @ApiProperty({ description: 'Item' })
  itemId: string;

  @ApiProperty({ description: 'Type' })
  itemType: 'product' | 'equipment';

  @ApiProperty({ description: 'Minimum Threshold' })
  minimumThreshold: number;

  @ApiProperty({ description: 'Qty' })
  quantity: number;

  @ApiProperty({ description: 'Unit' })
  unit?: string;
}
