import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Document, Types } from 'mongoose';

export enum JobStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  RESCHEDULED = 'rescheduled',
}

export type JobDocument = Job & Document;

@Schema({ collection: 'job' })
export class Job extends BaseEntity {
  @Prop({ required: true })
  workOrder: string;

  @Prop({ required: true })
  date: string;

  @Prop({ type: Types.ObjectId, ref: 'city', required: true })
  cityId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'building' })
  buildingId: Types.ObjectId;
  @Prop({ required: true, type: String })
  unit: string;

  @Prop({ type: Types.ObjectId, ref: 'employee', required: true })
  techId: Types.ObjectId;

  // Clocking info
  @Prop({ type: Date })
  clockInAt?: Date;

  @Prop({ type: Date })
  clockOutAt?: Date;

  @Prop({
    type: String,
    enum: Object.values(JobStatus),
    default: JobStatus.SCHEDULED,
  })
  jobStatus: JobStatus;

  //Clocking methods
  clockIn(this: JobDocument) {
    this.clockInAt = new Date();
    this.jobStatus = JobStatus.IN_PROGRESS;
    return this.save();
  }

  clockOut(this: JobDocument) {
    this.clockOutAt = new Date();
    this.jobStatus = JobStatus.COMPLETED;
    return this.save();
  }

  //Manual override for the status in case of cancelation
  setStatus(
    this: JobDocument,
    status: JobStatus.RESCHEDULED | JobStatus.CANCELLED,
  ) {
    this.jobStatus = status;
    return this.save();
  }
}

export const JobSchema = SchemaFactory.createForClass(Job);
