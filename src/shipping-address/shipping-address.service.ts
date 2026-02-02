import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ShippingAddress, ShippingAddressDocument } from '../schemas/shipping-address.schema';
import { CreateShippingAddressDto, UpdateShippingAddressDto } from '../dto/shipping-address.dto';

@Injectable()
export class ShippingAddressService {
    constructor(
        @InjectModel(ShippingAddress.name) private shippingAddressModel: Model<ShippingAddressDocument>,
    ) { }

    async create(createShippingAddressDto: CreateShippingAddressDto): Promise<ShippingAddressDocument> {
        const createdAddress = new this.shippingAddressModel(createShippingAddressDto);
        return createdAddress.save();
    }

    async findAll(userId?: string): Promise<ShippingAddress[]> {
        const query = userId ? { userId: new Types.ObjectId(userId) } : {};
        return this.shippingAddressModel.find(query).exec();
    }

    async findOne(id: string): Promise<ShippingAddress | null> {
        return this.shippingAddressModel.findById(id).exec();
    }

    async update(id: string, updateShippingAddressDto: UpdateShippingAddressDto): Promise<ShippingAddress | null> {
        return this.shippingAddressModel.findByIdAndUpdate(id, updateShippingAddressDto, { new: true }).exec();
    }

    async remove(id: string): Promise<ShippingAddress | null> {
        return this.shippingAddressModel.findByIdAndDelete(id).exec();
    }
}
