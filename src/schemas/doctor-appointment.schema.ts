import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AppointmentStatus = 'upcoming' | 'past';

export type DoctorAppointmentDocument = DoctorAppointment & Document;

@Schema({ timestamps: true })
export class DoctorAppointment {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  doctorId: string;

  @Prop({ required: true })
  doctorName: string;

  @Prop({ required: true })
  specialization: string;

  @Prop({ required: true })
  date: string;

  @Prop({ required: true })
  time: string;

  @Prop({ required: true, enum: ['upcoming', 'past'] })
  status: AppointmentStatus;

  @Prop({ required: true })
  reminderText: string;
}

export const DoctorAppointmentSchema =
  SchemaFactory.createForClass(DoctorAppointment);
