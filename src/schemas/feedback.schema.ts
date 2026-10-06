import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FeedbackDocument = Feedback & Document;

@Schema({ timestamps: true })
export class Feedback {
  @Prop({ required: true })
  name: string;

  @Prop()
  email: string;

  @Prop({ required: true })
  rating: number;

  @Prop({ required: true })
  message: string;

  @Prop({ default: true }) // Using true by default so testimonials appear right away, adjust if needed
  is_approved: boolean;
}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);
