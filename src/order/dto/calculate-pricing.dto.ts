export class CalculatePricingItemDto {
  id?: string;
  name?: string;
  price: number | string;
  quantity: number;
  offer?: any;
  offerDescription?: string;
  freeShipping?: boolean;
  image?: string;
}

export class CalculatePricingDto {
  items: CalculatePricingItemDto[];
  shippingMethod?: 'India Post' | 'Speed Post';
  pincode?: string;
}
