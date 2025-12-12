import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDepartmentDto {
  @ApiProperty({ description: 'Department name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Department description' })
  description: string;
}
