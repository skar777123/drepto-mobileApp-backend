import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LabCategory = 'blood' | 'imaging' | 'cardio' | 'other';

export type LabCenterDocument = LabCenter & Document;

@Schema({ timestamps: true })
export class LabCenter {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  location: string;

  @Prop({ required: true })
  rating: number;

  @Prop({
    required: true,
    type: [String],
    enum: ['blood', 'imaging', 'cardio', 'other'],
  })
  categories: LabCategory[];

  @Prop({ required: true })
  nextAvailable: string;
}

export const LabCenterSchema = SchemaFactory.createForClass(LabCenter);
