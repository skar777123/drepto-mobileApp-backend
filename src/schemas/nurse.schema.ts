import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NurseServiceType = 'general' | 'icu' | 'surgical';

export type NurseDocument = Nurse & Document;

@Schema({ timestamps: true })
export class Nurse {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  // @Prop({ required: true, unique: true })
  // email: string;

  @Prop({ required: true })
  mobileNumber: Number;

  @Prop()
  gender: string;

  @Prop()
  dateOfBirth: string;

  // @Prop({ required: true })
  // address: string;

  @Prop()
  licenseNumber: string;

  //Upload

  @Prop()
  role: string;

  @Prop()
  specification: string;

  @Prop()
  availiability: string;

  @Prop()
  isAvailable: boolean;

  // @Prop({ required: true })
  // password: string;

  @Prop()
  experienceYears: number;

  // @Prop({ required: true })
  // rating: number;

  @Prop()
  otp: Number;

  @Prop()
  otpExpiry: Date;

  @Prop({
    required: true,
    type: [String],
    enum: ['general', 'icu', 'surgical'],
  })
  serviceTypes: NurseServiceType[];
}

export const NurseSchema = SchemaFactory.createForClass(Nurse);
