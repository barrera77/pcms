import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from 'src/common/entities/base.entity';
import type { UserRole } from '@pcms/pcms-common';
import { UserRoles } from '@pcms/pcms-common';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ collection: 'user' })
export class User extends BaseEntity {
  @Prop({ type: String, required: true, unique: true })
  userName: string; //Will be the corporate email

  @Prop({ type: String, deafult: null })
  hashedPassword: string | null;

  @Prop({
    type: String,
    enum: Object.values(UserRoles),
    required: true,
  })
  role: UserRole;

  // Activation tracking
  @Prop({ type: Boolean, default: false })
  isActivated: boolean;

  @Prop({ type: Date })
  activatedAt?: Date;

  //Lock after many unsuccesful attempts
  @Prop({ type: Number, default: 0 })
  failedLoginAttempts: number;

  @Prop({ type: Date, default: null })
  lockedUntil: Date | null;

  //2FA
  @Prop({ type: String, default: null })
  twoFactorSecret: string | null;

  @Prop({ type: Boolean, default: false })
  isTwoFactorEnabled: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ activationToken: 1 });
