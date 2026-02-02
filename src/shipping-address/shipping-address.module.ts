import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ShippingAddressController } from './shipping-address.controller';
import { ShippingAddressService } from './shipping-address.service';
import { ShippingAddress, ShippingAddressSchema } from '../schemas/shipping-address.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: ShippingAddress.name, schema: ShippingAddressSchema }]),
        AuthModule
    ],
    controllers: [ShippingAddressController],
    providers: [ShippingAddressService],
    exports: [ShippingAddressService],
})
export class ShippingAddressModule { }
