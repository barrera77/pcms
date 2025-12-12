import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateEmployeeDto {
  @ApiProperty({ description: 'Name of the employee ' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'MongoDB ID of what department this employee belongs to',
  })
  @IsMongoId()
  departmentId: string;

  @ApiProperty({ description: 'Phone number' })
  phone: string;

  @ApiProperty({ description: 'Email' })
  email: string;

  @ApiProperty({ description: 'Employee Role' })
  role: string;
}
