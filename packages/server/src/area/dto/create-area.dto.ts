import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

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
    required: false,
  })
  @IsMongoId()
  @IsOptional()
  managerId?: string;

  @ApiProperty({
    description: 'MongoDB IDs of the techs assigned to this area',
    required: false,
  })
  @IsArray()
  @IsOptional()
  techIds?: string[];
}
