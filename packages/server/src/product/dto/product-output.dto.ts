import { ApiProperty } from '@nestjs/swagger';
import { IProduct } from '@pcms/pcms-common';

export class ProductDto implements IProduct {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  category: string;

  @ApiProperty()
  activeIngredient: string;

  @ApiProperty()
  labelUrl: string;

  @ApiProperty()
  msdsUrl: string;

  @ApiProperty()
  supplier: string;
}
