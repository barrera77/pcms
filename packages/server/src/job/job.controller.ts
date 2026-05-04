import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateJobDto } from 'src/job/dto/create-job.dto';
import { JobDto } from 'src/job/dto/job-output.dto';
import { JobService } from 'src/job/job.service';

@ApiTags('Jobs')
@Controller('job')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post()
  @ApiOperation({ summary: 'Add a job' })
  @ApiCreatedResponse({
    description: 'Job created succesfully',
    type: JobDto,
  })
  create(@Body() dto: CreateJobDto) {
    return this.jobService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all products' })
  @ApiOkResponse({
    description: 'List of products returned succesfully',
    type: [CreateJobDto],
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  findAll() {
    return this.jobService.findAll();
  }
}
