import { ApiProperty } from '@nestjs/swagger';
import { IPest } from '@pcms/pcms-common';

export class PestDto implements IPest {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  category: string;

  @ApiProperty()
  description: string;
}
