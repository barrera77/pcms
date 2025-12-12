import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseEntity } from 'src/common/entities/base.entity';

export type ProvinceDocument = Province & Document;

@Schema()
export class Province extends BaseEntity {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  code: string;
}

export const ProvinceSchema = SchemaFactory.createForClass(Province);
