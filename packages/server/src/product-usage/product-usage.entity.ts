import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';
import { BaseEntity } from 'src/common/entities/base.entity';

export type ProductUsageDocument = ProductUsage & Document;

@Schema({ _id: false })
export class ProductUsage {
  @Prop({ required: true, type: Types.ObjectId, ref: 'product' })
  productId: Types.ObjectId;

  @Prop({ type: Number })
  ConcentrationPercent: number;

  @Prop({ type: String })
  quantity: string;
}

export const ProductUsageSchema = SchemaFactory.createForClass(ProductUsage);
