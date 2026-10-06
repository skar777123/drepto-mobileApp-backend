import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ReviewDocument = Review & Document;

@Schema({ timestamps: true })
export class Review {
    @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
    productId: Types.ObjectId | string;

    @Prop({ type: Types.ObjectId, ref: 'User' })
    userId: Types.ObjectId | string;

    @Prop({ required: true, min: 1, max: 5 })
    rating: number;

    @Prop()
    reviewText: string;

    @Prop({ type: [String], default: [] })
    images: string[];

    @Prop({ type: [String], default: [] })
    videos: string[];
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
