import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ProductCategories } from '@pcms/pcms-common';
import type { ProductCategory } from '@pcms/pcms-common';
import { Types } from 'mongoose';
import { BaseEntity } from 'src/common/entities/base.entity';

export type ProductDocument = Product & Document;

@Schema({ collection: 'product' })
export class Product extends BaseEntity {
  @Prop({ type: String, required: true, unique: true })
  name: string;

  @Prop({
    type: String,
    enum: Object.values(ProductCategories),
    required: true,
  })
  category: ProductCategory;

  @Prop()
  activeIngredient: string;

  @Prop()
  labelUrl: string;

  @Prop()
  msdsUrl: string;

  @Prop({ type: Types.ObjectId, ref: 'Supplier', required: true })
  supplier: Types.ObjectId;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
