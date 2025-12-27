import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ActivateUserDto {
  @IsString()
  token: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
