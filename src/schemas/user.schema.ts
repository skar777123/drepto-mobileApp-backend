import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  age: number;

  @Prop({ required: true, unique: true })
  mobileNumber: Number;

  @Prop()
  gender: string;

  @Prop()
  role: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Payment' }] })
  orders: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'ShippingAddress' }] })
  address: Types.ObjectId[];

  // @Prop()
  // medicalHistory: string;

  // @Prop()
  // otp: Number;

  // @Prop()
  // otpExpiry: Date; 

  @Prop({ required: true })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
