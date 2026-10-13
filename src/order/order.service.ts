import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from '../schemas/order.schema';

/** Shared order cancellation policy (keep in sync with frontend constants). */
export const ORDER_CANCELLATION_WINDOW_DAYS = 2;
export const REFUND_PROCESSING_TIME = '5-7 working days';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  async create(createOrderDto: any): Promise<Order> {
    const createdOrder = new this.orderModel(createOrderDto);
    return createdOrder.save();
  }

  async findAll(): Promise<Order[]> {
    return this.orderModel.find().exec();
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderModel.findOne({ id }).exec();
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }
  
  async findByUser(userEmail: string): Promise<Order[]> {
    return this.orderModel.find({ userEmail }).exec();
  }

  async update(id: string, updateOrderDto: any): Promise<Order> {
    const updatedOrder = await this.orderModel
      .findOneAndUpdate({ id }, updateOrderDto, { new: true })
      .exec();
    if (!updatedOrder) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return updatedOrder;
  }

  async cancel(id: string): Promise<Order> {
    const order: any = await this.orderModel.findOne({ id }).exec();
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    if (order.status === 'Cancelled') {
      throw new BadRequestException('This order has already been cancelled.');
    }
    if (order.status === 'Delivered' || order.status === 'Dispatched') {
      throw new BadRequestException(
        `Orders that are already ${order.status.toLowerCase()} cannot be cancelled.`,
      );
    }

    const placedAt = new Date(order.createdAt ?? order.date).getTime();
    const windowMs = ORDER_CANCELLATION_WINDOW_DAYS * 24 * 60 * 60 * 1000;
    if (isNaN(placedAt) || Date.now() - placedAt > windowMs) {
      throw new BadRequestException(
        `Orders can only be cancelled within ${ORDER_CANCELLATION_WINDOW_DAYS} days of placing them.`,
      );
    }

    order.status = 'Cancelled';
    order.cancelledAt = new Date().toISOString();
    order.refundStatus = order.paymentId ? 'Pending' : 'Not Applicable';
    return order.save();
  }

  async remove(id: string): Promise<Order> {
    const deletedOrder = await this.orderModel.findOneAndDelete({ id }).exec();
    if (!deletedOrder) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return deletedOrder;
  }
}
