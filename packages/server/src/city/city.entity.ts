import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Province } from 'src/province/province.entity';

@Schema()
export class City {
  @Prop({ required: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'Province' })
  province: Province;
}

export const CitySchema = SchemaFactory.createForClass(City);
