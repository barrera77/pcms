import { ApiProperty } from '@nestjs/swagger';
import { IEquipment } from '@pcms/pcms-common';

export class EquipmentDto implements IEquipment {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  sku: string;

  @ApiProperty()
  serialNumber?: string | undefined;

  @ApiProperty()
  supplier: string;
}
