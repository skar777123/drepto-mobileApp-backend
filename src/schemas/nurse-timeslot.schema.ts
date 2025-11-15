import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NurseServiceType = 'homeCare' | 'followUp' | 'specialty';

export type NurseTimeSlotDocument = NurseTimeSlot & Document;

@Schema({ timestamps: true })
export class NurseTimeSlot {
  @Prop({ required: true })
  nurseId: string;

  @Prop({ required: true, enum: ['homeCare', 'followUp', 'specialty'] })
  serviceType: NurseServiceType;

  @Prop({ required: true })
  time: string;

  @Prop({ required: true })
  date: string;

  @Prop({ required: true, default: true })
  isAvailable: boolean;
}

export const NurseTimeSlotSchema = SchemaFactory.createForClass(NurseTimeSlot);
