import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NurseServiceType = 'homeCare' | 'followUp' | 'specialty';

export type NurseAppointmentStatus =
  | 'scheduled'
  | 'inProgress'
  | 'completed'
  | 'cancelled';

export type NurseAppointmentDocument = NurseAppointment & Document;

@Schema({ timestamps: true })
export class NurseAppointment {
  @Prop({ required: true })
  nurseId: string;

  @Prop({ required: true })
  nurseName: string;

  @Prop({ required: true, enum: ['homeCare', 'followUp', 'specialty'] })
  serviceType: NurseServiceType;

  @Prop({ required: true })
  date: string;

  @Prop({ required: true })
  time: string;

  @Prop({
    required: true,
    enum: ['scheduled', 'inProgress', 'completed', 'cancelled'],
  })
  status: NurseAppointmentStatus;

  @Prop({ required: true })
  statusLabel: string;
}

export const NurseAppointmentSchema =
  SchemaFactory.createForClass(NurseAppointment);
