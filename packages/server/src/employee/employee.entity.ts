import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { EmployeeRoles } from '@pcms/pcms-common';
import type { EmployeeRole } from '@pcms/pcms-common';
import { Types, Document } from 'mongoose';
import { BaseEntity } from 'src/common/entities/base.entity';

export type EmployeeDocument = Employee & Document;

@Schema({ collection: 'employee' })
export class Employee extends BaseEntity {
  @Prop({ required: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'Department' })
  departmentId: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true, type: String, enum: Object.values(EmployeeRoles) })
  role: EmployeeRole;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);
