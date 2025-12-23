import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateEquipmentDto {
  @ApiProperty({ description: 'Name of the equipment' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Description' })
  description: string;

  @ApiProperty({ description: 'SKU' })
  sku: string;

  @ApiProperty({ description: 'SN' })
  serialNumber?: string;
}
