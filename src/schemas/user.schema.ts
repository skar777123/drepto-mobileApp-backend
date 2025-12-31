import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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

  // @Prop({ required: true })
  // address: string;

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
