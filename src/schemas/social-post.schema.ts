
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SocialPostDocument = SocialPost & Document;

@Schema({ timestamps: true })
export class SocialPost {
    @Prop({ required: true, enum: ['instagram', 'linkedin', 'twitter', 'reel', 'video', 'youtube'] })
    platform: 'instagram' | 'linkedin' | 'twitter' | 'reel' | 'video' | 'youtube';

    @Prop({ required: true })
    embedUrl: string;

    @Prop()
    title?: string;

    @Prop()
    videoUrl?: string;

    @Prop()
    thumbnailUrl?: string;

    @Prop()
    caption?: string;

    @Prop()
    date?: string;

    @Prop({ default: true })
    isActive: boolean;

    @Prop({ default: 0 })
    order: number;
}

export const SocialPostSchema = SchemaFactory.createForClass(SocialPost);

