import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Nurse, NurseDocument } from '../schemas/nurse.schema';

@Injectable()
export class NurseService {
  constructor(
    @InjectModel(Nurse.name) private nurseModel: Model<NurseDocument>,
  ) {}

  async create(createNurseDto: Partial<Nurse>): Promise<Nurse> {
    const createdNurse = new this.nurseModel(createNurseDto);
    return createdNurse.save();
  }

  async findAll(): Promise<Nurse[]> {
    return this.nurseModel.find().exec();
  }

  async findOne(id: string): Promise<Nurse> {
    const nurse = await this.nurseModel.findById(id).exec();
    if (!nurse) {
      throw new NotFoundException(`Nurse with ID ${id} not found`);
    }
    return nurse;
  }

  async update(id: string, updateNurseDto: Partial<Nurse>): Promise<Nurse> {
    const updatedNurse = await this.nurseModel
      .findByIdAndUpdate(id, updateNurseDto, { new: true })
      .exec();
    if (!updatedNurse) {
      throw new NotFoundException(`Nurse with ID ${id} not found`);
    }
    return updatedNurse;
  }

  async remove(id: string): Promise<Nurse> {
    const deletedNurse = await this.nurseModel.findByIdAndDelete(id).exec();
    if (!deletedNurse) {
      throw new NotFoundException(`Nurse with ID ${id} not found`);
    }
    return deletedNurse;
  }
}
