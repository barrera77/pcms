import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseEntity } from 'src/common/entities/base.entity';
import type { PestCategory } from '@pcms/pcms-common';
import { PestCategories } from '@pcms/pcms-common';

export type PestDocument = Pest & Document;

@Schema()
export class Pest extends BaseEntity {
  @Prop({ required: true })
  name: string;

  @Prop({ type: String, enum: Object.values(PestCategories), required: true })
  category: PestCategory;

  @Prop()
  description: string;
}

export const PestSchema = SchemaFactory.createForClass(Pest);
