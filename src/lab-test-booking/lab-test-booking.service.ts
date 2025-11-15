import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LabTestBooking, LabTestBookingDocument } from '../schemas/lab-test-booking.schema';

@Injectable()
export class LabTestBookingService {
  constructor(
    @InjectModel(LabTestBooking.name) private labTestBookingModel: Model<LabTestBookingDocument>,
  ) {}

  async create(createLabTestBookingDto: Partial<LabTestBooking>): Promise<LabTestBooking> {
    const createdLabTestBooking = new this.labTestBookingModel(createLabTestBookingDto);
    return createdLabTestBooking.save();
  }

  async findAll(): Promise<LabTestBooking[]> {
    return this.labTestBookingModel.find().exec();
  }

  async findOne(id: string): Promise<LabTestBooking> {
    const labTestBooking = await this.labTestBookingModel.findById(id).exec();
    if (!labTestBooking) {
      throw new NotFoundException(`LabTestBooking with ID ${id} not found`);
    }
    return labTestBooking;
  }

  async update(id: string, updateLabTestBookingDto: Partial<LabTestBooking>): Promise<LabTestBooking> {
    const updatedLabTestBooking = await this.labTestBookingModel.findByIdAndUpdate(id, updateLabTestBookingDto, { new: true }).exec();
    if (!updatedLabTestBooking) {
      throw new NotFoundException(`LabTestBooking with ID ${id} not found`);
    }
    return updatedLabTestBooking;
  }

  async remove(id: string): Promise<LabTestBooking> {
    const deletedLabTestBooking = await this.labTestBookingModel.findByIdAndDelete(id).exec();
    if (!deletedLabTestBooking) {
      throw new NotFoundException(`LabTestBooking with ID ${id} not found`);
    }
    return deletedLabTestBooking;
  }
}
