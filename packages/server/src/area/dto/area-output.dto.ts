import { ApiProperty } from '@nestjs/swagger';
import { IArea } from '@pcms/pcms-common';
export class AreaDto implements IArea {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  cityId: string;

  @ApiProperty({ required: false, nullable: true })
  managerId?: string | null;

  @ApiProperty({ type: [String] })
  techIds: string[];

  @ApiProperty({ required: false })
  isInactive: boolean;

  @ApiProperty({ required: false })
  inactiveAt: Date;
}
