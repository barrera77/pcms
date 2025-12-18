import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IArea } from '@pcms/pcms-common';
import { Types, Document } from 'mongoose';
import { BaseEntity } from 'src/common/entities/base.entity';

export type AreaDocument = Area & Document;

@Schema()
export class Area extends BaseEntity {
  @Prop({ required: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'City' })
  cityId: Types.ObjectId | null;

  @Prop({
    type: Types.ObjectId,
    ref: 'Employee',
    requirerd: false,
    default: null,
  })
  managerId: Types.ObjectId | null;

  //The areas are usually asigned to a crew of 2 techs but at the same time anyone can work there
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Employee' }], default: [] })
  techIds: string[];
}

export const AreaSchema = SchemaFactory.createForClass(Area);
