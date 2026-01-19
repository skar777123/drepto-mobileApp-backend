import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { PaymentStatus } from '../schemas/payment.schema';

export class CreatePaymentDto {
    @IsString()
    @IsNotEmpty()
    razorpayOrderId: string;

    @IsNumber()
    @IsNotEmpty()
    amount: number;

    @IsString()
    @IsNotEmpty()
    currency: string;

    @IsString()
    @IsOptional()
    receipt?: string;

    @IsOptional()
    notes?: Record<string, any>;
}

export class UpdatePaymentDto {
    @IsString()
    @IsNotEmpty()
    razorpayOrderId: string;

    @IsString()
    @IsNotEmpty()
    razorpayPaymentId: string;

    @IsString()
    @IsNotEmpty()
    razorpaySignature: string;

    @IsEnum(PaymentStatus)
    @IsOptional()
    status?: PaymentStatus;
}
