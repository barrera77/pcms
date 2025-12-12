import { Prop } from '@nestjs/mongoose';

export class BaseEntity {
  @Prop({ default: false })
  isInactive: boolean;

  @Prop({ type: Date })
  inactiveAt?: Date;
}
