import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DoctorDocument = Doctor & Document;

@Schema({ timestamps: true })
export class Doctor {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  specialization: string;

  @Prop({ required: true })
  experienceYears: number;

  @Prop({ required: true })
  rating: number;

  @Prop({ required: true })
  nextAvailable: string;
}

export const DoctorSchema = SchemaFactory.createForClass(Doctor);
