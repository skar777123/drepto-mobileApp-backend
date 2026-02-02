import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ShippingAddress, ShippingAddressDocument } from '../schemas/shipping-address.schema';
import { CreateShippingAddressDto } from '../dto/shipping-address.dto';

@Injectable()
export class ShippingAddressService {
    constructor(
        @InjectModel(ShippingAddress.name) private shippingAddressModel: Model<ShippingAddressDocument>,
    ) { }

    async create(createShippingAddressDto: CreateShippingAddressDto): Promise<ShippingAddressDocument> {
        const createdAddress = new this.shippingAddressModel(createShippingAddressDto);
        return createdAddress.save();
    }

    async findOne(id: string): Promise<ShippingAddress | null> {
        return this.shippingAddressModel.findById(id).exec();
    }
}
