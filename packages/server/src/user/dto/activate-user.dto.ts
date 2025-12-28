import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ActivateUserDto {
  @ApiProperty({
    description: 'Provide you token',
  })
  @IsString()
  token: string;

  @ApiProperty({
    description: 'Create your password 8 chars min lenght',
  })
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
