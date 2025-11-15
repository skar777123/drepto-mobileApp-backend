import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NurseAppointment, NurseAppointmentDocument } from '../schemas/nurse-appointment.schema';

@Injectable()
export class NurseAppointmentService {
  constructor(
    @InjectModel(NurseAppointment.name) private nurseAppointmentModel: Model<NurseAppointmentDocument>,
  ) {}

  async create(createNurseAppointmentDto: Partial<NurseAppointment>): Promise<NurseAppointment> {
    const createdNurseAppointment = new this.nurseAppointmentModel(createNurseAppointmentDto);
    return createdNurseAppointment.save();
  }

  async findAll(): Promise<NurseAppointment[]> {
    return this.nurseAppointmentModel.find().exec();
  }

  async findOne(id: string): Promise<NurseAppointment> {
    const nurseAppointment = await this.nurseAppointmentModel.findById(id).exec();
    if (!nurseAppointment) {
      throw new NotFoundException(`NurseAppointment with ID ${id} not found`);
    }
    return nurseAppointment;
  }

  async update(id: string, updateNurseAppointmentDto: Partial<NurseAppointment>): Promise<NurseAppointment> {
    const updatedNurseAppointment = await this.nurseAppointmentModel.findByIdAndUpdate(id, updateNurseAppointmentDto, { new: true }).exec();
    if (!updatedNurseAppointment) {
      throw new NotFoundException(`NurseAppointment with ID ${id} not found`);
    }
    return updatedNurseAppointment;
  }

  async remove(id: string): Promise<NurseAppointment> {
    const deletedNurseAppointment = await this.nurseAppointmentModel.findByIdAndDelete(id).exec();
    if (!deletedNurseAppointment) {
      throw new NotFoundException(`NurseAppointment with ID ${id} not found`);
    }
    return deletedNurseAppointment;
  }
}
