import { IsString, IsNumber, IsOptional, IsBoolean, IsIn } from 'class-validator';

export type OfferType = 'BOGO' | 'PERCENTAGE' | 'FLAT';

export class OfferDto {
    @IsOptional()
    @IsString()
    title?: string; // e.g. "Buy 2 Get 1 Free" or "15% OFF"

    @IsOptional()
    @IsString()
    description?: string; // Detailed offer explanation

    @IsOptional()
    @IsIn(['BOGO', 'PERCENTAGE', 'FLAT'])
    type?: OfferType; // Default: 'BOGO'

    @IsOptional()
    @IsNumber()
    buyQuantity?: number; // e.g. 2 for Buy 2

    @IsOptional()
    @IsNumber()
    getFreeQuantity?: number; // e.g. 1 for Get 1 Free

    @IsOptional()
    @IsNumber()
    discountPercentage?: number; // e.g. 20 for 20% off

    @IsOptional()
    @IsNumber()
    flatDiscount?: number; // e.g. 100 for Rs 100 off

    @IsOptional()
    @IsNumber()
    minQuantity?: number; // Minimum quantity to trigger offer, default 1

    @IsOptional()
    @IsBoolean()
    isActive?: boolean; // Default true
}
