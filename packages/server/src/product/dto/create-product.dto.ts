import { SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ description: 'Prodcuct Name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Category' })
  category: string;

  @ApiProperty({ description: 'Active Ingredient' })
  activeIngredient: string;

  @ApiProperty({ description: 'Label' })
  labelUrl: string;

  @ApiProperty({ description: 'MSDS' })
  msdsUrl: string;

  @ApiProperty({ description: 'Supplier' })
  supplier: string;
}
