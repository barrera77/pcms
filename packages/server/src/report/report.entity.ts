import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Document, Types } from 'mongoose';
import {
  ReportStatuses,
  SeverityLevels,
  TreatmentTypes,
} from '@pcms/pcms-common';
import type {
  ReportStatus,
  SeverityLevel,
  TreatmentType,
} from '@pcms/pcms-common';
import { ProductUsage } from 'src/product-usage/product-usage.entity';

export type ReportDocument = Report & Document;

@Schema({ collection: 'report' })
export class Report extends BaseEntity {
  @Prop({ required: true })
  date: string;

  @Prop({ type: Types.ObjectId, ref: 'city', required: true })
  cityId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'building', required: true })
  buildingId: Types.ObjectId;

  @Prop({ required: true, type: String })
  unit: string;

  @Prop({ required: true, type: String })
  workOrder: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Pest' }] })
  pestId: Types.ObjectId[];

  @Prop({ required: true, type: String, enum: Object.values(TreatmentTypes) })
  treatmentType: TreatmentType[];

  @Prop({ required: true, type: Number })
  treatmentNo: number;

  @Prop({ type: String, enum: Object.values(SeverityLevels) })
  severity: SeverityLevel;

  @Prop({
    required: true,
    type: String,
    enum: ['in-house', 'contractor'],
    default: 'in-house',
  })
  performedBy: 'in-house' | 'contractor';

  @Prop({ type: String })
  contractorCompany?: string;

  @Prop({
    type: [Types.ObjectId],
    ref: 'employee',
    required: true,
  })
  techIds: Types.ObjectId[];

  @Prop({ required: true, type: [ProductUsage] })
  productUsage: ProductUsage[];

  @Prop({ type: String })
  notes: string;

  @Prop({ type: Boolean })
  requiresFollowUp: boolean;

  //Fields to apply immutability
  @Prop({
    type: String,
    enum: Object.values(ReportStatuses),
    default: ReportStatuses.DRAFT,
  })
  status: ReportStatus;

  @Prop({ type: Date })
  submittedAt?: Date;

  @Prop({ type: Types.ObjectId, ref: 'employee' })
  submittedBy?: Types.ObjectId;
}

export const ReportSchema = SchemaFactory.createForClass(Report);
