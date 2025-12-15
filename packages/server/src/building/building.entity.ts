import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';
import { BaseEntity } from 'src/common/entities/base.entity';

export type BuildingDocument = Building & Document;

@Schema()
export class Building extends BaseEntity {
  @Prop({ required: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'Area' })
  areaId: string;

  @Prop({ required: true })
  numOfUnits: number;

  @Prop({ type: [String], default: [] })
  units: string[];
}

export const BuildingSchema = SchemaFactory.createForClass(Building);
