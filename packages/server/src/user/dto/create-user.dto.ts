import { ApiProperty } from '@nestjs/swagger';
import type { UserRole } from '@pcms/pcms-common';
import { UserRoles } from '@pcms/pcms-common';
import { IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'User' })
  @IsString()
  @IsNotEmpty()
  userName: string;

  @ApiProperty({ enum: UserRoles, default: UserRoles.VIEWER })
  @IsEnum(UserRoles)
  role: UserRole;
}
