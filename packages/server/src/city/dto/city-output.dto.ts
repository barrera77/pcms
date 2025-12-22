import { ApiProperty } from '@nestjs/swagger';
import { ICity } from '@pcms/pcms-common';

export class CityDto implements ICity {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  provinceId: string;
}
