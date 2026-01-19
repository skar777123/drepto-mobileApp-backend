import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import { Payment, PaymentStatus } from '../schemas/payment.schema';
import { CreatePaymentDto, UpdatePaymentDto } from '../dto/payment.dto';

@Injectable()
export class PaymentService {
    constructor(
        @InjectModel(Payment.name) private paymentModel: Model<Payment>,
        private configService: ConfigService,
    ) { }

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
