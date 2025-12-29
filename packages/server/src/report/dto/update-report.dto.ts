// update-report.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateReportDto } from './create-report.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { ReportStatuses } from '@pcms/pcms-common';
import type { ReportStatus } from '@pcms/pcms-common';

export class UpdateReportDto extends PartialType(CreateReportDto) {
  @IsOptional()
  @IsEnum(ReportStatuses)
  status?: ReportStatus;
}
