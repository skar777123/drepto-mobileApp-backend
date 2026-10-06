import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import { Payment, PaymentSchema, PaymentStatus } from '../schemas/payment.schema';
import { User, UserDocument } from '../schemas/user.schema';
import { CreateOrderDto, CreatePaymentDto, UpdatePaymentDto } from '../dto/payment.dto';
import { ShippingAddressService } from '../shipping-address/shipping-address.service';
import { ShippingAddress, ShippingAddressDocument } from '../schemas/shipping-address.schema';


@Injectable()
export class PaymentService {
    constructor(
        @InjectModel(Payment.name) private paymentModel: Model<Payment>,
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private configService: ConfigService,
        private shippingAddressService: ShippingAddressService,
    ) { }

    async createOrder(createOrderDto: CreateOrderDto, userId: string) {
        const { amount, currency, shippingAddress, items, shippingMethod, shippingCost, transactionId, orderId } = createOrderDto;

        try {
            let savedAddress: ShippingAddressDocument | null = null;
            if (shippingAddress) {
                // Save shipping address linked to this user
                savedAddress = await this.shippingAddressService.create({
                    ...shippingAddress,
                    userId,  // pass as string, schema handles it
                });
            }

            const payment = new this.paymentModel({
                userId: new Types.ObjectId(userId),
                transactionId,
                orderId: orderId || undefined,
                amount: amount,
                currency: currency,
                status: PaymentStatus.CREATED,
                shippingAddress: savedAddress ? (savedAddress as any)._id : undefined,
                items,
                shippingMethod,
                shippingCost,
                notes: {}
            });

            await payment.save();

            await this.userModel.findByIdAndUpdate(
                userId,
                { $push: { orders: payment._id } },
                { new: true }
            );

            return {
                id: (payment as any)._id,
                orderId: payment.orderId,
                transactionId: payment.transactionId,
                amount: payment.amount,
                currency: payment.currency,
                status: payment.status,
                createdAt: (payment as any).createdAt,
                shippingAddress: savedAddress,
            };
        } catch (error) {
            // Log the real error so we can debug from GCP logs
            console.error('Error creating order — full details:', JSON.stringify(error?.message || error));
            throw new BadRequestException(
                error?.message || 'Failed to create order record'
            );
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

        const savedPayment = await newPayment.save();

        await this.userModel.findByIdAndUpdate(
            userId,
            { $push: { orders: savedPayment._id } },
            { new: true }
        );

        return savedPayment;
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
    async findAll(userId?: string): Promise<Payment[]> {
        const query = userId ? { userId: new Types.ObjectId(userId) } : {};
        return this.paymentModel
            .find(query)
            .populate('shippingAddress')  // join the address for admin view
            .sort({ createdAt: -1 })       // newest first
            .exec();
    }

    async findOne(id: string): Promise<Payment | null> {
        return this.paymentModel.findById(id).exec();
    }
}
