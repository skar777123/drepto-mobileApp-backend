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

    @Prop({ type: Types.ObjectId, ref: 'ShippingAddress', required: false })
    shippingAddress?: Types.ObjectId;

    @Prop({ type: Array, default: [] })
    items: Record<string, any>[];

    @Prop()
    shippingMethod: string;

    @Prop()
    shippingCost: number;

    @Prop({ required: false })
    razorpayOrderId?: string;

    @Prop({ unique: true, sparse: true })
    orderId: string;

    @Prop({ required: true })
    transactionId: string;

    @Prop()
    razorpayPaymentId?: string;

    @Prop()
    razorpaySignature?: string;

    @Prop({ required: true })
    amount: number;

    @Prop({ default: 'INR' })
    currency: string;

    @Prop({ required: false })
    receipt?: string;

    @Prop({
        type: String,
        enum: PaymentStatus,
        default: PaymentStatus.CREATED,
    })
    status: PaymentStatus;

    @Prop({ type: Object })
    notes: Record<string, any>;

    createdAt?: Date;
    updatedAt?: Date;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
