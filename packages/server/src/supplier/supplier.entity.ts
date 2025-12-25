import { Prop, Schema } from '@nestjs/mongoose';
import { BaseEntity } from 'src/common/entities/base.entity';

export type SupplierDocument = Supplier & Document;

@Schema({ collection: 'supplier' })
export class Supplier extends BaseEntity {
  @Prop({ type: String, required: true })
  name: string;

  @Prop()
  contactPerson?: string;

  @Prop()
  email?: string;

  @Prop()
  phone?: string;

  @Prop()
  address?: string;
}
