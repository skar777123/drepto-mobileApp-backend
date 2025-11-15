import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DoctorTimeSlotDocument = DoctorTimeSlot & Document;

@Schema({ timestamps: true })
export class DoctorTimeSlot {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  doctorId: string;

  @Prop({ required: true })
  time: string;

  @Prop({ required: true })
  date: string;

  @Prop({ required: true, default: true })
  isAvailable: boolean;
}

export const DoctorTimeSlotSchema = SchemaFactory.createForClass(DoctorTimeSlot);
