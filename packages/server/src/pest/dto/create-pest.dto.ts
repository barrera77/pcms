import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePestDto {
  @ApiProperty({ description: 'Name of the pest' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Category to which this pest belongs to' })
  category: string;

  @ApiProperty({ description: 'Description' })
  description: string;
}
