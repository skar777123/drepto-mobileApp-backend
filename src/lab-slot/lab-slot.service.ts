import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LabSlot, LabSlotDocument } from '../schemas/lab-slot.schema';

@Injectable()
export class LabSlotService {
  constructor(
    @InjectModel(LabSlot.name) private labSlotModel: Model<LabSlotDocument>,
  ) {}

  async create(createLabSlotDto: Partial<LabSlot>): Promise<LabSlot> {
    const createdLabSlot = new this.labSlotModel(createLabSlotDto);
    return createdLabSlot.save();
  }

  async findAll(): Promise<LabSlot[]> {
    return this.labSlotModel.find().exec();
  }

  async findOne(id: string): Promise<LabSlot> {
    const labSlot = await this.labSlotModel.findById(id).exec();
    if (!labSlot) {
      throw new NotFoundException(`LabSlot with ID ${id} not found`);
    }
    return labSlot;
  }

  async update(id: string, updateLabSlotDto: Partial<LabSlot>): Promise<LabSlot> {
    const updatedLabSlot = await this.labSlotModel.findByIdAndUpdate(id, updateLabSlotDto, { new: true }).exec();
    if (!updatedLabSlot) {
      throw new NotFoundException(`LabSlot with ID ${id} not found`);
    }
    return updatedLabSlot;
  }

  async remove(id: string): Promise<LabSlot> {
    const deletedLabSlot = await this.labSlotModel.findByIdAndDelete(id).exec();
    if (!deletedLabSlot) {
      throw new NotFoundException(`LabSlot with ID ${id} not found`);
    }
    return deletedLabSlot;
  }
}
