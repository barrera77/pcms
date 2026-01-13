import { ApiProperty } from '@nestjs/swagger';
import { IProductUsage } from '@pcms/pcms-common';
import { IsMongoId, IsNumber, IsOptional, IsString } from 'class-validator';

export class ProductUsageDto implements IProductUsage {
  @ApiProperty()
  @IsMongoId()
  _id: string;

  @ApiProperty()
  @IsMongoId()
  productId: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  concentrationPercent?: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  quantity?: string;
}
