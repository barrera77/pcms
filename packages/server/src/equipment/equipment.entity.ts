import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseEntity } from 'src/common/entities/base.entity';

export type EquipmentDocument = Equipment & Document;

@Schema()
export class Equipment extends BaseEntity {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  //Use this as an internal id for all items and to serialize items without manufacturer SN
  @Prop({ required: true })
  sku: string;

  @Prop()
  serialNumber?: string;
}

export const EquipmentSchema = SchemaFactory.createForClass(Equipment);
