import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from 'src/common/entities/base.entity';

export type DepartmentDocument = Department & Document;

@Schema()
export class Department extends BaseEntity {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;
}

export const DepartmentSchema = SchemaFactory.createForClass(Department);
