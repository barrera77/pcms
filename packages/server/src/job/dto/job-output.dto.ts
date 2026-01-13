import { ApiProperty } from '@nestjs/swagger';
import { IJob, type JobStatus } from '@pcms/pcms-common';

export class JobDto implements IJob {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  workOrder: string;

  @ApiProperty()
  date: Date;

  @ApiProperty()
  cityId: string;

  @ApiProperty()
  buildingId: string;

  @ApiProperty()
  unit: string;

  @ApiProperty()
  techId: string;

  @ApiProperty()
  clockInAt?: Date;

  @ApiProperty()
  clockOutAt?: Date;

  @ApiProperty()
  jobstatus: JobStatus;
}
