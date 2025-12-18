import { ApiProperty } from '@nestjs/swagger';
import { IBuilding } from '@pcms/pcms-common';

export class BuildingDto implements IBuilding {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  areaId: string;

  @ApiProperty()
  numOfUnits: number;

  @ApiProperty()
  units: string[];
}
