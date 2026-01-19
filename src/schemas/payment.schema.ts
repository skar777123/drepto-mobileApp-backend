import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum PaymentStatus {
    CREATED = 'created',
    SUCCESS = 'success',
    FAILED = 'failed',
}

@Schema({ timestamps: true })
export class Payment extends Document {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: Types.ObjectId;

    @Prop({ required: true, unique: true })
    razorpayOrderId: string;

    @Prop()
    razorpayPaymentId?: string;

    @Prop()
    razorpaySignature?: string;

    @Prop({ required: true })
    amount: number; // Stored in subunits (e.g., 50000 for ₹500.00)

    @Prop({ default: 'INR' })
    currency: string;

    @Prop({ required: true, unique: true })
    receipt: string; // Your internal tracking ID

    @Prop({
        type: String,
        enum: PaymentStatus,
        default: PaymentStatus.CREATED,
    })
    status: PaymentStatus;

    @Prop({ type: Object })
    notes: Record<string, any>; // For custom metadata
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
