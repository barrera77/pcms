import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { BaseEntity } from 'src/common/entities/base.entity';

export type EquipmentDocument = Equipment & Document;

@Schema({ collection: 'equipment' })
export class Equipment extends BaseEntity {
  @Prop({ type: String, required: true, unique: true })
  name: string;

  @Prop({ required: true })
  description: string;

  //Use this as an internal id for all items and to serialize items without manufacturer SN
  @Prop({ required: true })
  sku: string;

  @Prop()
  serialNumber?: string;

  @Prop({ type: Types.ObjectId, ref: 'supplier', required: true })
  supplier: Types.ObjectId;
}

export const EquipmentSchema = SchemaFactory.createForClass(Equipment);
