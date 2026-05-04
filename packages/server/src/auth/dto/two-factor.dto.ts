import { IsString, Length, Matches } from 'class-validator';

export class TwoFactorCodeDto {
  @IsString()
  @Length(6, 6, { message: 'Code must be exactly 6 digits' })
  @Matches(/^\d{6}$/, { message: 'Code must contain only digits' })
  code: string;
}
