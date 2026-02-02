import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ShippingAddressDocument = ShippingAddress & Document;

@Schema({ timestamps: true })
export class ShippingAddress {
    @Prop({ type: Types.ObjectId, ref: 'User', required: false })
    userId?: Types.ObjectId;

    @Prop({ type: String, default: "N/A" })
    houseNo: string;

    @Prop({ type: String, default: "N/A" })
    buildingName: string;

    @Prop({ type: String })
    street: string;

    @Prop({ type: String, default: "N/A" })
    landmark: string;

    @Prop({ type: String, default: "N/A" })
    city: string;

    @Prop({ type: String, default: "N/A" })
    state: string;

    @Prop({ type: String, default: "N/A" })
    country: string;

    @Prop({ required: true })
    pincode: string;

    @Prop({ required: true })
    contactNumber: string;
}

export const ShippingAddressSchema = SchemaFactory.createForClass(ShippingAddress);
