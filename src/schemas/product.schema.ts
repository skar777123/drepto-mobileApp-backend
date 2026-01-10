
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    description: string;

    @Prop()
    detailedDescription: string;

    @Prop({ required: true })
    price: number;

    @Prop({ required: true })
    mrp: number;

    @Prop({ type: [String], default: [] })
    images: string[];

    @Prop({ required: true })
    category: string;

    @Prop({ type: [String], default: [] })
    ingredients: string[];

    @Prop({ type: [String], default: [] })
    benefits: string[];

    @Prop({ type: [String], default: [] })
    sideEffects: string[];

    @Prop()
    developmentStory: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
