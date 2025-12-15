import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateBuildingDto {
  @ApiProperty({ description: 'Building Name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'MongoDB ID of the area this building belongs to',
  })
  @IsMongoId()
  areaId: string;

  @ApiProperty({ description: 'Number of units' })
  numOfUnits: number;

  @ApiProperty({ description: 'Units that belong to this building' })
  units: string[];
}
