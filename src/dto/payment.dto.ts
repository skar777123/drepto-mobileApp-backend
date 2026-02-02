import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentStatus } from '../schemas/payment.schema';
import { CreateShippingAddressDto } from './shipping-address.dto';

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

export class CreateOrderDto {
    @IsNumber()
    @IsNotEmpty()
    amount: number;

    @IsString()
    @IsNotEmpty()
    currency: string;

    @IsOptional()
    @ValidateNested()
    @Type(() => CreateShippingAddressDto)
    shippingAddress?: CreateShippingAddressDto;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    items: OrderItemDto[];

    @IsString()
    @IsNotEmpty()
    shippingMethod: string;

    @IsNumber()
    @IsNotEmpty()
    shippingCost: number;
}

export class OrderItemDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumber()
    @IsNotEmpty()
    price: number;

    @IsNumber()
    @IsNotEmpty()
    quantity: number;

    @IsOptional()
    @IsString()
    image?: string;

    @IsOptional()
    @IsString()
    shippingSource?: string;
}
