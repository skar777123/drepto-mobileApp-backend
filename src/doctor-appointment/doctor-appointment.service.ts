import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  DoctorAppointment,
  DoctorAppointmentDocument,
} from '../schemas/doctor-appointment.schema';

@Injectable()
export class DoctorAppointmentService {
  constructor(
    @InjectModel(DoctorAppointment.name)
    private doctorAppointmentModel: Model<DoctorAppointmentDocument>,
  ) {}

  async create(
    createDoctorAppointmentDto: Partial<DoctorAppointment>,
  ): Promise<DoctorAppointment> {
    const createdDoctorAppointment = new this.doctorAppointmentModel(
      createDoctorAppointmentDto,
    );
    return createdDoctorAppointment.save();
  }

  async findAll(): Promise<DoctorAppointment[]> {
    return this.doctorAppointmentModel.find().exec();
  }

  async findOne(id: string): Promise<DoctorAppointment> {
    const doctorAppointment = await this.doctorAppointmentModel
      .findById(id)
      .exec();
    if (!doctorAppointment) {
      throw new NotFoundException(`DoctorAppointment with ID ${id} not found`);
    }
    return doctorAppointment;
  }

  async update(
    id: string,
    updateDoctorAppointmentDto: Partial<DoctorAppointment>,
  ): Promise<DoctorAppointment> {
    const updatedDoctorAppointment = await this.doctorAppointmentModel
      .findByIdAndUpdate(id, updateDoctorAppointmentDto, { new: true })
      .exec();
    if (!updatedDoctorAppointment) {
      throw new NotFoundException(`DoctorAppointment with ID ${id} not found`);
    }
    return updatedDoctorAppointment;
  }

  async remove(id: string): Promise<DoctorAppointment> {
    const deletedDoctorAppointment = await this.doctorAppointmentModel
      .findByIdAndDelete(id)
      .exec();
    if (!deletedDoctorAppointment) {
      throw new NotFoundException(`DoctorAppointment with ID ${id} not found`);
    }
    return deletedDoctorAppointment;
  }
}
