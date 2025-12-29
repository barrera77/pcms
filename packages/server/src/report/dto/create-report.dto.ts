import { ApiProperty } from '@nestjs/swagger';
import {
  SeverityLevels,
  TreatmentTypes,
  type SeverityLevel,
  type TreatmentType,
} from '@pcms/pcms-common';
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
} from 'class-validator';
import { ProductUsageDto } from 'src/product-usage/product-usage-output.dto';

export class CreateReportDto {
  @ApiProperty({ description: 'Date' })
  @IsNotEmpty()
  date: string;

  @ApiProperty({ description: 'City' })
  @IsMongoId()
  cityId: string;

  @ApiProperty({ description: 'Building' })
  @IsMongoId()
  buildingId: string;

  @ApiProperty({ description: 'unit' })
  unit: string;

  @ApiProperty({ description: 'WO' })
  workOrder: string;

  @ApiProperty({ description: 'Pest' })
  @IsMongoId()
  @IsArray()
  @ArrayNotEmpty()
  pestId: string[];

  @ApiProperty({ description: 'Treatment Type' })
  @IsEnum(TreatmentTypes, { each: true })
  treatmentType: TreatmentType[];

  @ApiProperty({ description: 'Treatment No.' })
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
  @IsMongoId()
  @IsArray()
  @ArrayNotEmpty()
  techIds: string[];

  @ApiProperty({ description: 'Product Usage' })
  @IsArray()
  @ArrayNotEmpty()
  productUsage: ProductUsageDto[];

  @ApiProperty({ description: 'Notes' })
  notes: string;

  @ApiProperty({ description: 'Follow Up?' })
  requiresFollowUp: boolean;
}
