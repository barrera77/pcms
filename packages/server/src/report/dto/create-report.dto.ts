import { ApiProperty } from '@nestjs/swagger';
import {
  SeverityLevels,
  TreatmentTypes,
  type SeverityLevel,
  type TreatmentType,
} from '@pcms/pcms-common';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ProductUsageDto } from 'src/product-usage/product-usage-output.dto';

export class CreateReportDto {
  @ApiProperty({ description: 'Job Id' })
  @IsMongoId()
  jobId: string;

  @ApiProperty({ description: 'Pest' })
  @IsMongoId({ each: true })
  @IsArray()
  @ArrayNotEmpty()
  pestId: string[];

  @ApiProperty({ description: 'Treatment Type' })
  @IsEnum(TreatmentTypes, { each: true })
  treatmentType: TreatmentType[];

  @ApiProperty({ description: 'Treatment No.' })
  @IsNumber()
  treatmentNo: number;

  @ApiProperty({ description: 'Severity' })
  @IsEnum(SeverityLevels)
  severity: SeverityLevel;

  @ApiProperty({ description: 'Performed By' })
  @IsEnum(['in-house', 'contractor'])
  performedBy: 'in-house' | 'contractor';

  @ApiProperty({ description: 'Contractor Company' })
  contractorCompany?: string;

  @ApiProperty({ description: 'Technicians' })
  @IsMongoId({ each: true })
  @IsArray()
  @ArrayNotEmpty()
  techIds: string[];

  @ApiProperty({ description: 'Product Usage' })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ProductUsageDto)
  productUsage: ProductUsageDto[];

  @ApiProperty({ description: 'Notes' })
  @IsString()
  notes: string;

  @ApiProperty({ description: 'Follow Up?' })
  @IsBoolean()
  requiresFollowUp: boolean;
}
