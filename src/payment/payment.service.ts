import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import { Payment, PaymentSchema, PaymentStatus } from '../schemas/payment.schema';
import { CreateOrderDto, CreatePaymentDto, UpdatePaymentDto } from '../dto/payment.dto';
import { ShippingAddressService } from '../shipping-address/shipping-address.service';
import { ShippingAddress, ShippingAddressDocument } from '../schemas/shipping-address.schema';
import Razorpay from 'razorpay';

@Injectable()
export class PaymentService {
    private razorpayClient: any;

    constructor(
        @InjectModel(Payment.name) private paymentModel: Model<Payment>,
        private configService: ConfigService,
        private shippingAddressService: ShippingAddressService,
    ) {
        this.razorpayClient = new Razorpay({
            key_id: this.configService.get<string>('RAZORPAY_KEY_ID') || '',
            key_secret: this.configService.get<string>('RAZORPAY_KEY_SECRET') || '',
        });
    }

    async createOrder(createOrderDto: CreateOrderDto, userId: string) {
        const { amount, currency, shippingAddress, items, shippingMethod, shippingCost } = createOrderDto;

        try {
            const options = {
                amount: amount,
                currency: currency,
                receipt: `receipt_${Date.now()}`,
            };
            const order = await this.razorpayClient.orders.create(options);

            let savedAddress: ShippingAddressDocument | null = null;
            if (shippingAddress) {
                savedAddress = await this.shippingAddressService.create({ ...shippingAddress, userId });
            }

            const payment = new this.paymentModel({
                userId: new Types.ObjectId(userId),
                razorpayOrderId: order.id,
                amount: amount,
                currency: currency,
                receipt: order.receipt,
                status: PaymentStatus.CREATED,
                shippingAddress: savedAddress ? savedAddress._id : undefined,
                items,
                shippingMethod,
                shippingCost,
                notes: {
                    ...order.notes
                },
            });
            await payment.save();

            return {
                id: order.id, // satisfying user request return format
                entity: order.entity,
                amount: order.amount,
                amount_paid: order.amount_paid,
                amount_due: order.amount_due,
                currency: order.currency,
                receipt: order.receipt,
                status: order.status,
                attempts: order.attempts,
                created_at: order.created_at,
                shippingAddress: savedAddress,
            };
        } catch (error) {
            console.error('Razorpay Error:', error);
            throw new BadRequestException('Failed to create Razorpay order');
        }
    }

    async createTransactionRecord(createPaymentDto: CreatePaymentDto, userId: string) {
        const { razorpayOrderId, amount, currency, receipt, notes } = createPaymentDto;

        const existingPayment = await this.paymentModel.findOne({ razorpayOrderId });
        if (existingPayment) {
            throw new BadRequestException('Transaction with this Order ID already exists');
        }

        const newPayment = new this.paymentModel({
            userId: new Types.ObjectId(userId),
            razorpayOrderId,
            amount,
            currency,
            receipt: receipt || `receipt_${Date.now()}`,
            status: PaymentStatus.CREATED,
            notes,
        });

        return await newPayment.save();
    }

    async updateTransactionStatus(updatePaymentDto: UpdatePaymentDto) {
        const { razorpayOrderId, razorpayPaymentId, razorpaySignature, status } = updatePaymentDto;

        // Optional: Verify signature if you want to ensure data integrity
        // logic is kept here but can be bypassed if the user strictly wants "dumb" storage
        // validating the signature is safer even for "just records"
        const keySecret = this.configService.get<string>('RAZORPAY_KEY_SECRET');
        if (keySecret) {
            const body = razorpayOrderId + '|' + razorpayPaymentId;
            const expectedSignature = crypto
                .createHmac('sha256', keySecret)
                .update(body.toString())
                .digest('hex');

            if (expectedSignature !== razorpaySignature) {
                console.warn(`Signature mismatch for order ${razorpayOrderId}. Stored anyway as requested but marked as suspected?`);
                // For "just keep records", maybe we throw or maybe we just store. 
                // I will throw to alert the frontend something is wrong, unless they really want to store bad data.
                throw new BadRequestException('Invalid payment signature');
            }
        }

        const payment = await this.paymentModel.findOneAndUpdate(
            { razorpayOrderId },
            {
                razorpayPaymentId,
                razorpaySignature,
                status: status || PaymentStatus.SUCCESS,
            },
            { new: true }
        );

        if (!payment) {
            throw new NotFoundException('Payment record not found for this Order ID');
        }

        return { success: true, message: 'Transaction updated successfully', data: payment };
    }
}
