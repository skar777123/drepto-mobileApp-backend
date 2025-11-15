import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DoctorTimeSlot, DoctorTimeSlotDocument } from '../schemas/doctor-timeslot.schema';

@Injectable()
export class DoctorTimeSlotService {
  constructor(
    @InjectModel(DoctorTimeSlot.name) private doctorTimeSlotModel: Model<DoctorTimeSlotDocument>,
  ) {}

  async create(createDoctorTimeSlotDto: Partial<DoctorTimeSlot>): Promise<DoctorTimeSlot> {
    const createdDoctorTimeSlot = new this.doctorTimeSlotModel(createDoctorTimeSlotDto);
    return createdDoctorTimeSlot.save();
  }

  async findAll(): Promise<DoctorTimeSlot[]> {
    return this.doctorTimeSlotModel.find().exec();
  }

  async findOne(id: string): Promise<DoctorTimeSlot> {
    const doctorTimeSlot = await this.doctorTimeSlotModel.findById(id).exec();
    if (!doctorTimeSlot) {
      throw new NotFoundException(`DoctorTimeSlot with ID ${id} not found`);
    }
    return doctorTimeSlot;
  }

  async update(id: string, updateDoctorTimeSlotDto: Partial<DoctorTimeSlot>): Promise<DoctorTimeSlot> {
    const updatedDoctorTimeSlot = await this.doctorTimeSlotModel.findByIdAndUpdate(id, updateDoctorTimeSlotDto, { new: true }).exec();
    if (!updatedDoctorTimeSlot) {
      throw new NotFoundException(`DoctorTimeSlot with ID ${id} not found`);
    }
    return updatedDoctorTimeSlot;
  }

  async remove(id: string): Promise<DoctorTimeSlot> {
    const deletedDoctorTimeSlot = await this.doctorTimeSlotModel.findByIdAndDelete(id).exec();
    if (!deletedDoctorTimeSlot) {
      throw new NotFoundException(`DoctorTimeSlot with ID ${id} not found`);
    }
    return deletedDoctorTimeSlot;
  }
}
