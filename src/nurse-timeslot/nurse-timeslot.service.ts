import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NurseTimeSlot, NurseTimeSlotDocument } from '../schemas/nurse-timeslot.schema';

@Injectable()
export class NurseTimeSlotService {
  constructor(
    @InjectModel(NurseTimeSlot.name) private nurseTimeSlotModel: Model<NurseTimeSlotDocument>,
  ) {}

  async create(createNurseTimeSlotDto: Partial<NurseTimeSlot>): Promise<NurseTimeSlot> {
    const createdNurseTimeSlot = new this.nurseTimeSlotModel(createNurseTimeSlotDto);
    return createdNurseTimeSlot.save();
  }

  async findAll(): Promise<NurseTimeSlot[]> {
    return this.nurseTimeSlotModel.find().exec();
  }

  async findOne(id: string): Promise<NurseTimeSlot> {
    const nurseTimeSlot = await this.nurseTimeSlotModel.findById(id).exec();
    if (!nurseTimeSlot) {
      throw new NotFoundException(`NurseTimeSlot with ID ${id} not found`);
    }
    return nurseTimeSlot;
  }

  async update(id: string, updateNurseTimeSlotDto: Partial<NurseTimeSlot>): Promise<NurseTimeSlot> {
    const updatedNurseTimeSlot = await this.nurseTimeSlotModel.findByIdAndUpdate(id, updateNurseTimeSlotDto, { new: true }).exec();
    if (!updatedNurseTimeSlot) {
      throw new NotFoundException(`NurseTimeSlot with ID ${id} not found`);
    }
    return updatedNurseTimeSlot;
  }

  async remove(id: string): Promise<NurseTimeSlot> {
    const deletedNurseTimeSlot = await this.nurseTimeSlotModel.findByIdAndDelete(id).exec();
    if (!deletedNurseTimeSlot) {
      throw new NotFoundException(`NurseTimeSlot with ID ${id} not found`);
    }
    return deletedNurseTimeSlot;
  }
}
