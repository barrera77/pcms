import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateProvinceDto {
  @ApiProperty({ description: 'Name of the province' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Province code' })
  @IsString()
  @IsNotEmpty()
  code: string;
}
