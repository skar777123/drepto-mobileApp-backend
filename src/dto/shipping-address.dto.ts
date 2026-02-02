import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateShippingAddressDto {
    @IsOptional()
    @IsString()
    userId?: string;

    @IsNotEmpty()
    @IsString()
    houseNo: string;

    @IsOptional()
    @IsString()
    buildingName?: string;

    @IsNotEmpty()
    @IsString()
    street: string;

    @IsOptional()
    @IsString()
    landmark?: string;

    @IsNotEmpty()
    @IsString()
    city: string;

    @IsNotEmpty()
    @IsString()
    state: string;

    @IsNotEmpty()
    @IsString()
    country: string;

    @IsNotEmpty()
    @IsString()
    pincode: string;

    @IsNotEmpty()
    @IsString()
    contactNumber: string;
}

export class UpdateShippingAddressDto extends CreateShippingAddressDto { }
