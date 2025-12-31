import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Nurse, CreateNurseDto, LoginNurseDto } from '../interfaces/user.interface';
import { NurseDocument } from '../schemas/nurse.schema';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class NurseService {
  constructor(
    @InjectModel('Nurse') private nurseModel: Model<NurseDocument>,
    private authService: AuthService,
  ) { }

  async register(createNurseDto: CreateNurseDto): Promise<{ nurse: any; token: string }> {
    const { mobileNumber, password, ...rest } = createNurseDto;
    const existingNurse = await this.nurseModel.findOne({ mobileNumber }).exec();
    if (existingNurse) {
      throw new Error('Nurse already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newNurse = new this.nurseModel({
      mobileNumber,
      password: hashedPassword,
      ...rest,
    });
    await newNurse.save();

    const nurseObj = {
      id: (newNurse._id as any).toString(),
      ...newNurse.toObject(),
    };

    const token = await this.authService.generateToken({ id: nurseObj.id, role: nurseObj.role });
    return { nurse: nurseObj, token };
  }

  async login(loginNurseDto: LoginNurseDto): Promise<{ nurse: any; token: string }> {
    const { mobileNumber, password } = loginNurseDto;
    const nurse = await this.nurseModel.findOne({ mobileNumber }).exec();
    if (!nurse) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, nurse.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const nurseObj = {
      id: (nurse._id as any).toString(),
      ...nurse.toObject(),
    };

    const token = await this.authService.generateToken({ id: nurseObj.id, role: nurseObj.role });
    return { nurse: nurseObj, token };
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
