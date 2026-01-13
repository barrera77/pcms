import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { JobStatus } from 'src/job/job.entity';

export class CreateJobDto {
  @ApiProperty({ description: 'WO' })
  @IsNotEmpty()
  @IsString()
  workOrder: string;

  @ApiProperty({ description: 'Technicians' })
  @IsMongoId()
  techId: string;

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
  unit?: string;

  @IsNotEmpty()
  @IsEnum(JobStatus)
  jobStatus: JobStatus;
}
