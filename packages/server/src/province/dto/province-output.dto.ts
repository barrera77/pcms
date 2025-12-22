import { ApiProperty } from '@nestjs/swagger';
import { IProvince } from '@pcms/pcms-common';

export class ProvinceDto implements IProvince {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  code: string;
}
