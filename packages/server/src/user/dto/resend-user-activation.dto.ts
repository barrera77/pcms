import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ResendActivationDto {
  @ApiProperty({
    example: 'john@company.com',
    description: 'User email address',
  })
  @IsEmail()
  email: string;
}
