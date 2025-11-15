import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LabTestStatus = 'scheduled' | 'inProgress' | 'completed' | 'cancelled';

export type LabTestBookingDocument = LabTestBooking & Document;

@Schema({ timestamps: true })
export class LabTestBooking {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  labId: string;

  @Prop({ required: true })
  labName: string;

  @Prop({ required: true })
  testName: string;

  @Prop({ required: true, enum: ['blood', 'imaging', 'cardio', 'other'] })
  category: 'blood' | 'imaging' | 'cardio' | 'other';

  @Prop({ required: true })
  date: string;

  @Prop({ required: true })
  time: string;

  @Prop({ required: true, enum: ['scheduled', 'inProgress', 'completed', 'cancelled'] })
  status: LabTestStatus;

  @Prop({ required: true })
  statusLabel: string;

  @Prop({ required: true, default: false })
  hasResult: boolean;

  @Prop({ required: true, default: false })
  requestAttached: boolean;
}

export const LabTestBookingSchema = SchemaFactory.createForClass(LabTestBooking);
