import { IsArray, IsOptional, IsString } from 'class-validator';

export class CalculatePricingItemDto {
  @IsOptional()
  _id?: string;

  @IsOptional()
  id?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  price?: number | string;

  @IsOptional()
  quantity?: number;

  @IsOptional()
  offer?: any;

  @IsOptional()
  offerDescription?: string;

  @IsOptional()
  freeShipping?: boolean;

  @IsOptional()
  image?: string;
}

export class CalculatePricingDto {
  @IsArray()
  items: CalculatePricingItemDto[];

  @IsOptional()
  @IsString()
  shippingMethod?: 'India Post' | 'Speed Post';

  @IsOptional()
  @IsString()
  pincode?: string;
}
