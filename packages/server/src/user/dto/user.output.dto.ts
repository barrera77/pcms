import { ApiProperty } from '@nestjs/swagger';
import type { UserRole } from '@pcms/pcms-common';

export class UserDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  userName: string;

  @ApiProperty({ enum: ['VIEWER', 'ADMIN', 'TECHNICIAN', 'SUPERVISOR'] })
  role: UserRole;
}
