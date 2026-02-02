import { Controller, Post, Body, Get, Param, Patch, Delete, UseGuards, Req } from '@nestjs/common';
import { ShippingAddressService } from './shipping-address.service';
import { CreateShippingAddressDto, UpdateShippingAddressDto } from '../dto/shipping-address.dto';
import { AuthGuard } from '../auth/auth.guard';

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

    @UseGuards(AuthGuard)
    @Get()
    findAll(@Req() req) {
        return this.shippingAddressService.findAll(req.user.id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateShippingAddressDto: UpdateShippingAddressDto) {
        return this.shippingAddressService.update(id, updateShippingAddressDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.shippingAddressService.remove(id);
    }
}
