import { PartialType } from '@nestjs/swagger';
import { CreateJobDto } from 'src/job/dto/create-job.dto';

export class UpdateJobDto extends PartialType(CreateJobDto) {}
