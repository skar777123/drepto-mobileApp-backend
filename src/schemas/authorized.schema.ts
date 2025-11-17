import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AuthorizedDocument = Authorized & Document;

@Schema({ timestamps: true })
export class Authorized {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  // @Prop({ required: true, unique: true })
  // email: string;

  @Prop({ required: true , unique: true  })
  mobileNumber: Number;

  // @Prop({ required: true })
  // dateOfBirth: string;

  @Prop({ required: true })
  gender: string;

  @Prop({ required: true })
  role: string;

  @Prop({ required: true })
  roleTitle: string;

  @Prop({ required: true })
  otp: Number;

  @Prop()
  otpExpiry: Date;

  // @Prop({ required: true })
  // password: string;
}

export const AuthorizedSchema = SchemaFactory.createForClass(Authorized);
