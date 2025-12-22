import { ApiProperty } from '@nestjs/swagger';
import { IEmployee } from '@pcms/pcms-common';

export class EmployeeDto implements IEmployee {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  departmentId: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  role: string;
}
