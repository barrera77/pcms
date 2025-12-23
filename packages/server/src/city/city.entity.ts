import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Province } from 'src/province/province.entity';

export type CityDocument = City & Document;

@Schema()
export class City extends BaseEntity {
  @Prop({ required: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'Province' })
  province: Types.ObjectId | null;
}

export const CitySchema = SchemaFactory.createForClass(City);
