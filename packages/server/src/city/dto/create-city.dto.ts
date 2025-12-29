import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateCityDto {
  @ApiProperty({ description: 'Name of the city' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'MongoDB ID of the province this city belongs to',
  })
  @IsMongoId()
  province: string;
}
