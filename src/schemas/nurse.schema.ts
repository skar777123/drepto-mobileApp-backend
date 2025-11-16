import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NurseServiceType = 'homeCare' | 'followUp' | 'specialty';

export type NurseDocument = Nurse & Document;

@Schema({ timestamps: true })
export class Nurse {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  mobileNumber: string;

  @Prop({ required: true })
  gender: string;

  @Prop({ required: true })
  dateOfBirth: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  licenseNumber: string;

  @Prop({ required: true })
  role: string;

  @Prop({ required: true })
  specification: string;

  @Prop({ required: true })
  availiability: string;

  @Prop({ required: true })
  isAvailable: boolean;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  experienceYears: number;

  @Prop({ required: true })
  rating: number;

  @Prop({
    required: true,
    type: [String],
    enum: ['homeCare', 'followUp', 'specialty'],
  })
  serviceTypes: NurseServiceType[];
}

export const NurseSchema = SchemaFactory.createForClass(Nurse);
