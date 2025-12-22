import { ApiProperty } from '@nestjs/swagger';
import { IDepartment } from '@pcms/pcms-common';

export class DepartmentDto implements IDepartment {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;
}
