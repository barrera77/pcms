import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from 'src/common/entities/base.entity';

export type InventoryDocument = Inventory & DocumentTimeline;

@Schema({ collection: 'inventory' })
export class Inventory extends BaseEntity {
  @Prop({ required: true })
  itemId: string;

  @Prop({ required: true, enum: ['product', 'equipment'] })
  itemType: 'product' | 'equipment';

  @Prop({ required: true, min: 0 })
  minimumThreshold: number;

  @Prop({ required: true, min: 0 })
  quantity: number;

  @Prop()
  unit?: string;
}

export const InventorySchema = SchemaFactory.createForClass(Inventory);
