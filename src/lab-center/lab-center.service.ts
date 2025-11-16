import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LabCenter, LabCenterDocument } from '../schemas/lab-center.schema';

@Injectable()
export class LabCenterService {
  constructor(
    @InjectModel(LabCenter.name)
    private labCenterModel: Model<LabCenterDocument>,
  ) {}

  async create(createLabCenterDto: Partial<LabCenter>): Promise<LabCenter> {
    const createdLabCenter = new this.labCenterModel(createLabCenterDto);
    return createdLabCenter.save();
  }

  async findAll(): Promise<LabCenter[]> {
    return this.labCenterModel.find().exec();
  }

  async findOne(id: string): Promise<LabCenter> {
    const labCenter = await this.labCenterModel.findById(id).exec();
    if (!labCenter) {
      throw new NotFoundException(`LabCenter with ID ${id} not found`);
    }
    return labCenter;
  }

  async update(
    id: string,
    updateLabCenterDto: Partial<LabCenter>,
  ): Promise<LabCenter> {
    const updatedLabCenter = await this.labCenterModel
      .findByIdAndUpdate(id, updateLabCenterDto, { new: true })
      .exec();
    if (!updatedLabCenter) {
      throw new NotFoundException(`LabCenter with ID ${id} not found`);
    }
    return updatedLabCenter;
  }

  async remove(id: string): Promise<LabCenter> {
    const deletedLabCenter = await this.labCenterModel
      .findByIdAndDelete(id)
      .exec();
    if (!deletedLabCenter) {
      throw new NotFoundException(`LabCenter with ID ${id} not found`);
    }
    return deletedLabCenter;
  }
}
