import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AppointmentDocument = Appointment & Document;

@Schema({ timestamps: true })
export class Appointment {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  patientName: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  mobileNumber: string;

  @Prop({ required: true })
  symptoms: string;

  @Prop({ required: true })
  date: string;

  @Prop({ required: true })
  time: string;

  @Prop({ required: true })
  nurseId: string;

  @Prop({ required: true })
  nurseName: string;

  @Prop({ required: true })
  nurseSpecialization: string;

  @Prop({ required: true })
  paymentMethod: string;

  @Prop({ required: true })
  transactionId: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  status: string;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);
