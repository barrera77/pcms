import { ApiProperty } from '@nestjs/swagger';
import { PestCategories } from '@pcms/pcms-common';
import type { PestCategory } from '@pcms/pcms-common';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePestDto {
  @ApiProperty({ description: 'Name of the pest' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Category to which this pest belongs to',
    enum: PestCategories,
  })
  category: PestCategory;

  @ApiProperty({ description: 'Description' })
  description: string;
}
