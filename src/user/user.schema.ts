import { AbstractDocument } from '@app/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum userTypes {
  ADMIN = 'admin',
  CUSTOMER = 'customer',
}

@Schema({ timestamps: true })
export class User extends AbstractDocument {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: userTypes, default: userTypes.CUSTOMER })
  type?: string;

  @Prop({ default: false })
  isVerified?: boolean;
}

export const userSchema = SchemaFactory.createForClass(User);
