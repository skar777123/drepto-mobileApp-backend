import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LabSlotDocument = LabSlot & Document;

@Schema({ timestamps: true })
export class LabSlot {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  labId: string;

  @Prop({ required: true })
  time: string;

  @Prop({ required: true })
  date: string;

  @Prop({ required: true, default: true })
  isAvailable: boolean;
}

export const LabSlotSchema = SchemaFactory.createForClass(LabSlot);
