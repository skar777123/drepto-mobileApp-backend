import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ShippingAddressService } from './shipping-address.service';
import { CreateShippingAddressDto } from '../dto/shipping-address.dto';

@Controller('shipping-address')
export class ShippingAddressController {
    constructor(private readonly shippingAddressService: ShippingAddressService) { }

    @Post()
    create(@Body() createShippingAddressDto: CreateShippingAddressDto) {
        return this.shippingAddressService.create(createShippingAddressDto);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.shippingAddressService.findOne(id);
    }
}
