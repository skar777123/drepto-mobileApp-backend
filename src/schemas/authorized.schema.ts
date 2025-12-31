import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AuthorizedDocument = Authorized & Document;

@Schema({ timestamps: true })
export class Authorized {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  // @Prop({ required: true, unique: true })
  // email: string;

  @Prop({ required: true, unique: true })
  mobileNumber: Number;

  // @Prop({ required: true })
  // dateOfBirth: string;

  @Prop()
  gender: string;

  @Prop()
  role: string;

  @Prop()
  roleTitle: string;

  // @Prop()
  // otp: Number;

  // @Prop()
  // otpExpiry: Date;

  @Prop({ required: true })
  password: string;
}

export const AuthorizedSchema = SchemaFactory.createForClass(Authorized);
