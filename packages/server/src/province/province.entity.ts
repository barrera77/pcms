import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProvinceDocument = Province & Document;

@Schema()
export class Province {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  code: String;
}

export const ProvinceSchema = SchemaFactory.createForClass(Province);
