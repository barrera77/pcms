import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { BaseEntity } from 'src/common/entities/base.entity';

export type EmployeeDocument = Employee & Document;

@Schema()
export class Employee extends BaseEntity {
  @Prop({ required: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'Department' })
  departmentId: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  role: string;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);
