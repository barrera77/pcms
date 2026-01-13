import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Job, JobDocument, JobStatus } from 'src/job/job.entity';
import { Model, Types } from 'mongoose';
import { CreateJobDto } from 'src/job/dto/create-job.dto';

@Injectable()
export class JobService {
  constructor(
    @InjectModel(Job.name)
    private jobModel: Model<JobDocument>,
  ) {}

  async create(dto: CreateJobDto): Promise<Job> {
    return this.jobModel.create({
      workOrder: dto.workOrder,
      techId: new Types.ObjectId(dto.techId),
      cityId: new Types.ObjectId(dto.cityId),
      buildingId: dto.buildingId
        ? new Types.ObjectId(dto.buildingId)
        : undefined,
      unit: dto.unit,
      jobStatus: dto.jobStatus || JobStatus.SCHEDULED,
    });
  }

  async listJobsPerTech(techId: string): Promise<JobDocument[]> {
    return this.jobModel.find({ techId: new Types.ObjectId(techId) }).exec();
  }

  async findById(id: string): Promise<Job | null> {
    const job = await this.jobModel.findById(id).exec();
    if (!job) {
      throw new NotFoundException('Job not found');
    }
    return job;
  }

  async findAll(): Promise<Job[]> {
    return this.jobModel
      .find()
      .populate('cityId')
      .populate('buildingId')
      .populate('techId')
      .exec();
  }

  async clockIn(job: JobDocument) {
    return job.clockIn();
  }

  async clockOut(job: JobDocument) {
    return job.clockOut();
  }

  async updateStatus(
    job: JobDocument,
    status: JobStatus.RESCHEDULED | JobStatus.CANCELLED,
  ) {
    return job.setStatus(status);
  }
}
