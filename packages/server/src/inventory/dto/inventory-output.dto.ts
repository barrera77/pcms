import { ApiProperty } from '@nestjs/swagger';
import { IInventory } from '@pcms/pcms-common';

export class InventoryDto implements IInventory {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  itemId: string;

  @ApiProperty()
  itemType: 'product' | 'equipment';

  @ApiProperty()
  minimumThreshold: number;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  unit?: string;
}
