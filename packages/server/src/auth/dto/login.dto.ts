import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Provide username (email)',
  })
  @IsEmail()
  userName: string;

  @ApiProperty({
    description: 'Provide Password',
  })
  @IsNotEmpty()
  password: string;
}
