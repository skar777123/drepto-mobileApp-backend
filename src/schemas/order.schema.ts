import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrderStatus = 'Placed' | 'Packaging' | 'Dispatched' | 'Delivered' | 'Active';
export type ShippingSource = 'IIT Bombay' | 'Warehouse' | 'Digital';
export type ShippingMethod = 'India Post' | 'Speed Post' | 'Digital';

export type OrderDocument = Order & Document;

@Schema()
export class OrderItem {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  quantity: number;

  @Prop()
  image?: string;

  @Prop({ enum: ['IIT Bombay', 'Warehouse', 'Digital'] })
  shippingSource?: ShippingSource;
}

@Schema()
export class Address {
  @Prop() houseNo?: string;
  @Prop() buildingName?: string;
  @Prop() street?: string;
  @Prop() landmark?: string;
  @Prop() city?: string;
  @Prop() state?: string;
  @Prop() country?: string;
  @Prop() pincode?: string;
  @Prop() contactNumber?: string;
}

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true })
  id: string;

  @Prop()
  userEmail?: string;

  @Prop({ required: true })
  date: string;

  @Prop({ type: [SchemaFactory.createForClass(OrderItem)], required: true })
  items: OrderItem[];

  @Prop({ required: true })
  total: number;

  @Prop({
    required: true,
    enum: ['Placed', 'Packaging', 'Dispatched', 'Delivered', 'Active'],
  })
  status: OrderStatus;

  @Prop({ type: SchemaFactory.createForClass(Address), required: true })
  shippingAddress: Address;

  @Prop()
  trackingId?: string;

  @Prop()
  estimatedDelivery?: string;

  @Prop({ enum: ['India Post', 'Speed Post', 'Digital'] })
  shippingMethod?: ShippingMethod;

  @Prop()
  shippingCost?: number;

  @Prop()
  gst?: number;

  @Prop()
  paymentId?: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
