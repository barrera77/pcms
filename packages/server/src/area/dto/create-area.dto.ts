import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateAreaDto {
  @ApiProperty({ description: 'Name of the area' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'MongoDB ID of the city this area belongs to' })
  @IsMongoId()
  cityId: string;

  @ApiProperty({
    description: 'MongoDB ID of the employee that manages this area',
  })
  @IsMongoId()
  managerId?: string;

  @ApiProperty({
    description: 'MongoDB IDs of the techs assigned to this area',
  })
  techIds: string[];
}
