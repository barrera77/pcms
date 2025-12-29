import { ApiProperty } from '@nestjs/swagger';
import { IProductUsage } from '@pcms/pcms-common';

export class ProductUsageDto implements IProductUsage {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  productId: string;

  @ApiProperty()
  concentrationPercent?: number;

  @ApiProperty()
  quantity?: string;
}
